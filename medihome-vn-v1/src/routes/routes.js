const adminRouter = require('./admin/adminRouter');
const managerRouter = require('./manager/managerRouter');
const userRouter = require('./user/userRouter');

const homeRouter = require('./homeRouter');

const authMiddleware = require('../app/middlewares/authMiddleware');

function routes(app) {
    app.use(authMiddleware.getUserLogin);

    app.use('/admin', adminRouter);
    app.use('/manager', managerRouter);
    app.use('/user', userRouter);
    app.use('/', homeRouter);
}

module.exports = routes;