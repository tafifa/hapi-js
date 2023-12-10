const {
  registerUser,
  loginUser
} = require("./handler");

const route = [
  // Tambah Data Users
  {
      method: "POST",
      path: "/users/register",
      handler: registerUser,
      options: {
        payload: {
            maxBytes: 10485760,
            multipart: true,
            output: 'stream'
        },
      },
  },
//   {
//     method: "POST",
//     path: "/users/register",
//     handler: loginUser,
//     options: {
//         payload: {
//             maxBytes: 10485760,
//             multipart: true,
//             output: 'stream'
//         },
//     },
// },
]

// Export Route
module.exports = route;