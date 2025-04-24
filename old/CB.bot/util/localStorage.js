// ------------------------------------------------------------------------------
// localStorage.js
// Utilities for reading config.json and exposing it's contents to other files

module.exports = {
    config: loadConfig()
}

// ------------------------------------------------------------------------------

function loadConfig() {
    try {
        return require('../config.json');
    }
    catch (e) {
        try {
            return require('/config/config.json');
        }
        catch (e) {
            console.error('❌ config.json not found. Please create one using config.example.json');
            process.exit(1);
        }
    }
}

// ------------------------------------------------------------------------------