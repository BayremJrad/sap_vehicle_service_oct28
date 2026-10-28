"""In-memory data store for vehicles.

This keeps the implementation dependency-free. In a real deployment you would
swap this out for a database-backed repository.
"""

from typing import Dict, List, Optional


class VehicleNotFoundError(Exception):
    """Raised when a vehicle with the given id does not exist."""

    def __init__(self, vehicle_id: int):
        self.vehicle_id = vehicle_id
        super().__init__(f"Vehicle with id: {vehicle_id} not found.")


class VehicleConflictError(Exception):
    """Raised when a vehicle with the same VIN already exists."""

    def __init__(self, vin: str, existing_id: int):
        self.vin = vin
        self.existing_id = existing_id
        super().__init__(
            f"Vehicle with VIN {vin} already exists. Existing vehicle ID: {existing_id}"
        )


class VehicleStore:
    """A simple auto-incrementing in-memory store keyed by vehicle id."""

    def __init__(self):
        self._vehicles: Dict[int, dict] = {}
        self._next_id: int = 1
        self._seed()

    def _seed(self) -> None:
        """Pre-populate the store so GET /vehicles returns data immediately."""
        self.add(
            {
                "nickName": "The Lisa Marie",
                "vin": "4M2DV11W4RDJ53329",
                "make": "Mercury",
                "model": "Villager",
                "year": "1994",
                "miles": 159864,
            }
        )
        self.add(
            {
                "nickName": "Commuter",
                "vin": "JN8AZ2KR1AT169594",
                "make": "Nissan",
                "model": "Rogue",
                "year": "2010",
                "miles": 98000,
            }
        )

    def list(self) -> List[dict]:
        return list(self._vehicles.values())

    def get(self, vehicle_id: int) -> dict:
        vehicle = self._vehicles.get(vehicle_id)
        if vehicle is None:
            raise VehicleNotFoundError(vehicle_id)
        return vehicle

    def find_by_vin(self, vin: str) -> Optional[dict]:
        for vehicle in self._vehicles.values():
            if vehicle.get("vin") == vin:
                return vehicle
        return None

    def add(self, data: dict) -> dict:
        existing = self.find_by_vin(data.get("vin"))
        if existing is not None:
            raise VehicleConflictError(data["vin"], existing["id"])

        vehicle = {
            "id": self._next_id,
            "nickName": data.get("nickName"),
            "vin": data["vin"],
            "make": data["make"],
            "model": data["model"],
            "year": data["year"],
            "miles": data["miles"],
        }
        self._vehicles[self._next_id] = vehicle
        self._next_id += 1
        return vehicle

    def update(self, vehicle_id: int, changes: dict) -> dict:
        vehicle = self.get(vehicle_id)  # raises VehicleNotFoundError if missing
        vehicle.update(changes)
        return vehicle

    def delete(self, vehicle_id: int) -> None:
        if vehicle_id not in self._vehicles:
            raise VehicleNotFoundError(vehicle_id)
        del self._vehicles[vehicle_id]


# A single shared store instance for the running application.
store = VehicleStore()
