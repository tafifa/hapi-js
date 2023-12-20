const { checkAuthorization } = require('../exceptions/unauthorized');

const { getAllRewards, getRewardById } = require('./services');

const getAllRewardsHandler = async (request, h) => {
  const key = request.headers['x-api-key'];
  checkAuthorization({ request, h }, key);

  return await getAllRewards({ request, h });
};

const getRewardByIdHandler = async (request, h) => {
  const key = request.headers['x-api-key'];
  checkAuthorization({ request, h }, key);

  return await getRewardById({ request, h });
};

module.exports = { getAllRewardsHandler, getRewardByIdHandler };
