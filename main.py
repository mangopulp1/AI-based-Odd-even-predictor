from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from ml_model import EvenOddModel
from typing import Optional
import uvicorn

app = FastAPI(title="AI Predictor API")

# Define the base directory (the folder where main.py is located)
BASE_DIR = Path(__file__).resolve().parent

# Mount the 'static' directory to serve CSS, JS, and other assets
# This maps the URL path /static to the local directory {BASE_DIR}/static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

# Ensure your 'templates' directory is correct
templates = Jinja2Templates(directory=BASE_DIR / "templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Pass the 'request' object, which is REQUIRED for Jinja2's url_for
    return templates.TemplateResponse("index.html", {"request": request, "active_page": "home"})

@app.get("/history", response_class=HTMLResponse)
async def history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request, "active_page": "history"})

@app.get("/About-AI", response_class=HTMLResponse)
async def cpu(request: Request):
    return templates.TemplateResponse("About-AI.html", {"request": request, "active_page": "about-ai"})

@app.get("/configuration", response_class=HTMLResponse)
async def configuration(request: Request):
    return templates.TemplateResponse("configuration.html", {"request": request, "active_page": "configuration"})

 
@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get("/forgot_password", response_class=HTMLResponse)
async def forgot_password(request: Request):
    return templates.TemplateResponse("forgot_password.html", {"request": request})

@app.get("/Reset_password", response_class=HTMLResponse)
async def reset_password(request: Request):
    return templates.TemplateResponse("Reset_password.html", {"request": request})

@app.post("/predict", response_class=JSONResponse)
async def predict(number: str = Form(...), allow_decimal: Optional[str] = Form(None)):
    """
    Predict whether a number is even or odd.
    """
    try:
        if not number.strip():
            return JSONResponse(content={"prediction": "Please enter a number"}, status_code=400)

        allow_decimal_bool = bool(allow_decimal) if allow_decimal is not None else False

        model = EvenOddModel(allow_decimal=allow_decimal_bool)
        result = model.predict(number)

        return JSONResponse(content={"prediction": result, "confidence": 0.95}, status_code=200)
    except ValueError as e:
        return JSONResponse(content={"prediction": f"Validation Error: {str(e)}"}, status_code=400)
    except Exception as e:
        # It's always a good idea to log the full exception
        print(f"Prediction Error: {e}") 
        return JSONResponse(content={"prediction": f"ERROR: {str(e)}"}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
