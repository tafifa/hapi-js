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
  {
    method: 'GET',
    path: '/search',
    handler: (request, h) => {
      const { category, brand, model } = request.query;
      
      if (!category || !brand || !model) {
        return h.response({ error: 'Category, brand, and model are required parameters' }).code(400);
      }

      return `Search results: Category - ${category}, Brand - ${brand}, Model - ${model}`;
    },
  },
  ...userRoutes,
  ...userRoutes2,
  ...predictRoutes,
  ...taskRoutes,
];

module.exports = routes;