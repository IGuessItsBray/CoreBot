module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------
    name: 'AutoPublish Alerts',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {

        const channels = [
            '1070483066583261267', // Bot Alerts
            '1070483112594767943', // Service Alerts
            '1008524053742633010', //Bot Updates
            '1016450975168483408', //Github alert
        ];

        if(!channels.includes(message.channelId)) return;

        await message
            .crosspost()
            .then(m => m.react('✅'));
    },

    // ------------------------------------------------------------------------------
};