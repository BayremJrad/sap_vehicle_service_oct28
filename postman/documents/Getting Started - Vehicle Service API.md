# Getting Started — Vehicle Service API

Welcome to the **Vehicle Service Collection**. This guide walks you through everything you need to know to configure your environment and start sending successful requests against the Vehicle Service API.

---

## Prerequisites

Before sending your first request, make sure you have the following in place:

- Access to the **Vehicle Service** workspace in Postman
- The **Mock Environment** selected as your active environment
- A value set for the `baseUrl` variable (see [Environment Setup](#environment-setup) below)

---

## Environment Setup

All requests in this collection use the `{{baseUrl}}` variable to construct endpoint URLs. This variable must be set before any request will work.

**Steps:**

1. In the Postman sidebar, click **Environments** and open **Mock Environment**.
2. Set the **Current Value** of `baseUrl` to your target server URL.
   - If you are using the Postman Mock Server, paste the mock server URL here.
   - If you are pointing at a live or local server, use that base URL (e.g. `http://localhost:3000`).
3. Make sure **Mock Environment** is selected as the active environment using the environment picker in the top-right corner of Postman.
4. Save the environment.

> **Tip:** The collection-level variable `baseUrl` is set to `{{baseUrl}}` as a fallback, but the environment value always takes precedence. Always set the value in the environment, not the collection.

---

## Authorization

This collection does **not** have authentication configured at the collection or request level. Depending on your deployment, one of the following will apply:

| Scenario | What to do |
|---|---|
| **Mock Server (no auth required)** | No action needed — requests will work as-is once `baseUrl` is set. |
| **Live API with API Key** | Add an `Authorization` header or an `x-api-key` header to the collection. Open the collection → **Authorization** tab → select **API Key** and fill in your key. |
| **Live API with Bearer Token** | Open the collection → **Authorization** tab → select **Bearer Token** and paste your token. All requests will inherit it automatically. |
| **Per-request auth** | Open an individual request → **Authorization** tab → configure auth for that request only. |

To set auth at the collection level (so all requests inherit it):
1. Click on **Vehicle Service Collection** in the sidebar.
2. Go to the **Authorization** tab.
3. Choose your auth type and fill in the required credentials.
4. All requests that have their auth set to **Inherit auth from parent** will automatically use it.

---

## Sending Your First Request

The recommended order for exploring the API is:

### 1. Create a Vehicle — `POST /vehicles`

Use this request to add a new vehicle to the system.

**Request body (JSON):**
```json
{
  "nickName": "The Lisa Marie",
  "vin": "4M2DV11W4RDJ53329",
  "make": "Mercury",
  "model": "Villager",
  "year": "1994",
  "miles": 159864
}
```

**Expected response:** `201 - Success` with the created vehicle object.

**Common errors:**
- `400 - Missing required attribute` — one or more required fields are absent from the body.
- `409 - Vehicle already exists` — a vehicle with the same VIN is already registered.

---

### 2. Get All Vehicles — `GET /vehicles`

Retrieves the full list of vehicles in the system. No request body or path parameters required.

**Expected response:** `200 - Success` with an array of vehicle objects.

---

### 3. Retrieve a Vehicle — `GET /vehicles/:id`

Fetches a single vehicle by its unique ID.

**Path parameter:**
- `:id` — the unique identifier of the vehicle returned when it was created.

**Expected response:** `200 - Success` with the vehicle object.

**Common errors:**
- `404 - Not found` — no vehicle exists with the given ID.

---

### 4. Update a Vehicle — `PATCH /vehicles/:id`

Updates one or more fields on an existing vehicle.

**Path parameter:**
- `:id` — the unique identifier of the vehicle to update.

**Request body:** Include only the fields you want to update (partial update).

**Expected response:** `200 - Success` with the updated vehicle object.

**Common errors:**
- `400 - Bad request body` — the request body contains invalid or unrecognised fields.

---

### 5. Delete a Vehicle — `DELETE /vehicles/:id`

Permanently removes a vehicle from the system.

**Path parameter:**
- `:id` — the unique identifier of the vehicle to delete.

**Expected response:** `204 - Success` (no response body).

---

## Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/vehicles` | Create a new vehicle |
| `GET` | `/vehicles` | Retrieve all vehicles |
| `GET` | `/vehicles/:id` | Retrieve a single vehicle by ID |
| `PATCH` | `/vehicles/:id` | Update an existing vehicle |
| `DELETE` | `/vehicles/:id` | Delete a vehicle |

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| `Could not send request` / connection error | `baseUrl` is empty or incorrect | Set `baseUrl` in the Mock Environment |
| `401 Unauthorized` | Auth not configured | Set up auth at the collection level (see Authorization section) |
| `404 Not found` | Wrong `:id` path parameter | Use an ID returned from a previous Create or Get All request |
| `409 Vehicle already exists` | Duplicate VIN | Change the `vin` field in the request body |
| `500 Unexpected error` | Server-side issue | Check the server logs or retry the request |

---

## Next Steps

- Run the full collection using the **Collection Runner** to execute all requests in sequence.
- Set up a **Monitor** to run the collection on a schedule and catch regressions automatically.
- Explore the saved **Examples** on each request to see the full range of expected responses.

---