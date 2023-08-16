class ManagerController {
    //--[RENDER]--       /list                            -- Render List --
    home(req, res, next) {
        res.render('manager/home/index');
    }
    //--[RENDER]--       /list                            -- Render List --
}

module.exports = new ManagerController();