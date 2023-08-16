const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BenhNhanSchema = new Schema({
    Name: String,
    Phone: String,
    Birthday: Number,
    Gender: String,
    Address: String,

    TienNo: Number,
    
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

module.exports = mongoose.model('BenhNhan', BenhNhanSchema);