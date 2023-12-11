const axios = require('axios');
const FormData = require('form-data');
const firebase_admin = require("firebase-admin");

const predict = async ({ imageFile, taskName }) => {
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

  console.log(taskName);
  console.log(returnValue);
  if (taskName && returnValue.result && taskName === returnValue.result) {
    return 'success';
  } else {
    return 'failure';
  }
}

const addPoint = async ({ UID }) => {
  const db = firebase_admin.firestore();
  const userSnapshot = await db.collection("users").get();

  const userData = [];
  userSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    userData.push(data);
  });

  const user = userData.find(user => user.user_id === UID);
  if (!user) {
    console.log('No Username or Email registered');
    // return h.response({ error: 'No Username or Email registered' }).code(400);
  }
  console.log("boi")
};

module.exports = { predict, addPoint };

