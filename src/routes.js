const userRoutes = require('./user/route');
const adminRoutes = require('./admin/user2/routes');
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
  ...adminRoutes,
  ...predictRoutes,
  ...taskRoutes,
];

module.exports = routes;