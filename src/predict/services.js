const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const predict = async ({ imagePayload, taskName}) => {
  const apiUrl = 'https://ml-tfjs-bx6pwrssuq-et.a.run.app/predicts';

  const formData = new FormData();

  console.log(imagePayload)
  console.log(taskName)

  // Append the image buffer as a file to the FormData
  formData.append('file', Buffer.from(imagePayload), {
    filename: 'image.jpg', // Specify the desired filename
    contentType: 'image/jpeg', // Specify the content type if known
  });

  // Make a POST request to the API using Axios
  const response = await axios.post(apiUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Assuming the API response contains the values you want to return
  const returnValue = response.data;

  console.log(returnValue);

  return {result: "boi"};
}

module.exports = { predict };

