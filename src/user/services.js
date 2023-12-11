const firebase_admin = require("firebase-admin");

const createUserRegister = async (request) => {
  try {
    const {
      user_name,
      user_email,
      user_password,
    } = request.payload;
  
    const userId = "u" + Date.now().toString();
    const db = firebase_admin.firestore();
    const outputDb = db.collection("users");
  
    // Create user in Firebase Authentication using Admin SDK
    const userRecord = await firebase_admin.auth().createUser({
      email: user_email,
      password: user_password,
    });
    const uid = userRecord.uid;
  
    // Save user details to Firestore
    await outputDb.doc(userId).set({
      completedTask: [],
      firebase_uid: uid, // Save Firebase UID
      user_points: 0,
      user_id: userId,
      user_name: user_name,
      user_email: user_email,
      user_picture: '',
    });
  }
  catch (error) {
    console.error("Error creating user:", error);

    const response = h.response({
      status: "bad request",
    });

    // Check if the error is due to an existing email
    if (error.code === "auth/email-already-exists") {
      response.message = "Email address is already in use";
      response.code(400); // Bad Request
    } else {
      response.code(500); // Internal Server Error
    }
    return response;
  };
};

const checkUserLogin = async (request, h) => {
  const {
    user_name,
    user_email,
    user_password,
  } = request.payload;

  const db = firebase_admin.firestore();
  const userSnapshot = await db.collection("users").get();

  const userData = [];
  userSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    userData.push(data);
  });

  const user = userData.find(user => user.user_name === user_name || user.user_email === user_email);
  if (!user) {
    console.log('No Username or Email registered');
    // return h.response({ error: 'No Username or Email registered' }).code(400);
  }

  const firebase_uid = user.firebase_uid;
  console.log(firebase_uid)

  const userCredential = await firebase_admin.auth().signInWithEmailAndPassword(user_email, user_password);
  const token = userCredential.user.getIdToken();
  return token;
  
  // try {
  //   const userCredential = await firebase_admin.auth().signInWithEmailAndPassword(user_email, user_password);
  //   // Authentication successful, return a success response or a token.
  //   const response = h.response({ message: 'Login successful', user: userData, token: userCredential.user.getIdToken() });
  //   response.code(200); // OK
  //   return response;
  // } 
  // catch (error) {
  //   // Authentication failed, return an appropriate response.
  //   const response = h.response({ error: 'Invalid credentials' });
  //   response.code(401); // Unauthorized
  //   return response;
  // }
};

module.exports = { createUserRegister, checkUserLogin };