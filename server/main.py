import torch
import torch.nn as nn
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from http import HTTPStatus
from pydantic import BaseModel, model_validator

df1 =  pd.read_csv("../dataset/train.csv", sep=';')
df2 =  pd.read_csv("../dataset/test.csv", sep=';')
df3 =  pd.read_csv("../dataset/evaluation.csv", sep=';')
df = pd.concat([df1, df2,df3], ignore_index=True)
df.head()

# device selection: MPS (for macOS with Apple Silicon), CUDA, or CPU
device = 'mps' if torch.backends.mps.is_available() else 'cuda' if torch.cuda.is_available() else 'cpu'

class FakeNewsBinaryClassifier(nn.Module):
    def __init__(self, input_dim):
        super(FakeNewsBinaryClassifier, self).__init__()
        self.network = nn.Sequential(nn.Linear(input_dim, 128),
                                     nn.ReLU(),
                                     nn.Linear(128, 64),
                                     nn.ReLU(),
                                     nn.Linear(64, 1),
                                     nn.Sigmoid())

    def forward(self, x):
        return self.network(x)
    
loaded_model = FakeNewsBinaryClassifier(input_dim=1000).to(device)
loaded_model.load_state_dict(torch.load('../notebook/fake_news_classifier.pth', weights_only=True))
loaded_model.eval()

vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
vectorizer.fit_transform(df['title'] + " " + df['text']).toarray()

def predict(model, X):
    with torch.no_grad():
        output = model(X)
        true_percentage = output.item() * 100  
        false_percentage = 100 - true_percentage  
        
        prediction = True if true_percentage >= 50 else False
    return {"prediction": prediction, "true_percentage": true_percentage, "false_percentage": false_percentage}

def response_builder(status, message, data, isError=False, error=None):
    response = {"status": status, "message": message, "data": data} if not isError else {"status": status, "message": message, "error": error}
    return JSONResponse(status_code=status, content=response)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    return response_builder(HTTPStatus.BAD_REQUEST, "Validation error", None, True, exc.errors())

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return response_builder(exc.status_code, exc.detail, None, True, None)

@app.exception_handler(StarletteHTTPException)
async def exception_handler(request, exc: StarletteHTTPException):
    return response_builder(exc.status_code, exc.detail, None, True, None)

@app.on_event("startup")
def startup_event():
    print(f'Server is starting up using device: {device}')

@app.get("/api")
def health_check():
    return response_builder(HTTPStatus.OK, "Server is running!", None)

class FakeNewsRequest(BaseModel):
    title: str
    content: str

    @model_validator(mode='after')
    def check_title_and_content(cls, values):
        errors = []
        title = values.title
        content = values.content

        if title and len(title.split()) < 5:
            errors.append("Title must contain at least 5 words")
        if content and len(content.split()) < 50:
            errors.append("Content must contain at least 50 words")

        if errors:
            raise RequestValidationError(
                errors=errors
            )
        return values

@app.post("/api/detect")
def detect_fake_news(request: FakeNewsRequest):
    sample_combined = request.title + ' ' + request.content
    sample_vector = vectorizer.transform([sample_combined]).toarray()
    sample_tensor = torch.tensor(sample_vector, dtype=torch.float32).to(device)
    prediction = predict(loaded_model, sample_tensor)
    return response_builder(HTTPStatus.OK, "Prediction successful", prediction)