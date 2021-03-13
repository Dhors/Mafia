const app = require("express")();
const server = require("http").createServer(app);
const config = require('./config.json');
const io = require("socket.io")(server, {
    // Set up of CORS settings for socket.io server
    // Reason for all site access is for the ease of development, since we might have various local/cloud website setup for testing purposes.
    // While allowing all origins may pose a security thread for a banking website, as any site can make a request using the same session
    // This won't be a problem in our website, as there are no local session/cookies returned to the user. 
    // Please refer to the post: https://stackoverflow.com/questions/12001269/what-are-the-security-risks-of-setting-access-control-allow-origin
    cors: {
        origin: config.cors_origin, // Allow all origin to connect to the website
    }
});
const port = process.env.PORT || config.local_port;

const load_lobby_events = require("./Events/LobbyEvents");







app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Listen for a "connection" event for incoming sockets.
io.on("connection", (socket) => {
    console.log("User has connected");



      // when the 6th player joins send a message out to all users that the 6th player has joined
  // host should get the message
  socket.on('lobby-ready', () => {
    
    load_lobby_events(io, socket, mafiaGame);
    //SocketEvent.load_common_event(socket);





    // let mafiaGame = MafiaGame.GetInstance(); // todo: implement to grab the game.(singleton?)
    // let mafiaGameRoom = mafiaGame.gameRoomsDict[roomID];
    // //let hostsocketID = mafiaGameRoom.hostsocketID;
    // let hostsocketID = mafiaGameRoom[0]; //(host is first person)
    // let mafiaGamePlayers = mafiaGameRoom.players;

    // // message should show the confirmmation button only for the host.
    // socket.broadcast.to(hostsocketID).emit('confirm-game-start',  null);
    
    // // to all other members tell them that game is ready
    // // host is position 0, so skip.
    // for (i = 1; i < mafiaGamePlayers.length; i++) {
    //   let player = mafiaGamePlayers[i];

    //   //if (player.socketID !== hostsocketID){
    //     socket.broadcast.to(hostsocketID).emit('game-ready',  null);
    //   //}
    // }




  });


  // when the 6th player joins send a message out to all users that the 6th player has joined
  socket.on('gameReady', () => {
    socket.broadcast.emit('startstart',  "started game");
     
 
  });










});

// Start the server on our predetermined port number.
server.listen(port, () => {
    console.log("Listening on *:" + port);
})