

const users = [];
const addUser = ({id,name,room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const isUserExists = users.find((user) => (user.name === name && user.room === room));

    if(isUserExists) {
        return null;
    }
    const newUser = {id,name,room};
    users.push(newUser);
    return newUser;
};
const delUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index != -1) {
        return users.splice(index,1);
    }
};
const getUser = (id) => {
     return users.find((user) => user.id === id);
};
const getUserInRoom = (room) => {
    let listofUsers = users.filter((user) => user.room === room);
    console.log('list is: ',listofUsers);
    return listofUsers;
};
module.exports = {addUser , delUser , getUser ,getUserInRoom};