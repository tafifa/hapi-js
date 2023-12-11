const axios = require('axios');
const FormData = require('form-data');
const firebase_admin = require("firebase-admin");
const { copyFileSync } = require('fs');

const predict = async ({ imageFile, museumId, taskId }) => {
  const apiUrl = 'https://ml-tfjs-bx6pwrssuq-et.a.run.app/predicts';

  // const { imageFile, taskName } = payload;
   
  let formData = new FormData();

  // // Append the image buffer as a file to the FormData
  formData.append('image', Buffer.from(imageFile), {
    filename: 'image.jpg', // Specify the desired filename
    contentType: 'image/jpeg', // Specify the content type if known
  });

  const response = await axios.post(
    apiUrl, 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // // Assuming the API response contains the values you want to return
  const returnValue = response.data;
  const db = firebase_admin.firestore();
  const subcollectionRef = db.collection("museum").doc(museumId).collection("object").doc(taskId);
  // if (!subcollectionRef.exists) {
  //   const response = h.response({
  //     status: "not found",
  //     message: "User not found",
  //   });
  //   response.code(404);
  //   return response;
  // }

  const taskSnapshot = await subcollectionRef.get();
  
  if (!taskSnapshot.exists) {
    console.log('Task not found');
  }

  const taskData = taskSnapshot.data();
  
  // Assuming "taskName" is a field in the task document
  const taskName = taskData.object_name;
  
  // console.log('Task Name:', taskName);

  // console.log(returnValue);
  if (taskName && returnValue.result && taskName === returnValue.result) {
    return 'success';
  } else {
    return 'failure';
  }
}

const addPoint = async ({ UID }) => {
  const db = firebase_admin.firestore();
  const outputDb = db.collection("users");
  const userSnapshot = await outputDb.doc(UID).get();
  const userData = userSnapshot.data();

  console.log(userData)
  if (!userData) {
    console.log('No user with the specified UID');
    // Handle the case when no user is found (return an error or take appropriate action)
  }

  // Get the current user_points value
  const currentPoints = userData.user_points || 0;

  // Add points (modify this logic as needed)
  const pointsToAdd = 10;
  const updatedPoints = currentPoints + pointsToAdd;

  // Update the user_points field in Firestore
  await outputDb.doc(UID).update({
    user_points: updatedPoints,
  });
};

const takenBy  = async ({ museumId, taskId, UID }) => {
  const db = firebase_admin.firestore();
  const subcollectionRef = db.collection("museum").doc(museumId).collection("object").doc(taskId);

  const subSnapshot = await subcollectionRef.get();

  if (!subSnapshot.exists) {
    console.log('No Object with the specified ID');
    // Handle the case when no museum is found (return an error or take appropriate action)
  }

  // Get the current takenBy array from the document
  const currentTakenBy = subSnapshot.get('takenBy') || [];

  // Check if UID is already in the takenBy array
  if (currentTakenBy.includes(UID)) {
    console.log(`User with UID ${UID} is already in the takenBy array`);
    return true;
    // Handle the case when the user is already in the array (return an error or take appropriate action)
  }

  // Add UID to the takenBy array
  const updatedTakenBy = [...currentTakenBy, UID];

  // Update the takenBy field in the subCollection document
  await subcollectionRef.update({
    takenBy: updatedTakenBy,
  });
  return false;
};

module.exports = { predict, addPoint, takenBy };