from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from ml_model import EvenOddModel
from typing import Optional

app = FastAPI(title="AI Predictor API")

BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.mount("/js", StaticFiles(directory=BASE_DIR / "js"), name="js")  # Consider moving to static/js

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_class=JSONResponse)
async def predict(number: str = Form(...), allow_decimal: Optional[str] = Form(None)):
    """
    Predict whether a number is even or odd.

    - **number**: The input number to predict (required).
    - **allow_decimal**: Optional flag to allow decimal number prediction (default: False).
    """
    try:
        if not number.strip():
            return JSONResponse(content={"prediction": "Please enter a number"}, status_code=400)

        allow_decimal_bool = bool(allow_decimal) if allow_decimal is not None else False

        model = EvenOddModel(allow_decimal=allow_decimal_bool)
        result = model.predict(number)

        return JSONResponse(content={"prediction": result}, status_code=200)
    except ValueError:
        return JSONResponse(content={"prediction": "Please enter a valid number"}, status_code=400)
    except Exception as e:
        return JSONResponse(content={"prediction": f"ERROR: {str(e)}"}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)