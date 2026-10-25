from fastapi import FastAPI

app = FastAPI()


@app.get("/api/plant")
def get_plant():
    return {
        "name": "name: Confirmed frontend and backend are connected",
        "species": "Boston fern",
        "moisture": 52,
        "temperature": 23,
        "source": "simulated",
    }
