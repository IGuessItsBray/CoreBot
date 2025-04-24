const { exit } = require('process');

// ------------------------------------------------------------------------------
switch (process.argv[2]) {
    case '--command':
        generateCommandDocs();
        break;
    case '--locale':
        require('./commandUtils').generateLocales();
        break;
    default:
        console.log('Please specify --game or --command');
        break;
}
// ------------------------------------------------------------------------------
// Command Documentation Generation
// ------------------------------------------------------------------------------

function generateCommandDocs() {
    const fs = require('fs');
    const { publicCommands, privateCommands } = require('./commandUtils').readFiles();
    const { toProperCase } = require('./genUtils');

    const commands = [...publicCommands];

    // create directory ../generated-commands
    const dir = './generated-commands';
    // if it already exists, delete it
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {
            recursive: true,
        });
    }
    fs.mkdirSync(dir);

    commands.forEach(command => {
        // generate the frontmatter, header, and content

        const frontmatter =
            '---\n' +
            'layout: default\n' +
            `title: '${command.name}'\n` +
            'parent: Commands\n' +
            '---\n\n';

        const header = `# \`/${command.name}\`\n\n`;

        const content =
            `## Description\n\n${command.longDescription ?? command.description}` + '\n\n' +
            `## Required Permissions\n\n${command.default_member_permissions?.toArray().join(', ') ?? 'None'}` + '\n\n' +
            // Options in the format of:
            // ### Option Name
            // Description
            // Required: true/false
            // choices: if it has choices, autocomplete if autocomplete: true
            (command.options?.length > 0 ?
            	'## Options\n\n' +
                command.options.map(option => {
                	return `### ${toProperCase(option.name)}\n\n${option.description}` +
                        (option.required ? `\n\nRequired: ${option.required}` : '') +
                        (option.choices ? `\n\nChoices: ${option.choices.map(c => `\n- ${c.name}`).join('')}` : '') +
                        (option.autocomplete ? '\n\nChoices: *Choices will autocomplete.*' : '');
                }).join('\n\n') : '');


        // write the file
        fs.mkdirSync(`${dir}/${command.name}`);
        fs.writeFileSync(`${dir}/${command.name}/index.md`, frontmatter + header + content);
    });

}

// ------------------------------------------------------------------------------

function getAccessToken(clientId, clientSecret) {
    const request = require('sync-request');
    const querystring = require('querystring');

    const postData = querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
    });

    const res = request('POST', 'https://id.twitch.tv/oauth2/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData,
    });

    const data = JSON.parse(res.getBody('utf8'));
    if (data.access_token) {
        return data.access_token;
    }
    else {
        throw new Error('Access token not found in response');
    }
}

function searchGame(clientId, apiKey, gameName) {
    const request = require('sync-request');

    const query = `fields name, status, summary, websites, url; search "${gameName}"; where parent_game = null & tags = (1, 17, 18, 38, 39, 44);`;

    const res = request('POST', 'https://api.igdb.com/v4/games', {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: query, // Sending query in body for POST request
    });

    const data = JSON.parse(res.getBody('utf8'));
    return data;
}

function getGameWebsites(clientId, apiKey, gameId) {
    const request = require('sync-request');

    const query = `fields category,checksum,game,trusted,url; where game = ${gameId}; limit 100;`;

    const res = request('POST', 'https://api.igdb.com/v4/websites', {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: query, // Sending query in body for POST request
    });

    const data = JSON.parse(res.getBody('utf8'));
    return data;
}

// ------------------------------------------------------------------------------
