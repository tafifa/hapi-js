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
      user_pass: user_password,
      user_picture: '',
    });
  }
  catch (error) {
    console.error("Error creating user:", error);

  //   const response = h.response({
  //     status: "bad request",
  //   });

  //   // Check if the error is due to an existing email
  //   if (error.code === "auth/email-already-exists") {
  //     response.message = "Email address is already in use";
  //     response.code(400); // Bad Request
  //   } else {
  //     response.code(500); // Internal Server Error
  //   }
  //   return response;
  };
};

const checkUserLogin = async (request, h) => {
  const { user_name, user_email, user_password } = request.payload;

  const db = firebase_admin.firestore();
  const userQuerySnapshot = await db.collection("users")
    .where('user_name', '==', user_name)
    .get();

  if (!userQuerySnapshot.empty) {
    // Access the first document in the result set
    const firstDocument = userQuerySnapshot.docs[0];
    
    // Access the data of the first document
    const dataObject = firstDocument.data();
    
    console.log(dataObject);
    if (dataObject.user_pass === user_password) {
      console.log("Login success!");
    } else console.log("Password doesn't match");
  } else {
    console.log('No matching documents found');
  }
};

module.exports = { createUserRegister, checkUserLogin };