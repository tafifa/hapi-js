const {
  getAllRewardsHandler,
  getRewardByIdHandler,
} = require("./handler");

const routes = [
  // Ambil Seluruh Data Rewards
  {
    method: "GET",
    path: "/rewards/{museum_id}",
    handler: getAllRewardsHandler,
  },

  // Ambil Data Rewards Tertentu
  {
    method: "GET",
    path: "/rewards/{museum_id}/{reward_id}",
    handler: getRewardByIdHandler,
  },

];

// Export Routes
module.exports = routes;
