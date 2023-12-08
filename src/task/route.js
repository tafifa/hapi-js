const {
  getAllMuseumHandler,
  getAllTaskHandler,
} = require("./handler");

const route = [ 
  {
    method: "GET",
    path: "/museum",
    handler: getAllMuseumHandler,
  },
  {
    method: "GET",
    path: "/museum/{museumid}/task",
    handler: getAllTaskHandler,
  },
  {
    method: 'GET',
    path: '/task',
    handler: () => ({ result: 'Server is running and connected' })
  },
];

module.exports = route ;