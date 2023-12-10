const api_key = require("../../.private/key.json").api_key;
const { createUserRegister } = require("./services");

const registerUser = async (request, h) => {
  const key = request.headers["x-api-key"];
  if (key !== api_key) {
    const response = h.response({
    status: "unauthorized",
    });
    response.code(401);
    return response;
  }

  await createUserRegister(request);

  const response = h.response({
    status: "success",
  });
  response.code(200);
  return response;
};

const loginUser = async (request, h) => {
  const key = request.headers["x-api-key"];
  if (key !== api_key) {
    const response = h.response({
    status: "unauthorized",
    });
    response.code(401);
    return response;
  }

  await checkUserLogin(request);

  const response = h.response({
    status: "success",
  });
  response.code(200);
  return response;
}

module.exports = { registerUser, loginUser };