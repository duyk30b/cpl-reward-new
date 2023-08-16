const Collection = require('../../models/PhieuNhapThuoc');

class CollectionController {
    //--[RENDER]--       /list                            -- Render List --
    renderList(req, res, next) {
        res.render('admin/phieu-nhap-thuoc/phieunhapthuoc-list');
    }
    //--[RENDER]--       /list                            -- Render List --
    renderAdd(req, res, next) {
        res.render('admin/phieu-nhap-thuoc/phieunhapthuoc-add');
    }
    //--[GET]--       /list                               -- Get List --
    list(req, res, next) {
        Collection.find({ removedAt: 0 })
            .then(results => res.json({ data: results }))
            .catch(err => next())
    }
    //--[POST]--      /add                                -- Add  --
    store(req, res, next) {
        Object.assign(req.body, {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            removedAt: 0,
        })
        const document = new Collection(req.body);
        document.save()
            .then((results) => res.json(results))
            .catch(next);
    }
    //--[GET]--       /find/:id                           -- Get One  By ID--
    findID(req, res, next) {
        Collection.findById(req.params.id)
            .then((results) => res.json(results))
            .catch(next);
    }
}

module.exports = new CollectionController();