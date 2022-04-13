const Auditlog = require("discord-auditlog");
module.exports = (client) => {
    Auditlog(client, {
        "955230769939353623": {
            auditlog: "audit-log-testing",
            movement: "audit-log-testing",
            auditmsg: "audit-log-testing", // Default to fasle, recommend to set a channel
            voice: "audit-log-testing", // Set a Channel name if you want it
            trackroles: true, // Default is False
            excludedroles: ['', '']  // This is an OPTIONAL array of Roles ID that won't be tracked
        }
    });
};