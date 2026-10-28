# Vehicle Service API (Python)

A FastAPI implementation of the Postman **Vehicle Service** collection / API contract.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/vehicles` | List all vehicles |
| POST | `/vehicles` | Create a vehicle |
| GET | `/vehicles/{id}` | Retrieve a vehicle by id |
| PATCH | `/vehicles/{id}` | Partially update a vehicle |
| DELETE | `/vehicles/{id}` | Delete a vehicle |

## Setup & run

```bash
# 1. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # on macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive docs are at `http://localhost:8000/docs`.

## Using with Postman

Set the `{{baseUrl}}` variable in the **Vehicle Service Collection** (or your active environment) to:

```
http://localhost:8000
```

Then the collection's requests (Get all vehicles, Create a vehicle, Retrieve a vehicle, Update a vehicle, Delete a vehicle) will run against this local app.

## Notes

- Data is stored **in memory** and resets on restart. The store is seeded with two example vehicles.
- VINs must be unique; creating a duplicate VIN returns `409 Conflict`.
