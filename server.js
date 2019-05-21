// #region initial
var http = require("http")
var express = require("express")
var fs = require("fs")
var app = express()
var server = http.Server(app);
var io = require("socket.io")(server)
const PORT = 3000
var path = require("path")
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}))
// #endregion initial

// #region static routing
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + `/static/index.html`))
})
// #endregion static routing

var game = {
    io: io.of('/game'),
    clients: [],
}

game.io.on('connect', socket => {
    console.log(`socekt ${socket.id} connected`);
    game.clients.push(socket.id)


    socket.emit('player_nr', game.clients.indexOf(socket.id), game.clients) // notify player his number and give tab
    socket.broadcast.emit('client_connected', socket.id, game.clients); // notify other players


    //disconnect
    socket.on('disconnect', () => {
        console.log(`socekt ${socket.id} disconnected`);
        game.clients.splice(game.clients.indexOf(socket.id), 1)
        game.io.emit('client_disconnected', socket.id, game.clients);
    })

    // barrel rotation
    socket.on('rotate_barrel', val => {
        socket.broadcast.emit('barrel_rotated', socket.id, val); // notify other players
    })

    // cannon rotation
    socket.on('rotate_cannon', val => {
        socket.broadcast.emit('cannon_rotated', socket.id, val); // notify other players
    })

    // cannon power
    socket.on('power_cannon', val => {
        socket.broadcast.emit('cannon_powered', socket.id, val); // notify other players
    })

    // cannon weight
    socket.on('weight_cannon', val => {
        socket.broadcast.emit('cannon_weighted', socket.id, val); // notify other players
    })

    // cannon fire
    socket.on('fire_cannon', () => {
        socket.broadcast.emit('cannon_fired', socket.id); // notify other players
    })

})

// automatic routing
app.use(express.static("."))


//nasłuch na określonym porcie
server.listen(PORT, function () {
    console.log(`server started on port: ${PORT}`)
})