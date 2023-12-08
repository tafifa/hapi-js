const axios = require('axios');
const FormData = require('form-data');

const predict = async ({ payload }) => {
  const apiUrl = 'https://ml-tfjs-bx6pwrssuq-et.a.run.app/predicts';

  const { imageFile, taskName } = payload;
  // console.log(payload)
  // console.log(imageFile)
   
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

module.exports = { predict };

