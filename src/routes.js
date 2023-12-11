const userRoutes = require("./user/route");
const userRoutes2 = require("./user2/routes")
const predictRoutes = require("./predict/route")
const taskRoutes = require("./task/route")

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return { result: 'Server is running and connected' };
    }
  },
  ...userRoutes,
  ...userRoutes2,
  ...predictRoutes,
  ...taskRoutes,
];

module.exports = routes;