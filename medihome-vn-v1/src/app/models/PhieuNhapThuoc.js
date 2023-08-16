const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhieuNhapThuocSchema = new Schema(
	{
		DanhSach: [
			{
                TuThuocID: String,
				TenThuoc: String,
				GiaBan: Number,
				SoNhap: [{
					SoLuong: Number,
					GiaMua: Number,
					HanSuDung: Number,
				}],
			},
		],
        ThanhToan: {
            ThucTe: Number,
        },
		NguoiNhap: String,
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

module.exports = mongoose.model('PhieuNhapThuoc', PhieuNhapThuocSchema);
