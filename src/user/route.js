const {
  getAllUsers,
  getUsers,
  makeUsers,
  editUsers,
  deleteUsers,
} = require("./handler");

const route = [
  // Tambah Data Users
  {
      method: "POST",
      path: "/users",
      handler: makeUsers,
      options: {
          payload: {
              maxBytes: 10485760,
              multipart: true,
              output: 'stream'
          },
      },
  },

  // Ambil Data Users
  {
      method: "GET",
      path: "/users/{id}",
      handler: getUsers,
  },

  // Hapus Data Users Tertentu
  {
      method: "DELETE",
      path: "/users/{id}",
      handler: deleteUsers
  },

  // Edit Data Users Tertentu
  {
      method: "PUT",
      path: "/users/{id}",
      handler: editUsers,
      options: {
          payload: {
              maxBytes: 10485760,
              multipart: true,
              output: 'stream'
          },
      },
  },

  // Ambil Seluruh Data Users
  {
      method: "GET",
      path: "/users",
      handler: getAllUsers,
  },
]

// Export Route
module.exports = route;