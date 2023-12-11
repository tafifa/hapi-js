const api_key = require("../../.private/key.json").api_key;
const { predict, addPoint, takenBy } = require("./services");

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

  const { imageFile, UID } = request.payload;
  const { museumId, taskId } = request.params;
  // console.log('Request Payload:', payload, '\nRequest Params:', params);

  const predictResults = await predict({ imageFile, museumId, taskId });
  // console.log(predictResults)
  if (predictResults == "success") {
    if (!await takenBy({ museumId, taskId, UID })) {
      await addPoint({ UID });
    }
  };

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