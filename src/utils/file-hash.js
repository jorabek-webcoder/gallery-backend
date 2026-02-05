const crypto = require("crypto");
const fs = require("fs");

/**
 * Fayl uchun hash (MD5/SHA256) yaratish
 * Bu orqali bir xil fayllarni aniqlaymiz
 * 
 * @param {string} filePath - Faylni to'liq yo'li
 * @param {string} algorithm - Hash algoritm (md5, sha256)
 * @returns {Promise<string>} Hash qiymat
 */
const generateFileHash = (filePath, algorithm = "md5") => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

/**
 * Buffer dan hash yaratish (tezroq, lekin xotira ko'p)
 * @param {Buffer} buffer - Fayl buffer
 * @param {string} algorithm - Hash algoritm
 * @returns {string} Hash qiymat
 */
const generateBufferHash = (buffer, algorithm = "md5") => {
  return crypto.createHash(algorithm).update(buffer).digest("hex");
};

module.exports = { generateFileHash, generateBufferHash };
