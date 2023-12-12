const userRoutes = require('./user/route');
const predictRoutes = require('./predict/route');
const taskRoutes = require('./task/route');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: () => {
      return { result: 'Server is running and connected' };
    },
  },
  ...userRoutes,
  ...predictRoutes,
  ...taskRoutes,
];

module.exports = routes;