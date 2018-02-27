module.exports = function(io){
    var collaborations = [];
    var socketIDtoSessionID = [];

    io.on('connection', (socket) => {
        var sessionID = socket.handshake.query['sessionID']; 
        socketIDtoSessionID[socket.id] = sessionID;
        if(!(sessionID in collaborations)){
            collaborations[sessionID] = {
                'participants': []
            }
        }
        collaborations[sessionID]['participants'].push(socket.id);
        socket.on('change', (delta) => {
            let sessionID = socketIDtoSessionID[socket.id];
            let participants = collaborations[sessionID]['participants'];
            for(let i = 0; i < participants.length; i++){
                if(participants[i] != socket.id){
                    socket.to(participants[i]).emit('change',delta);
                }
            }
        })
    })
}