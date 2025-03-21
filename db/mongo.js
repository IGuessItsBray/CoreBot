// ------------------------------------------------------------------------------
// mongo.js
// Create & Supply a database connection
// ------------------------------------------------------------------------------

const mongoose = require('mongoose');
const { MONGO } = require('../util/localStorage').config;

module.exports = {
	mongoose: getMongo,
	initMongo,
	init: initMongo,
};

// ------------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------------

// Emmulate previous behaviour, no reason to be async other than
// not wanting to change what already exists outside this file
async function getMongo() {
	return mongoose;
}

// Initialize the mongo connection for the fist time,
// 'monitoring' being false will not auto-reconnect on error.
function initMongo(monitoring = true) {
	if(monitoring) mongoListeners();
	mongoConnect();
}

// ------------------------------------------------------------------------------
// Private Functions
// ------------------------------------------------------------------------------

// Use the supplied connection info to create a connection
function mongoConnect() {
	mongoose.connect(MONGO, {
		useNewUrlParser: true,
	});
}

// Attach event listeners to the mongo connection
function mongoListeners() {
	mongoose.connection.on('disconnected', () => {
		console.warn('❌ Mongo │ Disconnected');
	});

	mongoose.connection.on('connecting', () => {
		console.info('⚠️ Mongo │ Connecting');
	});

	mongoose.connection.on('connected', () => {
		console.info('✅ Mongo │ Connected');
	});

	mongoose.connection.on('reconnected', () => {
		console.info('✅ Mongo │ Reconnected');
	});

	mongoose.connection.on('error', (e) => {
		console.error('Mongo: Error Happened in Database Connection.', e.message ?? '');
		if (e.message.includes('bad auth')) {
			process.exit(5);
		}
		// else {
		// 	console.warn('Mongo: Attempting to Manually Reconnect to Database.');
		// 	mongoose.connection.close().catch(() => { undefined; });
		// 	try {
		// 		mongoConnect();
		// 	}
		// 	catch (err) {
		// 		console.error(`Mongo: Error in mongoose re-connection\nThe Bot will now STOP.\n${err.message}`);
		// 		process.exit(5);
		// 	}
		// }
	});

	process.on('SIGINT', function () {
		mongoose.connection.close(function () {
			console.log('Mongo: App Closed, Attempting to Properly Close Connection.');
			process.exit(0);
		});
	});
}

// ------------------------------------------------------------------------------