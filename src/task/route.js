const {
  getAllMuseumHandler,
  getAllTaskHandler,
} = require('./handler');

const route = [
  {
    method: 'GET',
    path: '/museum',
    handler: getAllMuseumHandler,
  },
  {
    method: 'GET',
    path: '/museum/{museum_id}',
    handler: getAllTaskHandler,
  },
  {
    method: 'GET',
    path: '/museum/check',
    handler: () => ({ result: 'Server is running and connected' }),
  },
];

module.exports = route;
