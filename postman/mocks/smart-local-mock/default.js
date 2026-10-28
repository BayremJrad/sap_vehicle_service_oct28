const http = require('http');

// @endpoint POST /vehicles
// @endpoint GET /vehicles
// @endpoint GET /vehicles/:id
// @endpoint PATCH /vehicles/:id
// @endpoint DELETE /vehicles/:id

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost`);
  const pathname = url.pathname;
  const method = req.method;

  // Helper: read request body
  const readBody = () => new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });

  // Helper: send JSON response
  const sendJSON = (statusCode, body) => {
    const payload = body !== undefined ? JSON.stringify(body) : '';
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    });
    res.end(payload);
  };

  // Helper: send empty response (204)
  const sendEmpty = (statusCode) => {
    res.writeHead(statusCode);
    res.end();
  };

  // Get vehicle store from pm.state
  const getStore = async () => (await pm.state.get('vehicles:store')) || {};
  const setStore = async (store) => pm.state.set('vehicles:store', store);

  // Route: POST /vehicles
  if (method === 'POST' && pathname === '/vehicles') {
    let body;
    try {
      body = await readBody();
    } catch (e) {
      return sendJSON(400, { error: 'Invalid JSON body' });
    }

    const { nickName, vin, make, model, year, miles } = body;

    // Validate required fields
    const missing = [];
    if (!vin) missing.push('vin');
    if (!make) missing.push('make');
    if (!model) missing.push('model');
    if (year === undefined || year === null || year === '') missing.push('year');
    if (miles === undefined || miles === null || miles === '') missing.push('miles');

    if (missing.length > 0) {
      return sendJSON(400, { error: `Missing required fields: ${missing.join(', ')}` });
    }

    const store = await getStore();

    // Check for duplicate VIN
    const duplicate = Object.values(store).find(v => v.vin === vin);
    if (duplicate) {
      return sendJSON(409, { error: `Vehicle with VIN '${vin}' already exists` });
    }

    // Auto-generate numeric id
    const id = await pm.state.increment('vehicles:nextId');

    const vehicle = { id, nickName: nickName || null, vin, make, model, year, miles };
    store[id] = vehicle;
    await setStore(store);

    return sendJSON(201, vehicle);
  }

  // Route: GET /vehicles
  if (method === 'GET' && pathname === '/vehicles') {
    const store = await getStore();
    return sendJSON(200, Object.values(store));
  }

  // Route: GET /vehicles/:id
  const singleVehicleMatch = pathname.match(/^\/vehicles\/(\d+)$/);
  if (method === 'GET' && singleVehicleMatch) {
    const id = parseInt(singleVehicleMatch[1], 10);
    const store = await getStore();
    const vehicle = store[id];
    if (!vehicle) {
      return sendJSON(404, { error: `Vehicle with id '${id}' not found` });
    }
    return sendJSON(200, vehicle);
  }

  // Route: PATCH /vehicles/:id
  if (method === 'PATCH' && singleVehicleMatch) {
    const id = parseInt(singleVehicleMatch[1], 10);
    const store = await getStore();
    const vehicle = store[id];
    if (!vehicle) {
      return sendJSON(404, { error: `Vehicle with id '${id}' not found` });
    }

    let body;
    try {
      body = await readBody();
    } catch (e) {
      return sendJSON(400, { error: 'Invalid JSON body' });
    }

    const allowedFields = ['nickName', 'vin', 'make', 'model', 'year', 'miles'];
    const updated = { ...vehicle };
    let hasUpdate = false;
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updated[field] = body[field];
        hasUpdate = true;
      }
    }

    if (!hasUpdate) {
      return sendJSON(400, { error: 'No valid fields provided for update' });
    }

    store[id] = updated;
    await setStore(store);
    return sendJSON(200, updated);
  }

  // Route: DELETE /vehicles/:id
  if (method === 'DELETE' && singleVehicleMatch) {
    const id = parseInt(singleVehicleMatch[1], 10);
    const store = await getStore();
    if (!store[id]) {
      return sendJSON(404, { error: `Vehicle with id '${id}' not found` });
    }
    delete store[id];
    await setStore(store);
    return sendEmpty(204);
  }

  // Fallback: 404
  return sendJSON(404, { error: 'Route not found' });
});

server.listen(process.env.PORT);
