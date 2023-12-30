const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app); // Create an HTTP server
const socketIo = require("socket.io");

const io = socketIo(server);

io.on("connection", (socket) => {
    console.log("socket",socket.id);

    // socket.emit("Admin",{"username":"test"})



    // io.on()


});

module.exports = { app, server, io };

