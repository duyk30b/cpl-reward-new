const express = require('express');
const router = express.Router();

const controller = require('../../app/controllers/manager/ManagerController');
const authMiddleware = require('../../app/middlewares/authMiddleware');

const BenhNhanRouter = require('./BenhNhanRouter');
const LuotKhamRouter = require('./LuotKhamRouter');
const TuThuocRouter = require('./TuThuocRouter');
const PhieuNhapThuocRouter = require('./PhieuNhapThuocRouter');
const PhieuXuatThuocRouter = require('./PhieuXuatThuocRouter');
const NhanVienRouter = require('./NhanVienRouter');

router.use(authMiddleware.requireLogin, authMiddleware.manager);

router.use('/benh-nhan', BenhNhanRouter);
router.use('/luot-kham', LuotKhamRouter);
router.use('/tu-thuoc', TuThuocRouter);
router.use('/phieu-nhap-thuoc', PhieuNhapThuocRouter);
router.use('/phieu-xuat-thuoc', PhieuXuatThuocRouter);
router.use('/nhan-vien', NhanVienRouter);

router.get('/', controller.home);

module.exports = router;
