const mongoDB = require('../../../config/database/mongoDB');
const ObjectId = require('mongodb').ObjectId;

const Collection = require('../../models/PhieuNhapThuoc');
const TuThuoc = require('../../models/TuThuoc');

class CollectionController {
	//--[RENDER]--       /list                            -- Render List --
	renderList(req, res, next) {
		res.render('manager/phieu-nhap-thuoc/phieunhapthuoc-list');
	}
	//--[RENDER]--       /list                            -- Render List --
	renderAdd(req, res, next) {
		res.render('manager/phieu-nhap-thuoc/phieunhapthuoc-add');
	}
	//--[GET]--       /list                               -- Get List --
	list(req, res, next) {
		let collection = mongoDB.getDB().collection('phieunhapthuocs');
		collection.find({ removedAt: 0 }, (error, results) => {
			if (error) throw error;
			results.toArray((err, list) => {
				res.json({ data: list });
			});
		});
	}

	//--[POST]--      /add                                -- Add  --
	store(req, res, next) {
		Object.assign(req.body, {
			createdAt: Date.now(),
			updatedAt: Date.now(),
			removedAt: 0,
			NguoiNhap: res.locals.user.Gmail,
			PhongKhamID: res.locals.user.PhongKhamID,
		});

		console.log(req.body);

		let collection = mongoDB.getDB().collection('phieunhapthuocs');
		collection.insertOne(req.body, (error, results) => {
			if (error) throw error;
			console.log('Tạo Phiếu Nhập Thuốc Đã xong !!!');
		});

		let tuthuocs = mongoDB.getDB().collection('tuthuocs');

		req.body.DanhSach.forEach((item, index) => {
			let listHSD = item.SoNhap.map((x) => x.HanSuDung);

			tuthuocs.updateOne(
				{
					PhongKhamID: res.locals.user.PhongKhamID,
					_id: new ObjectId(item._id),
				},
				[
					{
						$set: {
							GiaBan: item.GiaBan,
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
											input: item.SoNhap,
											in: {
												$cond: {
													if: {
														$in: ['$$this.HanSuDung', '$HangTon.HanSuDung'],
													},
													then: {
														SoLuong: {
															$sum: [
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
													else: {
														SoLuong: '$$this.SoLuong',
														HanSuDung: '$$this.HanSuDung',
														GiaMua: '$$this.GiaMua',
													},
												},
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
