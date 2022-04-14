const Auditlog = require("discord-auditlog");
module.exports = (client) => {
    Auditlog(client, {
        "804915620654350346": {
            auditlog: "audit-log",
            movement: "audit-log",
            auditmsg: "audit-log", // Default to fasle, recommend to set a channel
            voice: "audit-log", // Set a Channel name if you want it
            trackroles: true, // Default is False
            excludedroles: ['950969966918766625', '']  // This is an OPTIONAL array of Roles ID that won't be tracked
        },
        "945205088287326248": {
            auditlog: "audit-log",
            movement: "audit-log",
            auditmsg: "audit-log", // Default to fasle, recommend to set a channel
            voice: "audit-log", // Set a Channel name if you want it
            trackroles: true, // Default is False
            excludedroles: ['947305031466627095', '']  // This is an OPTIONAL array of Roles ID that won't be tracked
        }
    });
};