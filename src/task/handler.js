const api_key = require("../../.private/key.json").api_key;

const { getAllMuseum, getAllTask } = require("./services");

const getAllMuseumHandler = async (request, h) => {
  const key = request.headers["x-api-key"];
  if (key !== api_key) {
    const response = h.response({
      status: "unauthorized",
    });
    response.code(401);
    return response;
  }

  const museum = await getAllMuseum();
  const response = h.response({
    status: 'success',
    data: {
      museum,
    },
  });
  response.code(201);
  return response;
};

const getAllTaskHandler = async (request, h) => {
  const key = request.headers["x-api-key"];
  if (key !== api_key) {
    const response = h.response({
      status: "unauthorized",
    });
    response.code(401);
    return response;
  }

  const { museumId } = request.params;
  const task = await getAllTask({museumId});

  console.log(task);
  
  const response = h.response({
    status: 'success',
    data: {
      task,
    },
  });
  response.code(201);
  return response;
};

module.exports = { getAllMuseumHandler, getAllTaskHandler };