const api_key = require("../../.private/key.json").api_key;
const { predict, addPoint } = require("./services");

const postImageHandler = async (request, h) => {
  const key = request.headers["x-api-key"];
  if (key !== api_key) {
    const response = h.response({
      status: "unauthorized",
    });
    response.code(401);
    return response;
  }

  if (!request.payload) {
    return h.response({ error: 'Missing imageFile or taskName data' }).code(400);
  }

  const { imageFile, taskName, UID } = request.payload;
  // console.log('Request Payload:', payload, '\nRequest Params:', params);

  

  const predictResults = await predict({ imageFile, taskName });
  // console.log(predictResults)
  if (predictResults == "success") await addPoint({ UID });

  const response = h.response({
    status: 'success',
    message: 'Gambar berhasil terkirim',
    data: {
      result: predictResults,
    },
  });
  response.code(201);
  return response;
}

module.exports = { postImageHandler };