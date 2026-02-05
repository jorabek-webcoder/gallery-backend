/**
 * URL Helper - Serverni manzilini avtomatik aniqlash
 * 
 * USULI 1 - .env dan o'qish (Production uchun eng yaxshi)
 * USULI 2 - req dan avtomatik aniqlash (Development uchun qulay)
 */

/**
 * Serverni base URL ini olish
 * @param {Object} req - Express request obyekti
 * @returns {string} Base URL (masalan: http://localhost:3000 yoki https://api.example.com)
 */
const getBaseUrl = (req) => {
  // 1. Agar .env da BASE_URL berilgan bo'lsa, uni ishlatamiz (Production)
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // 2. Aks holda req dan avtomatik aniqlaymiz (Development)
  const protocol = req.protocol; // http yoki https
  const host = req.get("host"); // localhost:3000 yoki api.example.com

  return `${protocol}://${host}`;
};

/**
 * Fayl uchun to'liq URL yaratish
 * @param {Object} req - Express request obyekti
 * @param {string} filePath - Fayl yo'li (uploads/images/abc.jpg)
 * @returns {string} To'liq URL
 */
const generateFileUrl = (req, filePath) => {
  const baseUrl = getBaseUrl(req);
  // filePath / bilan boshlanmasligi kerak
  const cleanPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
  return `${baseUrl}/${cleanPath}`;
};

module.exports = { getBaseUrl, generateFileUrl };
