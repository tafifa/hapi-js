const {
  postImageHandler,
} = require('./handler');

const route = [
  {
    method: 'POST',
    path: '/predict/{museum_id}/{object_id}',
    handler: postImageHandler,
    options: {
      payload: {
        output: 'data',
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 2 * 1024 * 1024,
      },
    },
  },
  {
    method: 'GET',
    path: '/predict',
    handler: () => ({ result: 'Server is running and connected' }),
  },
];

module.exports = route;
