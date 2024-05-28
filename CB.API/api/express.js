// ------------------------------------------------------------------------------
// express.js
// Express API for the bot
// ------------------------------------------------------------------------------

const { color } = require('./util/genUtils');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

module.exports = {
	init,
};



// ------------------------------------------------------------------------------

function init(port) {
    console.log('API: Initializing');

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(cors());

    app.use((req, res, next) => {
        console.debug(`API ${color.yellow}DEBUG: ${req.method} ${req.url}\n\t${req.ip}\n\t${req.headers['user-agent']}${color.reset}`);
        next();
    });

    registerRoutes();
    app.listen(port, () => {
        console.log(`API: Listening on port ${port}`)
    });

}

// ------------------------------------------------------------------------------
function registerRoutes() {
    const { validate: authorize } = require('./routes/auth/discord');

    // Root
    app.get('/', require('./routes/misc/redirect'));
    app.get('/api', require('./routes/misc/redirect'));
    app.get('/api/client', require('./routes/client/info'));

    // Auth
    app.get("/api/auth", require('./routes/auth/discord').login);
    app.delete("/api/auth", authorize, require('./routes/auth/discord').logout);

    // User
    app.get('/api/user/', authorize, require('./routes/user/getUser'));
    app.get('/api/user/:id', authorize, require('./routes/user/getUser'));


    // Guild
    app.get('/api/client/guild/', authorize, require('./routes/client/guild').guilds);
    app.get('/api/client/guild/:id', authorize, require('./routes/client/guild').guild);

    // Proxy 
    app.get('/api/getRegisteredMembers/', authorize, require('./routes/proxy/getRegisteredMembers'));

    // Misc
    app.get('/api/stats/', authorize, require('./routes/misc/stats'));

}