const Hapi = require("@hapi/hapi");
const routes = require("./src/routes");
const firebase_admin = require("firebase-admin");
const serviceAccount = require("./.private/firebase.json");

// Fungsi Memulai Firebase
const firebase_init = () => {
    firebase_admin.initializeApp({
        credential: firebase_admin.credential.cert(serviceAccount),
    });
};

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: process.env.HOST || 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server: ${server.info.uri}`);
};

firebase_init();
init();