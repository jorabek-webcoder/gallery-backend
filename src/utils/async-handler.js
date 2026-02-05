/**
 * Async Handler Wrapper
 * 
 * Async funksiyalardagi errorlarni avtomatik ushlaydi va
 * error middleware ga yuboradi
 * 
 * Express 5 da ham kerak!
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { asyncHandler };
