const MongoClient = require('mongodb').MongoClient;
let _mongoDB;

let options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

let connect = async (uri, dbName) => {
	try {
		let client = new MongoClient(uri, options);
		let _connection = await client.connect();
		_mongoDB = _connection.db(dbName);
		console.log('\x1b[33m' + 'MongoDB connect successfully !!!' + '\x1b[0m');
	} catch (error) {
		console.log('\x1b[33m\x1b[41m' + error + '\x1b[0m');
	}
};

let getDB = () => {
	return _mongoDB;
};

module.exports = { getDB, connect };

//let connect_promise = (uri, dbName) => {
// 	let client = new MongoClient(uri, options);
// 	client.connect()
// 		.then((results) => {
// 			_mongoDB = client.db(dbName);
// 			console.log(colorLog('MongoDB connect successfully !!!').yellow);
// 		})
// 		.catch((error) => {
// 			console.log(colorLog(colorLog(error).yellow).bgRed);
// 		});
// };

//let connect_callback = (uri, dbName) => {
// 	let client = new MongoClient(uri, options);
// 	client.connect((error) => {
// 		if (error) {
// 			console.log(colorLog(colorLog(error).yellow).bgRed);
// 		} else {
// 			_mongoDB = client.db(dbName);
// 			console.log(colorLog('MongoDB connect successfully !!!').yellow);

// 			_mongoDB.collection('users').find({}, function (error, result) {
// 				if (error) throw error;
// 				result.toArray(function (err, list) {
// 					console.log(JSON.stringify(list[0]));
// 				});
// 			});
// 			client.close();
// 		}
// 	});
// };
