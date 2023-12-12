const { invariantError } = require('../exceptions/invariantError');

const firebaseAdmin = require('firebase-admin');

const createUserRegister = async ({ request, h }) => {
  const {
    user_name,
    user_email,
    user_password,
  } = request.payload;

  const userId = 'u' + Date.now().toString();
  const userUrl = `https://storage.googleapis.com/artventure/users/profile.png`;
  const db = firebaseAdmin.firestore();
  const outputDb = db.collection('users');

  if (await checkIfAlreadyExists({ user_name, user_email }, outputDb)) {
    const message = "Username or Email already exists";
    console.log(message);
    return invariantError({ request, h }, message);
  }

  // Create user in Firebase Authentication using Admin SDK
  const userRecord = await firebaseAdmin.auth().createUser({
    email: user_email,
    password: user_password,
  });

  // Get the user UID from the userRecord
  const uid = userRecord.uid;

  await outputDb.doc(userId).set({
    completedTask: [],
    user_points: 0,
    user_id: userId,
    user_name: user_name,
    user_email: user_email,
    user_pass: user_password,
    user_picture: userUrl,
    firebase_uid: uid, // Save Firebase UID
  });
  console.log("success");
  return h.response({
    error: false,
    message: "Register Success!",
  }).code(200);
};

const checkUserLogin = async ({ request, h }) => {
  const {
    user_name,
    user_email,
    user_password,
  } = request.payload;

  const db = firebaseAdmin.firestore();
  const outputDb = db.collection('users');

  if (!await checkIfAlreadyExists({ user_name, user_email }, outputDb)) {
    const message = "Username or Email not exists";
    console.log(message);
    return invariantError({ request, h }, message);
  }

  const usernameQuerySnapshot = await outputDb
      .where('user_name', '==', user_name)
      .get();
  const emailQuerySnapshot = await outputDb
      .where('user_email', '==', user_email)
      .get();

  let userData;
  if (usernameQuerySnapshot.size != 0) {
    userData = usernameQuerySnapshot.docs[0].data();
  };
  if (emailQuerySnapshot.size != 0) {
    userData = emailQuerySnapshot.docs[0].data();
  };
  console.log("User exists");

  if (userData.user_pass !== user_password) {
    const message = "Password doesn't match";
    console.log(message);
    return invariantError({ request, h }, message);
  };

  console.log("Login success!");
  return h.response({
    error: false,
    message: "Login Success!",
    userData,
  }).code(200);
};

const checkIfAlreadyExists = async ({ user_name, user_email }, outputDb) => {
  const usernameQuerySnapshot = await outputDb
      .where('user_name', '==', user_name)
      .get();
  const emailQuerySnapshot = await outputDb
      .where('user_email', '==', user_email)
      .get();

  return usernameQuerySnapshot.size > 0 || emailQuerySnapshot.size > 0;
};

module.exports = { createUserRegister, checkUserLogin };
