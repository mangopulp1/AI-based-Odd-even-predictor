from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from ml_model import EvenOddModel

app = FastAPI(title="AI Predictor API")

BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.mount("/js", StaticFiles(directory=BASE_DIR / "js"), name="js")

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_class=JSONResponse)
async def predict(number: str = Form(""), allow_decimal: str = Form(None)):
    model = EvenOddModel(allow_decimal=bool(allow_decimal))
    result = model.predict(number)
    return JSONResponse(content={"prediction": result})
