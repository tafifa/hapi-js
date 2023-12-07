const userRoutes = require("./user/route");
const predictRoutes = require("./predict/route")

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return { result: 'Server is running and connected' };
    }
  },
  ...userRoutes,
  ...predictRoutes,
];

module.exports = routes;