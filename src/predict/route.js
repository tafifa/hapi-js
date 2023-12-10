const {
  postImageHandler,
} = require("./handler");

const route = [ 
  {
    method: "POST",
    path: "/predict",
    handler: postImageHandler,
    options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          maxBytes: 2 * 1024 * 1024,
        },
    },
  },
  {
    method: 'GET',
    path: '/predict/check',
    handler: () => ({ result: 'Server is running and connected' })
  },
];

module.exports = route ;