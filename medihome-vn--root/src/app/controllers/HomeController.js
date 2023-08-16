const User = require('../models/User');
const PhongKham = require('../models/PhongKham');
const jwt = require('jsonwebtoken');

class HomeController {
	//--[Render]--            /                    -- Render Home Page --
	home(req, res, next) {
		res.render('home/index');
	}

	//--[Render]--            /register            -- Render Register Page --
	register(req, res, next) {
		res.render('home/register');
	}
	//--[Render]--            /login               -- Render Login Page --
	login(req, res, next) {
		res.render('home/login');
	}
	//--[POST]--              /register            -- Create PhongKham + User + Create Sign Cookie--
	registerStore(req, res, next) {
		Object.assign(req.body, {
			createdAt: Date.now(),
			updatedAt: Date.now(),
			removedAt: 0,
			Role: 'Manager',
		});
		const user = new User(req.body);
		const phongkham = new PhongKham(req.body);

		Promise.all([user.save(), phongkham.save()])
			.then(([user, phongkham]) => {
				Promise.all([
					User.updateOne({ _id: user._id }, { PhongKhamID: phongkham._id }),
					PhongKham.updateOne({ _id: phongkham._id }, { QuanLyID: user._id }),
				])
					.then(() => {
						//tạo token trong 1 giờ
						let token = jwt.sign({ _id: user._id }, process.env.SECRET_JWT);
						res.cookie('userID', token, {
							signed: true,
						});
						return res.json(true);
					})
					.catch(() => {
						return res.json(false);
					});
			})
			.catch((err) => {
				return res.json(false);
			});
	}
	//--[POST]--              /login               -- Login + Create Sign Cookie--
	loginStore(req, res, next) {
		User.findOne({
			Gmail: req.body.Gmail,
			Password: req.body.Password,
		})
			.then((user) => {
				if (user) {
					let token = jwt.sign({ _id: user._id }, process.env.SECRET_JWT);
					res.cookie('userID', token, {
						signed: true,
					});
					return res.json(true);
				} else {
					return res.json(false);
				}
			})
			.catch((err) => {
				return res.json(false);
			});
	}
	//--[Redirect]--          /logout              -- Clear Cookie -- Redirect Home Page --
	logout(req, res, next) {
		res.clearCookie('userID');
		res.redirect('/');
	}
}

module.exports = new HomeController();
