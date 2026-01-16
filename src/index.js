const path = require("path");
const PatTicketsClient = require("./client/Client");

(async() => {    
    require("dotenv").config({
        path: path.join(__dirname, '../.env'),
    });


    const ptClient = new PatTicketsClient();

    await ptClient.initialize();
})();