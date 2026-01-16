const { Events } = require("discord.js");
const PatTickets = require("../client/Client");

module.exports = {
    name: Events.ClientReady,
    once: true,

    /**
     * 
     * @param {PatTickets} ptClient 
     * @param {*} _provClient 
     */
    execute: (ptClient, _provClient) => {
        console.log(`The client has logged in. Username: ${ptClient.user.tag}`);
    }
};

