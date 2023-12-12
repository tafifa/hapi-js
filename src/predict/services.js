const { invariantError } = require('../exceptions/invariantError');

const axios = require('axios');
const FormData = require('form-data');
const firebaseAdmin = require('firebase-admin');

const predict = async ({ request, h }) => {
  if (!request.payload) {
    const message = "Missing imageFile or user_id data";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  const { imageFile, user_id } = request.payload;
  const { museum_id, object_id } = request.params;

  const db = firebaseAdmin.firestore();

  const outputDbUser = db.collection('users');

  const userQuery = await outputDbUser.where('user_id', '==', user_id).get();
  if (userQuery.size == 0) {
    const message = "User didn't exists";
    console.log(message);
    return invariantError({ request, h }, message);
  };
  const userData = userQuery.docs[0].data();

  const outputDbMuseum = db.collection('museum')
      .doc(museum_id)
      .collection('object')
      .doc(object_id);

  const objectData = await outputDbMuseum.get();
  if (!objectData.exists) {
    const message = "Museum or Object not found";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  if (await takenBy({ user_id }, { objectData })) {
    const message = "Object has been taked by user";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  const MLapiurl = 'https://ml-tfjs-bx6pwrssuq-et.a.run.app/predicts';

  const formData = new FormData();
  formData.append('image', Buffer.from(imageFile), {
    filename: 'image.jpg',
    contentType: 'image/jpeg',
  });

  const requestMLapi = await axios.post(
      MLapiurl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
  );
  const responseMLapi = requestMLapi.data;

  const object_name = objectData.data().object_name;
  if (object_name !== responseMLapi.result) {
    return h.response({
      error: false,
      message: "Gambar berhasil terkirim",
      result: "Gagal",
    }).code(201);
  };

  await addPoint(
      { user_id },
      { outputDbUser, userData },
      { outputDbMuseum, objectData },
  );

  return h.response({
    error: false,
    message: "Gambar berhasil terkirim",
    result: "Berhasil",
  }).code(201);
};

const takenBy = async ({ user_id }, { objectData }) => {
  const currentObject = await objectData.get('takenBy') || [];

  if (currentObject.includes(user_id)) {
    return true;
  }
  return false;
};

const addPoint = async (
    { user_id },
    { outputDbUser, userData },
    { outputDbMuseum, objectData }) => {
  const currentObject = objectData.get('takenBy') || [];
  const pointsToAdd = objectData.get('points');
  const objectName = objectData.get('object_name');

  const updatedObject = [...currentObject, user_id];
  await outputDbMuseum.update({
    takenBy: updatedObject,
  });

  const currentPoints = userData.user_points || 0;
  const currentUser = await userData.completedTask || [];
  const updatedPoints = currentPoints + pointsToAdd;

  const updatedUser = [...currentUser, objectName];
  await outputDbUser.doc(user_id).update({
    completedTask: updatedUser,
    user_points: updatedPoints,
  });
};

module.exports = { predict };
