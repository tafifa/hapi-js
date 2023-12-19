const { invariantError } = require('../exceptions/invariantError');

const firebaseAdmin = require('firebase-admin');

const getAllRewards = async ({ request, h }) => {
  const {
    museum_id,
  } = request.params;

  const db = firebaseAdmin.firestore();
  const outputDb = db.collection('museum').doc(museum_id);
  const museumData = await outputDb.get();

  if (!museumData.exists) {
    const message = "Museum not found";
    console.log(message);
    return invariantError({ request, h }, message);
  }

  let rewardData = [];
  const subOutputDb = await outputDb.collection('reward').get();
  subOutputDb.forEach((doc) => {
    rewardData.push(doc.data());
  });

  rewardData = rewardData.sort((a, b) => a.reward_id - b.reward_id);

  const fieldOrder = [
    'reward_id',
    'reward_doc',
    'reward_name',
    'reward_point',
    'url_reward_img',
  ];

  // Sort the array of objects based on the field order
  rewardData = rewardData.map((obj) => {
    const sortedObj = {};
    fieldOrder.forEach((field) => {
      sortedObj[field] = obj[field];
    });
    return sortedObj;
  });

  console.log(rewardData);

  return h.response({
    error: false,
    message: "Get Reward data success!",
    rewardData,
  }).code(201);
};

const getRewardById = async ({ request, h }) => {
  const {
    museum_id,
    reward_id,
  } = request.params;

  const db = firebaseAdmin.firestore();
  const museumOutputDb = db.collection('museum').doc(museum_id);
  const museumData = await museumOutputDb.get();

  if (!museumData.exists) {
    const message = "Museum not found";
    console.log(message);
    return invariantError({ request, h }, message);
  }

  const rewardOutputDb = await museumOutputDb.collection('reward')
      .doc(reward_id)
      .get();

  let rewardData = rewardOutputDb.data();
  const fieldOrder = [
    'reward_id',
    'reward_doc',
    'reward_name',
    'reward_point',
    'url_reward_img',
  ];

  rewardData = Object.fromEntries(
      fieldOrder.map((key) => [key, rewardData[key]]),
  );

  if (!rewardOutputDb.exists) {
    const message = "Reward not found";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  console.log(rewardData);

  return h.response({
    error: false,
    message: "Get Reward data success!",
    rewardData,
  }).code(201);
};

module.exports = { getAllRewards, getRewardById };
