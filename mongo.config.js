const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, () => {
	console.log('Connected to Database!'+process.env.MONGO_URI);
});