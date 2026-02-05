const cron = require("node-cron");
const { UploadModel } = require("../models/upload/upload.model");
const fs = require("fs");
const path = require("path");

/**
 * CRON JOB - Ishlatilmagan fayllarni tozalash
 * 
 * is_use = false bo'lgan va 7 kundan ortiq vaqt o'tgan fayllarni o'chiradi
 * 
 * CRON SYNTAX:
 * ┌────────────── second (0-59) - ixtiyoriy
 * │ ┌──────────── minute (0-59)
 * │ │ ┌────────── hour (0-23)
 * │ │ │ ┌──────── day of month (1-31)
 * │ │ │ │ ┌────── month (1-12)
 * │ │ │ │ │ ┌──── day of week (0-6, 0=Yakshanba)
 * │ │ │ │ │ │
 * * * * * * *
 * 
 * Misollar:
 * - "0 2 * * *"      -> Har kuni soat 02:00 da
 * - "0 * * * *"      -> Har soat boshida
 * - "* /30 * * * *"  -> Har 30 daqiqada
 * - "0 0 * * 0"      -> Har yakshanba kuni yarim tunda
 */

/**
 * Ishlatilmagan fayllarni o'chirish
 */
const cleanupUnusedFiles = async () => {
  try {
    console.log("🧹 Cron Job boshlandi - Ishlatilmagan fayllar tozalanmoqda...");

    // 7 kun oldingi sanani hisoblash
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // is_use = false va 7 kundan ortiq bo'lgan fayllarni topish
    const unusedFiles = await UploadModel.find({
      is_use: false,
      createdAt: { $lt: sevenDaysAgo }, // 7 kundan avval yaratilgan
    });

    console.log(`📊 Topildi: ${unusedFiles.length} ta ishlatilmagan fayl`);

    let deletedCount = 0;
    let errorCount = 0;

    // Har bir faylni o'chirish
    for (const file of unusedFiles) {
      try {
        // URL dan fayl yo'lini aniqlash
        // Misol: http://localhost:3000/uploads/images/abc.jpg -> public/uploads/images/abc.jpg
        const urlParts = new URL(file.url);
        const filePath = path.join(process.cwd(), "public", urlParts.pathname);

        // Fizik faylni o'chirish
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ O'chirildi: ${file.file_name}`);
          deletedCount++;
        }

        // Database dan o'chirish
        await UploadModel.findByIdAndDelete(file._id);
      } catch (error) {
        console.error(`❌ Xatolik (${file.file_name}):`, error.message);
        errorCount++;
      }
    }

    console.log(`✨ Tozalash tugadi: ${deletedCount} ta o'chirildi, ${errorCount} ta xatolik`);
  } catch (error) {
    console.error("❌ Cron job xatolik:", error);
  }
};

/**
 * Cron jobni ishga tushirish
 */
const startCleanupCron = () => {
  // Har kuni soat 02:00 da ishga tushadi
  cron.schedule("0 2 * * *", () => {
    cleanupUnusedFiles();
  });

  console.log("⏰ Cron job faollashtirildi: Har kuni soat 02:00 da ishga tushadi");

  // Test uchun - Har 1 soatda (Development uchun)
  // Productiondan oldin bu qatorni o'chirib qo'ying!
  // cron.schedule("0 * * * *", () => {
  //   cleanupUnusedFiles();
  // });
};

module.exports = { startCleanupCron, cleanupUnusedFiles };
