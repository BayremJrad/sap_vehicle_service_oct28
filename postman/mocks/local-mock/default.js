/**
 * Get started with your virtual shopping cart.
 *   1. POST /cart/items   add items to buy
 *   2. GET  /cart         see what's in the cart
 *   3. POST /checkout     place the order
 * 
 * Click Start to build your cart and checkout.
 * 
 * Add more routes and annotate using @endpoint <method> /<path>.
 * You can also select existing requests and examples to mock.
 * 
 * Deploying this mock gives you a url which can be shared, used in CI and more.
 */
const http = require("http");
const PORT = process.env.PORT || 4500;
const JSON_HEADER = { "Content-Type": "application/json" };

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const cart = (await pm.state.get("cart")) || [];

 

  // @endpoint POST /vehicles
  // POST Vehicle
  if (method === 'POST' && url === '/vehicles') {
    res.writeHead(201, JSON_HEADER);
    res.end(JSON.stringify({
      "id": 1,
      "nickName": "The Lisa Marie",
      "vin": "4M2DV11W4RDJ53329",
      "make": "Mercury",
      "model": "Villager",
      "year": "1994",
      "miles": "159,864"
    }));
    return;
  }
  // @endpoint GET /vehicles/:id
  // GET /vehicles/:id - Retrieve a vehicle
  if (method === 'GET' && /^\/vehicles\/[^\/]+$/.test(url)) {
    res.writeHead(200, JSON_HEADER);
    res.end(JSON.stringify({
      "id": 1,
      "nickName": "The Lisa Marie",
      "vin": "4M2DV11W4RDJ53329",
      "make": "Mercury",
      "model": "Villager",
      "year": "1994",
      "miles": 159864
    }));
    return;
  }
  // @endpoint PATCH /vehicles/:id
  // PATCH /vehicles/:id - Update a vehicle
  if (method === 'PATCH' && /^\/vehicles\/[^\/]+$/.test(url)) {
    res.writeHead(200, JSON_HEADER);
    res.end(JSON.stringify({
      "id": 1,
      "nickName": "The Lisa Marie",
      "vin": "4M2DV11W4RDJ53329",
      "make": "Mercury",
      "model": "Villager",
      "year": "1994",
      "miles": 159999
    }));
    return;
  }
  // DELETE /vehicles/:id - Delete a vehicle
  if (method === 'DELETE' && /^\/vehicles\/[^\/]+$/.test(url)) {
    res.writeHead(204, {});
    res.end();
    return;
  }
  // GET /vehicles - Get all vehicles
  if (method === 'GET' && url === '/vehicles') {
    res.writeHead(200, JSON_HEADER);
    res.end(JSON.stringify([
      {
        "id": 4605,
        "nickName": "string",
        "vin": "string",
        "make": "string",
        "model": "string",
        "year": "string",
        "miles": 8325
      },
      {
        "id": 1187,
        "nickName": "string",
        "vin": "string",
        "make": "string",
        "model": "string",
        "year": "string",
        "miles": 2367
      }
    ]));
    return;
  }
  res.writeHead(404, JSON_HEADER);
  res.end(JSON.stringify({
    error: "Endpoint not defined",
    message: `Please add ${url} endpoint to this mock.`
  }));
});

server.listen(PORT, () => console.log(`Mock server on port ${PORT}`));