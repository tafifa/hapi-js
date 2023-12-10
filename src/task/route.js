const {
  getAllMuseumHandler,
  getAllTaskHandler,
} = require("./handler");

const route = [ 
  {
    method: "GET",
    path: "/museum",
    handler: getAllMuseumHandler,
    // handler: () => ({ result: 'Server is running and connected' })
  },
  {
    method: "GET",
    path: "/museum/{museumId}",
    handler: getAllTaskHandler,
  },
  {
    method: 'GET',
    path: '/museum/check',
    handler: () => ({ result: 'Server is running and connected' })
  },
];

module.exports = route ;