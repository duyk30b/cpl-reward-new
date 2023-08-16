const express = require('express');
const router = express.Router();

const controller = require('../../app/controllers/user/BenhNhanController');

router.get('/list', controller.list);
router.get('/list-trash', controller.listTrash);

router.post('/add', controller.store);
router.get('/find/:id', controller.findID);
router.put('/update/:id', controller.update);
router.put('/replace/:id', controller.replace);

router.patch('/remove/:id', controller.remove);
router.patch('/restore/:id', controller.restore);
router.delete('/destroy/:id', controller.destroy);

router.patch('/remove-list', controller.removeList);
router.patch('/restore-list', controller.restoreList);
router.delete('/destroy-list', controller.destroyList);

//--[Render]-- 
router.get('/trash', controller.renderTrash);
router.get('/', controller.renderList);

module.exports = router;