const colorLog = require('../../utils/MyUtils.js').colorLog;
const mongoose = require('mongoose');

connect = (uri) => {
    let options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }
    mongoose.connect(uri, options)
        .then(() => console.log((colorLog('Mongoose connect successfully !!!').yellow)))
        .catch((error) => console.log(colorLog(colorLog(error).yellow).bgRed))
}

module.exports = { connect };