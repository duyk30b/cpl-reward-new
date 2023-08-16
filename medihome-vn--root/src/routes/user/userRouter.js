const express = require('express');
const router = express.Router();

const authMiddleware = require('../../app/middlewares/authMiddleware');

const BenhNhanRouter = require('./BenhNhanRouter');
const LuotKhamRouter = require('./LuotKhamRouter'); 
const TuThuocRouter = require('./TuThuocRouter');
const PhieuXuatThuocRouter = require('./PhieuXuatThuocRouter'); 


router.use(authMiddleware.requireLogin);

router.use('/benh-nhan', BenhNhanRouter);
router.use('/luot-kham', LuotKhamRouter);
router.use('/tu-thuoc', TuThuocRouter);
router.use('/phieu-xuat-thuoc',PhieuXuatThuocRouter);

module.exports = router;
