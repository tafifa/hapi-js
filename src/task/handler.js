const { checkAuthorization } = require('../exceptions/unauthorized');

const { getAllMuseum, getAllTask } = require('./services');

const getAllMuseumHandler = async (request, h) => {
  const key = request.headers['x-api-key'];
  checkAuthorization({ request, h }, key);

  return await getAllMuseum({ request, h });
};

const getAllTaskHandler = async (request, h) => {
  const key = request.headers['x-api-key'];
  checkAuthorization({ request, h }, key);

  return await getAllTask({ request, h });
};

module.exports = { getAllMuseumHandler, getAllTaskHandler };
