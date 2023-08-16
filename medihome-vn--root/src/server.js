if (!process.env.PORT) require('dotenv').config();

const path = require('path');
const express = require('express');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3001;

//Connect Database: MongoDB
const mongoose = require('./config/database/mongoose');
const mongoDB = require('./config/database/mongoDB');
const uri = process.env.MONGODB_URI || process.env.MONGO_LOCALHOST;
mongoose.connect(uri);
mongoDB.connect(uri, process.env.MONGODB_DB_NAME);

//Use Middleware -body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//User cookieParser
app.use(cookieParser(process.env.SECRET_SIGNEDCOOKIES));

//Static public link
app.use(express.static(path.join(__dirname, 'public/')));
//Template Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

routes(app);
app.listen(port, () => {
	console.log('Server listening at: ' + '\x1b[34m' + 'http://localhost:' + port + '\x1b[0m');
	console.log('Database listening at: ' + '\x1b[34m' + uri + '\x1b[0m');
});