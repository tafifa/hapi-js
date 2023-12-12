const Hapi = require('@hapi/hapi');
const routes = require('./src/routes');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./.private/firebase.json');

const firebaseInit = () => {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
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

firebaseInit();
init();
