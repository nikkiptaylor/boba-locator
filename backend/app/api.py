from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import pandas as pd
from haversine import haversine, Unit
from json import dumps


app = FastAPI()
data = pd.read_csv("bayarea_boba_spots.csv", header=0, index_col=0).fillna("")
logger.info("Loaded Boba data.")

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "*localhost:3000",
    "http://127.0.0.1",
    "http://10.0.0.225:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "API for reading from a CSV file of boba locations"}


@app.get("/nearby_boba/")
async def get_nearby_boba(latitude: float = None, longitude: float = None, max_miles=1):
    if not latitude and longitude:
        logger.warning("Request with no lat or long provided")
        raise HTTPException(
            status_code=400, detail="Must provide latitude and longitude"
        )
    logger.info(
        f"Request: lat = {latitude}, long = {longitude}, max miles = {max_miles}"
    )
    data["dist"] = data.apply(
        lambda x: round(
            haversine((x["lat"], x["long"]), (latitude, longitude), unit=Unit.MILES), 2
        ),
        axis=1,
    )
    close_boba = data[data["dist"] <= max_miles]
    close_boba_dict = close_boba.to_dict(orient="records")
    logger.info(f"Num boba places found in walking dist: {len(close_boba)}")
    return close_boba_dict
