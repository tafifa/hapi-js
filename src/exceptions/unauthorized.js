const apiKey = require('../../.private/key.json').api_key;

const checkAuthorization = async ({ request, h }, key) => {
  if (key !== apiKey) {
    return h.response({
      error: 'Client Rrror',
      status: 'unauthorized',
    });
  }
};

module.exports = { checkAuthorization };