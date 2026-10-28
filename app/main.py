"""FastAPI application implementing the Vehicle Service API contract."""

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.models import ALLOWED_FIELDS, REQUIRED_CREATE_FIELDS, VehicleCreate
from app.store import VehicleConflictError, VehicleNotFoundError, store

app = FastAPI(
    title="Vehicle Service API",
    version="1.0.0",
    description="Python implementation of the Postman Vehicle Service collection.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _error(status_code: int, message: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"message": message})


@app.get("/vehicles")
def get_all_vehicles():
    try:
        return store.list()
    except Exception:
        return _error(500, "An unexpected error occurred from the server.")


@app.post("/vehicles", status_code=status.HTTP_201_CREATED)
async def create_vehicle(request: Request):
    try:
        body = await request.json()
    except Exception:
        return _error(400, "Bad request body.")

    if not isinstance(body, dict):
        return _error(400, "Bad request body.")

    # Validate required attributes with the exact contract message.
    for field in REQUIRED_CREATE_FIELDS:
        if field not in body or body[field] is None:
            return _error(400, f"Request body missing required attribute: {field}")

    try:
        vehicle_in = VehicleCreate(**body)
    except Exception:
        return _error(400, "Bad request body.")

    try:
        created = store.add(vehicle_in.model_dump())
    except VehicleConflictError as exc:
        return _error(409, str(exc))
    except Exception:
        return _error(500, "An unexpected error occurred.")

    return created


@app.get("/vehicles/{vehicle_id}")
def get_vehicle(vehicle_id: int):
    try:
        return store.get(vehicle_id)
    except VehicleNotFoundError as exc:
        return _error(404, str(exc))
    except Exception:
        return _error(500, "An unexpected error occurred.")


@app.patch("/vehicles/{vehicle_id}")
async def update_vehicle(vehicle_id: int, request: Request):
    try:
        body = await request.json()
    except Exception:
        return _error(400, "Bad request body.")

    if not isinstance(body, dict) or not body:
        return _error(400, "Bad request body.")

    # Reject any unrecognised fields.
    if not set(body.keys()).issubset(ALLOWED_FIELDS):
        return _error(400, "Bad request body.")

    try:
        updated = store.update(vehicle_id, body)
    except VehicleNotFoundError as exc:
        return _error(404, str(exc))
    except Exception:
        return _error(500, "An unexpected error occurred.")

    return updated


@app.delete("/vehicles/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int):
    try:
        store.delete(vehicle_id)
    except VehicleNotFoundError as exc:
        return _error(404, str(exc))
    except Exception:
        return _error(500, "An unexpected error occurred.")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
