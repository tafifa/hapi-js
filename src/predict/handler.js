const { predict } = require("./services");

const postImage = async (request, h) => {
  const { imageFile, taskName } = request.payload;

  console.log(imageFile)
  console.log(taskName)

  if (!imageFile || !taskName) {
    return h.response({ error: 'Missing imageFile or taskName data' }).code(400);
  }

  console.log(imageFile)

  const predictResults = await predict({ imageFile, taskName });
  // const predictResults = "boi";

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

module.exports = { postImage };