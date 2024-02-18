const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const User = {
  getAllUsers: () => {
    try {
      const usersData = fs.readFileSync(usersFilePath);
      return JSON.parse(usersData);
    } catch (error) {
      return [];
    }
  },

  addUser: (user) => {
    try {
      const usersData = User.getAllUsers();
      usersData.push(user);
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData));
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  },

  getUserByUsername: (username) => {
    const usersData = User.getAllUsers();
    return usersData.find(user => user.username === username);
  }
};

module.exports = User;
