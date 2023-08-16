const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Gmail: String,
    Password: String,
    Info: {
        Name: String,
        Phone: String,
        Birthday: Number,
        Gender: String,
        Address: String,
    },
    ChucDanh: String,
    QuanLy: Array,
    
    PhongKhamID: String,
    Role: String,
    Status: String,

    createdAt: Number,
    updatedAt: Number,
    removedAt: Number,
},
    {
        timestamps: false,
        versionKey: false,
    }
);

module.exports = mongoose.model('User', UserSchema);