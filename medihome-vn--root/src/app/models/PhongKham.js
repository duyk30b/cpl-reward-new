const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhongKhamSchema = new Schema({
    ThongTinPhongKham: {
        Ten: String,
        DiaChi: String,
        GoogleMap: String,
        Facebook: String,
    },     
    ChuyenKhoa: Array,
    QuanLyID: String,

    createdAt: Number,
    updatedAt: Number,
    removedAt: Number,
},
    {
        timestamps: false,
        versionKey: false,
    }
);

module.exports = mongoose.model('PhongKham', PhongKhamSchema);