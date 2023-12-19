const { invariantError } = require('../exceptions/invariantError');

const firebaseAdmin = require('firebase-admin');

const getAllMuseum = async ({ request, h }) => {
  const db = firebaseAdmin.firestore();
  const outputDb = await db.collection('museum').get();

  let museumData = [];
  outputDb.forEach((doc) => {
    museumData.push(doc.data());
  });

  museumData = museumData.sort((a, b) => a.museum_id - b.museum_id);

  const fieldOrder = [
    'museum_id',
    'museum_doc',
    'museum_name',
    'address',
    'location',
    'url_museum_img',
    'isOpen',
  ];

  // Sort the array of objects based on the field order
  museumData = museumData.map((obj) => {
    const sortedObj = {};
    fieldOrder.forEach((field) => {
      sortedObj[field] = obj[field];
    });
    return sortedObj;
  });

  return h.response({
    error: false,
    message: "Get Museum data success!",
    museumData,
  }).code(201);
};

const getAllTask = async ({ request, h }) => {
  // const {
  //   user_id,
  // } = request.query;

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

  let taskData = [];
  const subOutputDb = await outputDb.collection('object').get();
  subOutputDb.forEach((doc) => {
    taskData.push(doc.data());
  });

  taskData = taskData.sort((a, b) => a.object_id - b.object_id);

  const fieldOrder = [
    'object_id',
    'object_doc',
    'object_name',
    'object_year',
    'object_description',
    'points',
    'takenBy',
  ];

  // Sort the array of objects based on the field order
  taskData = taskData.map((obj) => {
    const sortedObj = {};
    fieldOrder.forEach((field) => {
      sortedObj[field] = obj[field];
    });
    return sortedObj;
  });

  console.log(taskData);

  // const takenFalse = taskData.filter(
  //     (task) => !task.takenBy.includes(user_id),
  // );
  // const takenTrue = taskData.filter(
  //     (task) => task.takenBy.includes(user_id),
  // );

  return h.response({
    error: false,
    message: "Get Task data success!",
    taskData,
  }).code(201);
};

const getTaskById = async ({ request, h }) => {
  const {
    museum_id,
    task_id,
  } = request.params;

  const db = firebaseAdmin.firestore();
  const museumOutputDb = db.collection('museum').doc(museum_id);
  const museumData = await museumOutputDb.get();

  if (!museumData.exists) {
    const message = "Museum not found";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  const taskOutputDb = await museumOutputDb.collection('object')
      .doc(task_id)
      .get();

  let taskData = taskOutputDb.data();
  const fieldOrder = [
    'object_id',
    'object_doc',
    'object_name',
    'object_year',
    'object_description',
    'points',
    'takenBy',
  ];

  taskData = Object.fromEntries(
      fieldOrder.map((key) => [key, taskData[key]]),
  );

  if (!taskOutputDb.exists) {
    const message = "Task not found";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  return h.response({
    error: false,
    message: "Get Task data by Id success!",
    taskData,
  }).code(201);
};

module.exports = { getAllMuseum, getAllTask, getTaskById };
