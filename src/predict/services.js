const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const predict = async ({ payload }) => {
  const apiUrl = 'https://ml-tfjs-bx6pwrssuq-et.a.run.app/predicts';

  const { imageFile, taskName } = payload;
  // console.log(payload)
  // console.log(imageFile)
   
  let formData = new FormData();
  formData.append("file", imageFile);

  // // Append the image buffer as a file to the FormData
  // formData.append('file', Buffer.from(imageFile), {
  //   filename: 'image.jpg', // Specify the desired filename
  //   contentType: 'multipart/form-data', // Specify the content type if known
  // });

  // // Make a POST request to the API using Axios
  console.log(formData)
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

  console.log(returnValue);

  return {result: "boi"};
}

module.exports = { predict };

