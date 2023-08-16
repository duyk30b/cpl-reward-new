const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LuotKhamSchema = new Schema({
    BenhNhanID: String,
    DonThuocID: String,

    ThanhToan: {
        TongTien: Number,
        CongKham: Number,
    },
    
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

module.exports = mongoose.model('LuotKham', LuotKhamSchema);