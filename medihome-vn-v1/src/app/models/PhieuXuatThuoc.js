const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhieuXuatThuocSchema = new Schema(
	{
		DanhSach: [
			{
                TuThuocID: String,
				TenThuoc: String,
				GiaBan: Number, 
				SoXuat: [{
					SoLuong: Number,
					HanSuDung: Number,
				}],
				CachDung: String, 
			},
		],
        ThanhToan: {
            ThucTe: Number,
        },
		NguoiXuat: String,
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

module.exports = mongoose.model('PhieuXuatThuoc', PhieuXuatThuocSchema);
