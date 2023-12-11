// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../../.private/key.json").api_key;
const bucketName = require("../../.private/key.json").storage_bucket;

// users - Login
const login = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        try {
            const { users_email, users_password } = request.payload;

        // Authentikasi pengguna menggunakan Firebase Admin SDK
        const userRecord = await firebase_admin.auth().getUserByEmail(users_email);

        // Verifikasi kata sandi
        await firebase_admin.auth().updateUser(userRecord.uid, {
            password: users_password,
        });

        // Mendapatkan ID token pengguna
        const idToken = await firebase_admin.auth().createCustomToken(userRecord.uid);

        // Sekarang, Anda dapat menggunakan ID token ini atau mengirimkannya ke klien
        const responseData = {
            status: "success",
            idToken: idToken,
            // Tambahkan data pengguna lainnya jika diperlukan
        };

        const response = h.response(responseData);
        response.code(200);
        return response;
    } catch (error) {
        console.error("Error logging in:", error);

        const response = h.response({
            status: "bad request",
            message: error.message || "Invalid credentials",
        });
        response.code(400);
        return response;

        }
    } 
    else {
        const response = h.response({
            status: "unauthorized",
        });
        response.code(401);
        return response;
    }
};

// users - Buat Data Users Baru/Register
const register = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const {
                user_name,
                user_email,
                user_password,
            } = request.payload;

            const userId = "u" + Date.now().toString();
            const userUrl = `https://storage.googleapis.com/artventure/users/profile.png`;

            // const storage = new Storage({
            //     keyFilename: path.join(
            //         __dirname,
            //         "../../private/firebase.json"
            //     ),
            // });

            // // Save to Cloud Storage
            // const filename = users_picture.hapi.filename;
            // const data = users_picture._data;
            // const filePath = `./${filename}`;
            // const fileExtension = filename.split(".").pop();
            // const destFileName = `users/${userId}.${fileExtension}`;
            // const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

            // async function uploadFile() {
            //     const options = {
            //         destination: destFileName,
            //     };
            //     await storage.bucket(bucketName).upload(filePath, options);
            //     async function makePublic() {
            //         await storage
            //             .bucket(bucketName)
            //             .file(destFileName)
            //             .makePublic();
            //     }
            //     makePublic().catch(console.error);
            // }

            // fs.writeFile(filename, data, async (err) => {
            //     if (!err) {
            //         await uploadFile().catch(console.error);
            //         fs.unlink(filename, (err) => {
            //             if (err) {
            //                 console.error("Error deleting file:", err);
            //             } else {
            //             }
            //         });
            //         // Delete the file after successful uploa
            //     }
            // });

            const db = firebase_admin.firestore();
            const outputDb = db.collection("users");

            // Create user in Firebase Authentication using Admin SDK
            const userRecord = await firebase_admin.auth().createUser({
                email: user_email,
                password: user_password,
            });

            // Get the user UID from the userRecord
            const uid = userRecord.uid;

            // Save user details to Firestore
            await outputDb.doc(userId).set({
                user_id: userId,
                user_name: user_name,
                user_email: user_email,
                user_points: null,
                completedTask: [],
                user_picture: userUrl,
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

        // const oldfilename = (await db.collection("users").doc(id).get())
        //     .data()
        //     .users_picture.split("/")
        //     .pop();

        // const storage = new Storage({
        //     keyFilename: path.join(__dirname, "../../private/firebase.json"),
        // });

        // await storage.bucket(bucketName).file(`users/${oldfilename}`).delete();

        const db = firebase_admin.firestore();
        const auth = firebase_admin.auth();
        try {
            const outputDb = await db.collection("users").doc(id).get();
    
            // Pastikan pengguna ada sebelum mencoba menghapus
            if (!outputDb.exists) {
                const response = h.response({
                    status: "not found",
                    message: "User not found",
                });
                response.code(404);
                return response;
            }
    
            const user = outputDb.data();
            const uid = user.firebase_uid;
    
            // Hapus pengguna dari Firebase Authentication
            await auth.deleteUser(uid);
    
            // Hapus data pengguna dari Firestore
            await outputDb.ref.delete();
    
            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error deleting user:", error);
    
            const response = h.response({
                status: "internal server error",
                message: "Internal Server Error",
            });
            response.code(500);
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
                user_name,
                user_email,
            } = request.payload;

            const db = firebase_admin.firestore();
            const auth = firebase_admin.auth();
            
            const outputDb = db.collection("users");
            const userDoc = await outputDb.doc(id).get();
    
            // Pastikan pengguna ada sebelum mencoba mengedit
            if (!userDoc.exists) {
                const response = h.response({
                    status: "not found",
                    message: "User not found",
                });
                response.code(404);
                return response;
            }
    
            const user = userDoc.data();
            const uid = user.firebase_uid;
    
            // Update email pengguna di Firebase Authentication
            await auth.updateUser(uid, { email: user_email });
    
            // Update data pengguna di Firestore
            await outputDb.doc(id).update({
                user_name: user_name,
                user_email: user_email,
            });
    
            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error updating user:", error);
    
            const response = h.response({
                status: "internal server error",
                message: "Internal Server Error",
            });
            response.code(500);
            return response;
        }
    }

            // const storage = new Storage({
            //     keyFilename: path.join(
            //         __dirname,
            //         "../private/firebase.json"
            //     ),
            // });

            // Save to Cloud Storage
            // const oldfilename = (await db.collection("users").doc(id).get())
            //     .data()
            //     .users_picture.split("/")
            //     .pop();
            // console.log(oldfilename);
            // const filename = users_picture.hapi.filename;
            // const data = users_picture._data;
            // const filePath = `./${filename}`;
            // const fileExtension = filename.split(".").pop();
            // const destFileName = `users/${id}.${fileExtension}`;
            // const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

            // async function uploadFile() {
            //     const options = {
            //         destination: destFileName,
            //     };
            //     await storage.bucket(bucketName).upload(filePath, options);
            //     async function makePublic() {
            //         await storage
            //             .bucket(bucketName)
            //             .file(destFileName)
            //             .makePublic();
            //     }
            //     makePublic().catch(console.error);
            // }

            // async function deleteFile() {
            //     await storage
            //         .bucket(bucketName)
            //         .file(`users/${oldfilename}`)
            //         .delete();
            // }

            // fs.writeFile(filename, data, async (err) => {
            //     if (!err) {
            //         await deleteFile().catch(console.error);
            //         await uploadFile().catch(console.error);
            //         fs.unlink(filename, (err) => {
            //             if (err) {
            //                 console.error("Error deleting file:", err);
            //             } else {
            //             }
            //         });
            //         // Delete the file after successful upload
            //     }
            // });
            
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

        try {

            const db = firebase_admin.firestore();
            const userDoc = await db.collection("users").doc(id).get();

            // Pastikan pengguna ada sebelum mencoba mengambil data
            if (!userDoc.exists) {
                const response = h.response({
                    status: "not found",
                    message: "User not found",
                });
                response.code(404);
                return response;
            }

            const responseData = userDoc.data();

            const response = h.response(responseData);
            response.code(200);
            return response;
    } catch (error) {
        console.error("Error getting user:", error);

        const response = h.response({
            status: "internal server error",
            message: "Internal Server Error",
        });
        response.code(500);
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

// users - Ambil Seluruh Data Users
const getAllUsers = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        try {
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
        } catch (error) {
            console.error("Error getting all users:", error);
    
            const response = h.response({
                status: "internal server error",
                message: "Internal Server Error",
            });
            response.code(500);
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




// module.exports = { makeUsers };
module.exports = { getAllUsers, getUsers, login, register, editUsers, deleteUsers };
