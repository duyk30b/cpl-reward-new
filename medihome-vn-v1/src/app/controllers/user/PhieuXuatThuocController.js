const mongoDB = require('../../../config/database/mongoDB');
const ObjectId = require('mongodb').ObjectId;

const Collection = require('../../models/PhieuXuatThuoc');
const TuThuoc = require('../../models/TuThuoc');

class CollectionController {
	//--[RENDER]--       /list                            -- Render List --
	renderList(req, res, next) {
		res.render('user/phieu-xuat-thuoc/phieuxuatthuoc-list');
	}
	//--[RENDER]--       /list                            -- Render List --
	renderAdd(req, res, next) {
		res.render('user/phieu-xuat-thuoc/phieuxuatthuoc-add');
	}
	//--[GET]--       /list                               -- Get List --
	list(req, res, next) {
		Collection.find({ removedAt: 0 })
			.then((results) => res.json({ data: results }))
			.catch((err) => next());
	}

	//--[POST]--      /add                                -- Add  --
	store(req, res, next) {
		Object.assign(req.body, {
			createdAt: Date.now(),
			updatedAt: Date.now(),
			removedAt: 0,
			NguoiXuat: res.locals.user.Gmail,
			PhongKhamID: res.locals.user.PhongKhamID,
		});

		let collection = mongoDB.getDB().collection('phieuxuatthuocs');
		collection.insertOne(req.body, (error, results) => {
			if (error) throw error;
			console.log('Insert One, Have Done !!!');
		});

		let tuthuocs = mongoDB.getDB().collection('tuthuocs');
		req.body.DanhSach.forEach((item, index) => {
			let listHSD = item.SoXuat.map((x) => x.HanSuDung);
			
			tuthuocs.updateOne(
				{
					PhongKhamID: res.locals.user.PhongKhamID,
					_id: new ObjectId(item._id),
				},
				[
					{
						$set: {
							CachDung: item.CachDung,
							HangTon: {
								$concatArrays: [
									{
										$filter: {
											input: '$HangTon',
											cond: {
												$not: [{ $in: ['$$this.HanSuDung', listHSD] }],
											},
										},
									},
									{
										$map: {
											input: {
												$filter: {
													input: item.SoXuat,
													cond: {
														$and: [
															{ $in: ['$$this.HanSuDung', '$HangTon.HanSuDung'] },
															{
																$ne: [
																	'$$this.SoLuong',
																	{
																		$arrayElemAt: [
																			'$HangTon.SoLuong',
																			{
																				$indexOfArray: ['$HangTon.HanSuDung', '$$this.HanSuDung'],
																			},
																		],
																	},
																],
															},
														],
													},
												},
											},
											in: {
												SoLuong: {
													$subtract: [
														{
															$arrayElemAt: [
																'$HangTon.SoLuong',
																{
																	$indexOfArray: ['$HangTon.HanSuDung', '$$this.HanSuDung'],
																},
															],
														},
														'$$this.SoLuong',
													],
												},
												HanSuDung: '$$this.HanSuDung',
												GiaMua: '$$this.GiaMua',
											},
										},
									},
								],
							},
						},
					},
				],
				function (err, result) {
					if (err) throw err;
					console.log(`Updated ${item.TenThuoc} success !!!`);
				}
			);
		});
	}
	//--[GET]--       /find/:id                           -- Get One  By ID--
	findID(req, res, next) {
		Collection.findById(req.params.id)
			.then((results) => res.json(results))
			.catch(next);
	}
}

module.exports = new CollectionController();
