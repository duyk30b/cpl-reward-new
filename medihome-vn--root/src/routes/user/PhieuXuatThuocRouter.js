const express = require('express');
const router = express.Router();

const controller = require('../../app/controllers/user/PhieuXuatThuocController');

router.get('/list', controller.list);

router.post('/add', controller.store);
router.get('/find/:id', controller.findID);

//--[Render]-- 
router.get('/add', controller.renderAdd);
router.get('/', controller.renderList);

module.exports = router;