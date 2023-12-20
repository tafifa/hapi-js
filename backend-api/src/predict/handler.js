const { checkAuthorization } = require('../exceptions/unauthorized');

const { predict } = require('./services');

const postImageHandler = async (request, h) => {
  const key = request.headers['x-api-key'];
  checkAuthorization({ request, h }, key);

  return await predict({ request, h });
};

module.exports = { postImageHandler };
