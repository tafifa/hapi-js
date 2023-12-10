// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../../.private/key.json").api_key;
const bucketName = require("../../.private/key.json").storage_bucket;

// users - Buat Data Users Baru
const makeUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const {
                users_name,
                users_email,
                users_phone,
                users_role,
                users_password,
                users_picture,
            } = request.payload;

            const userId = "u" + Date.now().toString();

            const storage = new Storage({
                keyFilename: path.join(
                    __dirname,
                    "../private/firebase.json"
                ),
            });

            // Save to Cloud Storage
            const filename = users_picture.hapi.filename;
            const data = users_picture._data;
            const filePath = `./${filename}`;
            const fileExtension = filename.split(".").pop();
            const destFileName = `users/${userId}.${fileExtension}`;
            const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

            async function uploadFile() {
                const options = {
                    destination: destFileName,
                };
                await storage.bucket(bucketName).upload(filePath, options);
                async function makePublic() {
                    await storage
                        .bucket(bucketName)
                        .file(destFileName)
                        .makePublic();
                }
                makePublic().catch(console.error);
            }

            fs.writeFile(filename, data, async (err) => {
                if (!err) {
                    await uploadFile().catch(console.error);
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.error("Error deleting file:", err);
                        } else {
                        }
                    });
                    // Delete the file after successful uploa
                }
            });

            const db = firebase_admin.firestore();
            const outputDb = db.collection("users");

            // Create user in Firebase Authentication using Admin SDK
            const userRecord = await firebase_admin.auth().createUser({
                email: users_email,
                password: users_password,
            });

            // Get the user UID from the userRecord
            const uid = userRecord.uid;

            // Save user details to Firestore
            await outputDb.doc(userId).set({
                users_id: userId,
                users_name: users_name,
                users_email: users_email,
                users_phone: users_phone,
                users_role: users_role,
                users_picture: url,
                firebase_uid: uid, // Save Firebase UID
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid atau error saat membuat user)
            console.error("Error creating user:", error);

            const response = h.response({
                status: "bad request",
            });

            // Check if the error is due to an existing email
            if (error.code === "auth/email-already-exists") {
                response.message = "Email address is already in use";
                response.code(400); // Bad Request
            } else {
                response.code(500); // Internal Server Error
            }

            return response;
        }
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// users - Hapus Data Users Tertentu
const deleteUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const { id } = request.params;

        const db = firebase_admin.firestore();

        const oldfilename = (await db.collection("users").doc(id).get())
            .data()
            .users_picture.split("/")
            .pop();

        const storage = new Storage({
            keyFilename: path.join(__dirname, "../private/firebase.json"),
        });

        await storage.bucket(bucketName).file(`users/${oldfilename}`).delete();

        const outputDb = db.collection("users");
        await outputDb.doc(id).delete();

        const response = h.response({
            status: "success",
        });
        response.code(200);
        return response;
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// users - Edit Data Users Tertentu
const editUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        const { id } = request.params;
        try {
            const {
                users_name,
                users_email,
                users_phone,
                users_role,
                users_picture,
            } = request.payload;

            const storage = new Storage({
                keyFilename: path.join(
                    __dirname,
                    "../private/firebase.json"
                ),
            });

            // Save to Cloud Storage
            const db = firebase_admin.firestore();
            const oldfilename = (await db.collection("users").doc(id).get())
                .data()
                .users_picture.split("/")
                .pop();
            console.log(oldfilename);
            const filename = users_picture.hapi.filename;
            const data = users_picture._data;
            const filePath = `./${filename}`;
            const fileExtension = filename.split(".").pop();
            const destFileName = `users/${id}.${fileExtension}`;
            const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

            async function uploadFile() {
                const options = {
                    destination: destFileName,
                };
                await storage.bucket(bucketName).upload(filePath, options);
                async function makePublic() {
                    await storage
                        .bucket(bucketName)
                        .file(destFileName)
                        .makePublic();
                }
                makePublic().catch(console.error);
            }

            async function deleteFile() {
                await storage
                    .bucket(bucketName)
                    .file(`users/${oldfilename}`)
                    .delete();
            }

            fs.writeFile(filename, data, async (err) => {
                if (!err) {
                    await deleteFile().catch(console.error);
                    await uploadFile().catch(console.error);
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.error("Error deleting file:", err);
                        } else {
                        }
                    });
                    // Delete the file after successful upload
                }
            });

            const outputDb = db.collection("users");
            await outputDb.doc(id).update({
                users_name: users_name,
                users_email: users_email,
                users_phone: users_phone,
                users_role: users_role,
                users_picture: url,
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid)
            const response = h.response({
                status: "bad request",
            });
            response.code(400);
            return response;
        }
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// users - Ambil Data Users Tertentu
const getUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Mengambil ID Users dari Request Params
        const { id } = request.params;

        const db = firebase_admin.firestore();
        const responseData = (
            await db.collection("users").doc(id).get()
        ).data();

        const response = h.response(responseData);
        response.code(200);
        return response;
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// users - Ambil Seluruh Data Users
const getAllUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const db = firebase_admin.firestore();
        const responseData = {};
        responseData["users"] = [];
        const outputDb = await db.collection("users");
        const snapshot = await outputDb.get();

        snapshot.forEach((doc) => {
            const dataObject = doc.data();
            responseData["users"].push(dataObject);
        });

        const response = h.response(responseData);
        response.code(200);
        return response;
    }
    // Jika Kunci API Salah
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// module.exports = { makeUsers };
module.exports = { getAllUsers, getUsers, makeUsers, editUsers, deleteUsers };
