const { startServers } = require("./src/service/localServerOffline");
// const { startServers } = require("./src/service/localServer");
//const { checkUpdate } = require("./src/service/autoUpdate");
//checkUpdate();
startServers();
require("./src/main_hook");
require("./main");