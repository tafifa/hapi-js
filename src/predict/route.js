const {
  postImage,
} = require("./handler");

const route = [ 
  {
    method: "POST",
    path: "/predict",
    handler: postImage,
    options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          // maxBytes: 2 * 1024 * 1024,
        },
    },
  },
  {
    method: 'GET',
    path: '/predict',
    handler: (request, h) => {
      return { result: 'Server is running and connected' };
    }
  },
];

module.exports = route ;