const { getAllMuseum, getAllTask } = require("./services");

const getAllMuseumHandler = async (request, h) => {
  const museum = await getAllMuseum();
  const response = h.response({
    status: 'success',
    message: 'Gambar berhasil terkirim',
    data: {
      museum,
    },
  });
  response.code(201);
  return response;
};

const getAllTaskHandler = async (request, h) => {
  const { museumid } = request.params;
  const task = await getAllTask(museumid);
  const response = h.response({
    status: 'success',
    message: 'Gambar berhasil terkirim',
    data: {
      task,
    },
  });
  response.code(201);
  return response;
};

module.exports = { getAllMuseumHandler, getAllTaskHandler };