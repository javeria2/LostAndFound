var socketio = require('socket.io');

module.exports.listen = function(app){
	io = socketio.listen(app);
	//receive socket events
	io.sockets.on('connection', function(socket){
		socket.on('send message', function(data){
			//send the data to the users including ourself 
			//we use socket.broadcast.emit to send it to everyone except us
			console.log('emmited!');
			io.sockets.emit('new message', data);
		});
	});
}