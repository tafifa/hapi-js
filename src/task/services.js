const { invariantError } = require('../exceptions/invariantError');

const firebaseAdmin = require('firebase-admin');

const getAllMuseum = async ({ request, h }) => {
  const db = firebaseAdmin.firestore();
  const outputDb = await db.collection('museum').get();

  const museumData = [];
  outputDb.forEach((doc) => {
    museumData.push(doc.data());
  });

  return h.response({
    status: 'success',
    data: {
      museumData,
    },
  }).code(201);
};

const getAllTask = async ({ request, h }) => {
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

  const taskData = [];
  const subOutputDb = await outputDb.collection('object').get();
  subOutputDb.forEach((doc) => {
    taskData.push(doc.data());
  });

  return h.response({
    status: 'success',
    data: {
      taskData,
    },
  }).code(201);
};

module.exports = { getAllMuseum, getAllTask };
