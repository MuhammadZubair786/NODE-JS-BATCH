const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app); // Create an HTTP server
const socketIo = require("socket.io");
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: "*",
    },
}); // Initialize socket.io

io.on("connection", (socket) => {
    console.log(socket.id);


});

module.exports = { app, server, io };