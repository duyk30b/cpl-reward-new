class AdminController {
    //--[RENDER]--       /list                            -- Render List --
    home(req, res, next) {
        res.render('admin/home/index');
    }
    //--[RENDER]--       /list                            -- Render List --
}

module.exports = new AdminController();