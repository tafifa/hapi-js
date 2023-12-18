const {
    addRewards,
    getAllRewards,
    getRewards,
    editRewards,
    deleteRewards,
} = require("./handler");

const routes = [
    // Add Data Reward
    {
        method: "POST",
        path: "/rewards",
        handler: addRewards,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },

    // Ambil Seluruh Data Rewards
     {
        method: "GET",
        path: "/rewards",
        handler: getAllRewards,
    },

    // Ambil Data Rewards Tertentu
    {
        method: "GET",
        path: "/rewards/{id}",
        handler: getRewards,
    },

    // Edit Data Rewards Tertentu
    {
        method: "PUT",
        path: "/rewards/{id}",
        handler: editRewards,
        options: {
            payload: {
                maxBytes: 10485760,
                multipart: true,
                output: 'stream'
            },
        },
    },

    // Hapus Data Rewards Tertentu
    {
        method: "DELETE",
        path: "/rewards/{id}",
        handler: deleteRewards
    },
];

// Export Routes
module.exports = routes;
