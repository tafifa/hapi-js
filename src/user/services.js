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
      user_id: userId,
      user_name: user_name,
      user_email: user_email,
      firebase_uid: uid, // Save Firebase UID
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

const checkUserLogin = async (request) => {
  const {
    user_name,
    user_email,
    user_password,
  } = request.payload;

  const db = firebase_admin.firestore();
  const userSnapshot = await db.collection("users")
    .where('username', '==', user_name) // Check if the username exists
    .orWhere('email', '==', user_email) // Or check if the email exists
    .get();

  const userData = userSnapshot.docs[0].data();
  try {
    const userCredential = await firebase_admin.auth().signInWithEmailAndPassword(user_email, user_password);
    // Authentication successful, return a success response or a token.
    const response = h.response({ message: 'Login successful', user: userData, token: userCredential.user.getIdToken() });
    response.code(200); // OK
    return response;
  } 
  catch (error) {
    // Authentication failed, return an appropriate response.
    const response = h.response({ error: 'Invalid credentials' });
    response.code(401); // Unauthorized
    return response;
  }
};

module.exports = { createUserRegister, checkUserLogin };