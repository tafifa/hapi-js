const firebase_admin = require("firebase-admin");

const getAllMuseum = async ( ) => {
  const db = firebase_admin.firestore();
  const responseData = {};
  responseData["museum"] = [];
  const snapshot = await db.collection("museum").get();

  snapshot.forEach((doc) => {
    const dataObject = doc.data();
    responseData["museum"].push(dataObject);
  });
  
  return responseData.museum;
};

const getAllTask = async ({ museumId }) => {
  const db = firebase_admin.firestore();

  // Initialize an empty array to store the subcollection data
  const subcollectionData = [];

  try {
    // Get a reference to the subcollection based on the museum ID
    const subcollectionRef = db.collection("museum").doc(museumId).collection("object");

    // Retrieve all documents from the subcollection
    const snapshot = await subcollectionRef.get();

    // Iterate through each document in the subcollection
    snapshot.forEach((doc) => {
      // Extract the data from the document
      const dataObject = doc.data();

      // Push the data object to the subcollectionData array
      subcollectionData.push(dataObject);
    });

    // Return the array of subcollection data
    return subcollectionData;
  } catch (error) {
    // Handle errors (e.g., museum not found, subcollection not found)
    console.error("Error fetching subcollection:", error);
    throw error; // You can customize error handling based on your needs
  }
};

module.exports = { getAllMuseum, getAllTask };