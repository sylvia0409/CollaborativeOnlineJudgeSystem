var redisClient = require('../modules/redisClient');

var TIMEOUT_IN_SECONDS= 3600;

module.exports = function(io){
    var collaborations = [];
    var socketIDtoSessionID = [];
    var sessionPath = 'oj_server';

    io.on('connection', (socket) => {
        var sessionID = socket.handshake.query['sessionID']; 
        socketIDtoSessionID[socket.id] = sessionID;
        if(sessionID in collaborations){
            collaborations[sessionID]['participants'].push(socket.id);            
        } else {
            redisClient.get(sessionPath + sessionID, function(data){
                if(data){
                    collaborations[sessionID] = {
                        'cachedInstructions': JSON.parse(data),
                        'participants': []
                    }
                } else {
                    collaborations[sessionID] = {
                        'cachedInstructions': [],
                        'participants': []
                    }
                }           
                collaborations[sessionID]['participants'].push(socket.id);                        
            })
        }
        collaborations[sessionID] = {
            'participants': []
        }

        socket.on('change', (delta) => {
            let sessionID = socketIDtoSessionID[socket.id];
            collaborations[sessionID]['cachedInstructions'].push(
                ['change', delta, Date.now()]
            )
            forwardEvent(socket.id, 'change', delta);
        })

        socket.on('cursorMove', (cursor) => {
            cursor = JSON.parse(cursor);
            cursor['socketID'] = socket.id;
            forwardEvent(socket.id, 'cursorMove', JSON.stringify(cursor));
        })

        socket.on('restoreBuffer', () => {
            let sessionID = socketIDtoSessionID[socket.id];
            let cachedData = collaborations[sessionID]['cachedInstructions'];
            for(i = 0; i < cachedData.length; i++){
                socket.emit(cachedData[i][0], cachedData[i][1]);
            }         
        })

        socket.on('disconnected', () => {
            let sessionID = socketIDtoSessionID[socket.id];
            let foundAndRemove = false;
            let participants = collaborations[sessionID]['participants'];
            let index = participants.indexOf(socket.id);
            if(index >= 0){
                participants.splice(index, 1);
                foundAndRemove = true;
            }
            if(participants.length === 0){
                let key = sessionPath + sessionID;
                let value = JSON.stringify(collaborations[sessionID]['cachedInstructions']);
                redisClient.set(key, value, redisClient.redisPrint);
                redisClient.expire(key, TIMEOUT_IN_SECONDS);
                delete collaborations[sessionID];
            }            
        })
    })
    var forwardEvent = function(socketID, eventName, data){
        let sessionID = socketIDtoSessionID[socketID];
        let participants = collaborations[sessionID]['participants'];
        for(let i = 0; i < participants.length; i++){
            if(participants[i] != socketID){
                io.to(participants[i]).emit(eventName,data);
            }
        }
    }
}