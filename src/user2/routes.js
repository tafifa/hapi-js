const {
    getAllUsers,
    getUsers,
    login,
    register,
    editUsers,
    deleteUsers,
} = require("./handler");

const routes = [
    // Register
    {
        method: "POST",
        path: "/register",
        handler: register,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },

    // Login
    {
        method: "POST",
        path: "/login",
        handler: login,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },

    // Tambah Data Users
    {
        method: "POST",
        path: "/users",
        handler: register,
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
];


// Export Routes
module.exports = routes;
