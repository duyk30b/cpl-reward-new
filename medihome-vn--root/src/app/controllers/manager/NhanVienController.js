const Collection = require('../../models/User');

class CollectionController {
	//--[RENDER]--       /list                               -- Get List --
	renderList(req, res, next) {
		res.render('manager/nhan-vien/nhanvien-list');
	}
	//--[RENDER]--       /list                               -- Get List --
	renderTrash(req, res, next) {
		res.render('manager/nhan-vien/nhanvien-trash');
	}
	//--[GET]--       /list                               -- Get List --
	list(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			removedAt: 0,
		};
		Collection.find(conditions)
			.then((results) => {
				res.json({ data: results });
			})
			.catch((err) => next());
	}
	//--[GET]--       /list-trash                         -- Get List Trash --
	listTrash(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			removedAt: { $ne: 0 },
		};
		Collection.find(conditions)
			.then((results) => res.json({ data: results }))
			.catch((err) => next());
	}

	//--[POST]--      /add                                -- Add  --
	store(req, res, next) {
		Object.assign(req.body, {
			PhongKhamID: res.locals.user.PhongKhamID,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			removedAt: 0,
		});
		const newData = new Collection(req.body);
		newData
			.save()
			.then((results) => res.json(results))
			.catch((err) => console.warn(err));	
	}
	//--[GET]--       /find/:id                           -- Get One  By ID--
	findID(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: req.params.id,
		};
		Collection.findOne(conditions)
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[PUT]--       /update/:id                          -- Update By ID --
	update(req, res, next) {
		Object.assign(req.body, {
			updatedAt: Date.now(),
		});
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: req.params.id,
		};
		Collection.findOneAndUpdate(conditions, req.body, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[PUT]--       /replace/:id                         -- Replace By ID --
	replace(req, res, next) {
		Object.assign(req.body, {
			updatedAt: Date.now(),
		});
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: req.params.id,
		};
		Collection.findOneAndReplace(conditions, req.body, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}

	// --[PATCH]--    /remove/:id                         -- Remove By ID --
	remove(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: req.params.id,
		};
		Collection.findOneAndUpdate(conditions, { removedAt: Date.now() }, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[PATCH]--     /restore/:id                        -- Restore By ID --
	restore(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: req.params.id,
		};
		Collection.findOneAndUpdate(conditions, { removedAt: 0 }, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[DELETE]--    /destroy/:id                        -- Destroy By ID --
	destroy(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: req.params.id,
		};
		Collection.deleteOne(conditions)
			.then((results) => res.json(results))
			.catch(next);
	}

	// --[PATCH]--    /remove-list/:ids                    -- Remove By ID --
	removeList(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: { $in: req.body.ids },
		};
		Collection.updateMany(conditions, { removedAt: Date.now() })
			.then((response) => res.json(response))
			.catch(next);
	}
	// --[PATCH]--    /restore-list/:ids                   -- Restore List By ID --
	restoreList(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: { $in: req.body.ids },
		};
		Collection.updateMany(conditions, { removedAt: 0 })
			.then((results) => res.json(results))
			.catch(next);
	}
	// --[PATCH]--    /destroy-list/:ids                   -- Destroy List By ID --
	destroyList(req, res, next) {
		let conditions = {
			PhongKhamID: res.locals.user.PhongKhamID,
			_id: { $in: req.body.ids },
		};
		Collection.deleteMany(conditions)
			.then((results) => res.json(results))
			.catch(next);
	}
}

module.exports = new CollectionController();
