const express = require('express');
const router = express.Router();

const authMiddleware = require('../../app/middlewares/authMiddleware');
router.use(authMiddleware.requireLogin, authMiddleware.admin);

const controller = require('../../app/controllers/admin/AdminController');

const UserRouter = require('./UserRouter');
const TuThuocRouter = require('./TuThuocRouter');
const PhieuNhapThuocRouter = require('./PhieuNhapThuocRouter');

router.use('/users', UserRouter);
router.use('/tu-thuoc', TuThuocRouter);
router.use('/phieu-nhap-thuoc', PhieuNhapThuocRouter);

router.get('/', controller.home);

module.exports = router;
