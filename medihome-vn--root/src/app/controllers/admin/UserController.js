const Collection = require('../../models/User');

class CollectionController {
	//--[RENDER]--       /list                            -- Render List --
	renderList(req, res, next) {
		res.render('admin/users/user-list');
	}
	//--[RENDER]--       /list                            -- Render List --
	renderTrash(req, res, next) {
		res.render('admin/users/user-trash');
	}
	//--[GET]--       /list                               -- Get List --
	list(req, res, next) {
		Collection.find({ removedAt: 0 })
			.then((results) => res.json({ data: results }))
			.catch((err) => next());
	}
	//--[GET]--       /list-trash                         -- Get List Trash --
	listTrash(req, res, next) {
		Collection.find({ removedAt: { $ne: 0 } })
			.then((results) => res.json({ data: results }))
			.catch((err) => next());
	}
	//--[POST]--      /add                                -- Add  --
	store(req, res, next) {
		Object.assign(req.body, {
			createdAt: Date.now(),
			updatedAt: Date.now(),
			removedAt: 0,
		});
		const document = new Collection(req.body);
		document
			.save()
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[GET]--       /find/:id                           -- Get One  By ID--
	findID(req, res, next) {
		Collection.findById(req.params.id)
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[PUT]--       /update/:id                          -- Update By ID --
	update(req, res, next) {
		Object.assign(req.body, {
			updatedAt: Date.now(),
		});
		Collection.findByIdAndUpdate(req.params.id, req.body, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[PUT]--       /replace/:id                         -- Replace By ID --
	replace(req, res, next) {
		Object.assign(req.body, {
			updatedAt: Date.now(),
		});
		Collection.findOneAndReplace({ _id: req.params.id }, req.body, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	// --[PATCH]--    /remove/:id                         -- Remove By ID --
	remove(req, res, next) {
		Collection.findByIdAndUpdate(req.params.id, { removedAt: Date.now() }, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[PATCH]--     /restore/:id                        -- Restore By ID --
	restore(req, res, next) {
		Collection.findByIdAndUpdate(req.params.id, { removedAt: 0 }, { new: true })
			.then((results) => res.json(results))
			.catch(next);
	}
	//--[DELETE]--    /destroy/:id                        -- Destroy By ID --
	destroy(req, res, next) {
		Collection.deleteOne({ _id: req.params.id })
			.then((response) => res.json(response))
			.catch(next);
	}
	// --[PATCH]--    /remove-list/:ids                    -- Remove By ID --
	removeList(req, res, next) {
		Collection.updateMany({ _id: { $in: req.body.ids } }, { removedAt: Date.now() })
			.then((response) => res.json(response))
			.catch(next);
	}
	// --[PATCH]--    /restore-list/:ids                   -- Restore List By ID --
	restoreList(req, res, next) {
		Collection.updateMany({ _id: { $in: req.body.ids } }, { removedAt: 0 })
			.then((response) => res.json(response))
			.catch(next);
	}
	// --[PATCH]--    /destroy-list/:ids                   -- Destroy List By ID --
	destroyList(req, res, next) {
		Collection.deleteMany({ _id: { $in: req.body.ids } })
			.then((response) => res.json(response))
			.catch(next);
	}
}

module.exports = new CollectionController();
