const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const User = {
  getAllUsers: async () => {
    try {
      const usersData = await fs.readFile(usersFilePath, 'utf8');
      return JSON.parse(usersData);
    } catch (error) {
      return [];
    }
  },

  addUser: async (user) => {
    try {
      const usersData = await User.getAllUsers();
      usersData.push(user);
      await fs.writeFile(usersFilePath, JSON.stringify(usersData));
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  },

  getUserByUsername: async (username) => {
    try {
      const usersData = await User.getAllUsers();
      return usersData.find(user => user.username === username);
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }
};

module.exports = User;
