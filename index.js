const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 5000;
const router = require('./router');
const {addUser , delUser , getUser , getUserInRoom} = require('./users');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server , {cors : {origin : '*'}});
io.on('connection' , (socket) => {
    console.log('New user added the Chat');
    socket.on('join' , ({name,room}) => {
        console.log(name,room);
        const newUser = addUser({id : socket.id,name,room});
        console.log(newUser);
        if(!newUser)  {
            console.log('User already esists');
            return;
        }
        
        const userList = getUserInRoom(room);
        socket.emit('display' , userList);
        socket.broadcast.to(room).emit('display' , userList);
        console.log('user in a room: ', userList);
         
         
        
        socket.emit('msg' , {user : 'admin' , text : `Hey ${newUser.name} welcome to ${newUser.room} group`});
        socket.broadcast.to(newUser.room).emit('msg' , {user : 'admin' , text : `${newUser.name} joined the chat`});  
        socket.join(newUser.room); 
        
    });
    socket.on('send' , msg => {
        console.log(socket.id);
        const currUser = getUser(socket.id);
        if(!currUser) {
            console.log('undefined user');
            return;
        }
        console.log(currUser);
        io.to(currUser.room).emit('msg' , {user : currUser.name , text : msg});
    });
    socket.on('typing' , userid => {
        const currUser = getUser(socket.id);
        console.log('typing user is: ', currUser);
        const activeMsg = `${currUser.name} is typing...`;
        socket.broadcast.to(currUser.room).emit('active' , activeMsg);  

    });
    socket.on('notyping' , userid => {
        const currUser = getUser(socket.id);
        const activeMsg = '';
        socket.broadcast.to(currUser.room).emit('inactive' , activeMsg);  

    });
   
    socket.on('disconnect' , () => {
       
        const leftUser = getUser(socket.id);
        io.to(leftUser.room).emit('msg' , {user : 'admin' , text : `${leftUser.name} left the chat`});
        delUser(socket.id);
        const userList = getUserInRoom(leftUser.room);
        io.to(leftUser.room).emit('display' , userList);
    });
});
app.use(router);

server.listen(PORT , () => {
    console.log('Server running...');
});
