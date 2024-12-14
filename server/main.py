from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from http import HTTPStatus

def response_builder(status, message, data):
    response = {"status": status, "message": message, "data": data}
    return JSONResponse(status_code=status, content=response)

app = FastAPI()

@app.on_event("startup")
def startup_event():
    print("Server is starting up...")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return response_builder(HTTPStatus.BAD_REQUEST, exc.detail, None)

@app.exception_handler(Exception)
async def exception_handler(request, exc):
    return response_builder(HTTPStatus.INTERNAL_SERVER_ERROR, str(exc), None)

@app.get("/api")
def health_check():
    return response_builder(HTTPStatus.OK, "Server is running!", None)