// ------------------------------------------------------------------------------
// localStorage.js
// Utilities for reading config.json and exposing it's contents to other files

module.exports = {
	config: loadConfig(),
};

// ------------------------------------------------------------------------------

function loadConfig() {
	try {
		return require('./config.json');
	}
	catch (e) {
		return {
      APIAddress: process.env.REACT_APP_API_URL ?? "http://localhost:4500/api/",
      ClientID: process.env.REACT_APP_CLIENT_ID ?? "955267092800733214",
    };
	}
}

// ------------------------------------------------------------------------------