from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from http import HTTPStatus

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

@app.exception_handler(StarletteHTTPException)
async def exception_handler(request, exc: StarletteHTTPException):
    return response_builder(exc.status_code, exc.detail, None, True, None)

@app.on_event("startup")
def startup_event():
    print(f'Server is starting up...')

@app.get("/api")
def health_check():
    return response_builder(HTTPStatus.OK, "Server is running!", None)