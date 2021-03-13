const Player = require("../domain/Player");
const LobbyCodeDTO = require("../domain/DTO/response/LobbyCodeDTO");
const MafiaGame = require("../domain/MafiaGame");

/**
 * Event handlers and logic for `create-lobby` and `lobby-code`
 * The goal of these lobby events is to allow a host to create a game and receive a new room id. 
 * @param {any} io 
 * @param {any} socket 
 * @param {MafiaGame} mafiaGame 
 * 
 * load all the event handlers for handelling the lobby.
 */
module.exports = function(io, socket, mafiaGame){
    socket.on("create-lobby", (createLobbyDTO) => {
        console.log("New room request received");
        // Create room and assign host player to the room
        let roomID = mafiaGame.newGame();
        let host = new Player(socket.id, roomID, createLobbyDTO.nickname);
        mafiaGame.gameRoomsDict[roomID].addPlayer(host);

        // Subscribe to the room events
        socket.join(roomID);

        // Add player information to the host socket
        socket.player = host;

        // Send room ID back to host.
        io.in(roomID).emit("lobby-code", new LobbyCodeDTO(roomID));
    });

    // this overlaps with justins code.
    socket.on('lobby-ready', () => {

        let rooms = socket.rooms; //todo: remove hardcode: there should only be 1 room and first is the socket id.
        let arrayRooms = Array.from(rooms);
        let roomID = arrayRooms[1];

        let mafiaGameRoom = mafiaGame.gameRoomsDict[roomID];
        let hostsocketID = mafiaGameRoom[0]; //(host is first person)
        let mafiaGamePlayers = mafiaGameRoom.players;
    
        // message should show the confirmmation button only for the host.
        socket.broadcast.to(hostsocketID).emit('confirm-game-start',  null);
        
        // to all other members tell them that game is ready
        // host is position 0, so skip.
        for (i = 1; i < mafiaGamePlayers.length; i++) {
          let player = mafiaGamePlayers[i];
            socket.broadcast.to(hostsocketID).emit('game-ready',  null);
        }
      });


  //  host has clicked start game
  socket.on('start-game', () => {

    let roomID = socket.rooms[1]; //todo: remove hardcode: there should only be 1 room and first is the socket id.
        
    let mafiaGameRoom = mafiaGame.gameRoomsDict[roomID];
    let mafiaGamePlayers = mafiaGameRoom.players;

    // sending to all clients in "game" room, including sender
    io.in(roomID).emit('game-start', null);
     
  });





};