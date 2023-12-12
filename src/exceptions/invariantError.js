const invariantError = async ({ request, h }, message) => {
  return h.response({
    error: 'Client Error',
    message: message,
  }).code(400);
};

module.exports = { invariantError };
