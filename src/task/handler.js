const { checkAuthorization } = require('../exceptions/unauthorized');

const { getAllMuseum, getAllTask, getTaskById } = require('./services');

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

const getTaskByIdHandler = async (request, h) => {
  const key = request.headers['x-api-key'];
  checkAuthorization({ request, h }, key);

  return await getTaskById({ request, h });
};

module.exports = { getAllMuseumHandler, getAllTaskHandler, getTaskByIdHandler };
