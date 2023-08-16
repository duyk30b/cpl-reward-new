const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/HomeController')

router.get('/register', controller.register);
router.get('/login', controller.login);
router.get('/logout', controller.logout);

router.post('/register', controller.registerStore);
router.post('/login', controller.loginStore);

router.get('/', controller.home);

module.exports = router;