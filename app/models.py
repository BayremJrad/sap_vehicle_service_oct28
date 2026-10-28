"""Pydantic schemas for the Vehicle Service API."""

from typing import Optional

from pydantic import BaseModel


# Fields required when creating a vehicle (nickName is optional).
REQUIRED_CREATE_FIELDS = ["vin", "make", "model", "year", "miles"]

# All fields a client is allowed to send/update.
ALLOWED_FIELDS = {"nickName", "vin", "make", "model", "year", "miles"}


class VehicleCreate(BaseModel):
    """Request body for creating a vehicle."""

    nickName: Optional[str] = None
    vin: str
    make: str
    model: str
    year: str
    miles: int


class Vehicle(BaseModel):
    """A full vehicle record as returned by the API."""

    id: int
    nickName: Optional[str] = None
    vin: str
    make: str
    model: str
    year: str
    miles: int


class Message(BaseModel):
    """Standard error response body."""

    message: str
