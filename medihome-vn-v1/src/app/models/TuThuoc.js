const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TuThuocSchema = new Schema(
	{
		TenThuoc: String,
		ThanhPhan: String,
		NhomThuoc: String,
		PhanLoai: {
			DangThuoc: String,
			DuongDung: String,
			DongHop: Number,
		},
		NguonGoc: {
			NuocSanXuat: String,
			NhaCungCap: String,
		},
		HangTon: [
			{
				SoLuong: Number,
				GiaMua: Number,
				HanSuDung: Number,
			},
		],
		GiaBan: Number,
		
		PhongKhamID: String,

		createdAt: Number,
		updatedAt: Number,
		removedAt: Number,
	},
	{
		timestamps: false,
		versionKey: false,
	}
);

module.exports = mongoose.model('TuThuoc', TuThuocSchema);
