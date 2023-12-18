// Dependencies
const firebase_admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const api_key = require("../../private/key.json").api_key;
const bucketName = require("../../private/key.json").storage_bucket;

// REWARD - Buat Data Reward Baru
const addRewards = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        try {
            const {
                reward_name,
                reward_point,
                url_reward_img,
            } = request.payload;

            const rewardId = "r" + Date.now().toString();
            // const userUrl = `https://storage.googleapis.com/artventure/users/profile.png`;

            const storage = new Storage({
                keyFilename: path.join(
                    __dirname,
                    "../../private/firebase.json"
                ),
            });

            // Save to Cloud Storage
            const filename = url_reward_img.hapi.filename;
            const data = url_reward_img._data;
            const filePath = `./${filename}`;
            const fileExtension = filename.split(".").pop();
            const destFileName = `reward/${rewardId}.${fileExtension}`;
            const rewardUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

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
            const outputDb = db.collection("reward");

            // Save reward details to Firestore
            await outputDb.doc(rewardId).set({
                reward_name: reward_name,
                reward_point: reward_point,
                url_reward_img: rewardUrl,
            });

            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            // Catch (jika request payload tidak valid atau error saat membuat reward)
            console.error("Error creating reward:", error);

            const response = h.response({
                status: "bad request",
            });

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

// REWARD - Ambil Seluruh Data Reward
const getAllRewards = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        try {
            const db = firebase_admin.firestore();
            const responseData = {};
            responseData["reward"] = [];
            const outputDb = await db.collection("reward");
            const snapshot = await outputDb.get();

            snapshot.forEach((doc) => {
                const dataObject = doc.data();
                responseData["reward"].push(dataObject);
            });

            const response = h.response(responseData);
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error getting all rewards:", error);
    
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

// REWARD - Ambil Data Reward Tertentu
const getRewards = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Mengambil ID Rewards dari Request Params
        const { id } = request.params;

        try {

            const db = firebase_admin.firestore();
            const rewardDoc = await db.collection("reward").doc(id).get();

            // Pastikan reward ada sebelum mencoba mengambil data
            if (!rewardDoc.exists) {
                const response = h.response({
                    status: "not found",
                    message: "Reward not found",
                });
                response.code(404);
                return response;
            }

            const responseData = rewardDoc.data();

            const response = h.response(responseData);
            response.code(200);
            return response;
    } catch (error) {
        console.error("Error getting reward:", error);

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

// REWARD - Edit Data Rewards Tertentu
const editRewards = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        // Try (jika request payload valid)
        const { id } = request.params;
        
        try {
            const {
                reward_name,
                reward_point,
                url_reward_img,
            } = request.payload;

            const storage = new Storage({
                keyFilename: path.join(
                    __dirname,
                    "../../private/firebase.json"
                ),
            });

            // Save to Cloud Storage
            const db = firebase_admin.firestore();
            const oldfilename = (await db.collection("reward").doc(id).get())
                .data()
                .url_reward_img.split("/")
                .pop();
            console.log(oldfilename);
            const filename = url_reward_img.hapi.filename;
            const data = url_reward_img._data;
            const filePath = `./${filename}`;
            const fileExtension = filename.split(".").pop();
            const destFileName = `reward/${id}.${fileExtension}`;
            const rewardUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`;

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
                    .file(`reward/${oldfilename}`)
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
            
            const outputDb = db.collection("reward");
            const rewardDoc = await outputDb.doc(id).get();
    
            // Pastikan reward ada sebelum mencoba mengedit
            if (!rewardDoc.exists) {
                const response = h.response({
                    status: "not found",
                    message: "Reward not found",
                });
                response.code(404);
                return response;
            }
    
            // Update data reward di Firestore
            await outputDb.doc(id).update({
                reward_name: reward_name,
                reward_point: reward_point,
                url_reward_img: rewardUrl,
            });
    
            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error updating reward:", error);
    
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

// REWARD - Hapus Data Rewards Tertentu
const deleteRewards = async (request, h) => {
    // Mengambil Kunci API dari Request Header
    const key = request.headers["x-api-key"];
    // Jika Kunci API Benar
    if (key === api_key) {
        const { id } = request.params;
        
        const db = firebase_admin.firestore();
        const oldfilename = (await db.collection("reward").doc(id).get())
            .data()
            .url_reward_img.split("/")
            .pop();

        const storage = new Storage({
            keyFilename: path.join(__dirname, "../../private/firebase.json"),
        });

        await storage.bucket(bucketName).file(`reward/${oldfilename}`).delete();

        try {
            const outputDb = await db.collection("reward").doc(id).get();
    
            // Pastikan pengguna ada sebelum mencoba menghapus
            if (!outputDb.exists) {
                const response = h.response({
                    status: "not found",
                    message: "Reward not found",
                });
                response.code(404);
                return response;
            }
    
            // Hapus data pengguna dari Firestore
            await outputDb.ref.delete();
    
            const response = h.response({
                status: "success",
            });
            response.code(200);
            return response;
        } catch (error) {
            console.error("Error deleting reward:", error);
    
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

module.exports = { addRewards, getAllRewards, getRewards, editRewards, deleteRewards };