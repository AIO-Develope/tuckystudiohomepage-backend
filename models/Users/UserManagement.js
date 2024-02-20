const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const UserFetch = require('./UserFetch');
const getData = require('./getData');

const UserManagement = {
  addUser: async (user) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      user.id = uuidv4();
      user.admin = false;
      usersData.push(user);
      const usersFilePath = await getData.getUsersFilePath();
      await fs.writeFile(usersFilePath, JSON.stringify(usersData));
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  },


  removeUser: async (userId) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      const filteredUsers = usersData.filter(user => user.id !== userId);
      const usersFilePath = await getData.getUsersFilePath();
      await fs.writeFile(usersFilePath, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  },

  editUser: async (userId, newData) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      const index = usersData.findIndex(user => user.id === userId);
      if (index !== -1) {
        const userToUpdate = usersData[index];
        if (newData.username && newData.username !== userToUpdate.username) {
          const usernameExists = usersData.some(user => user.username === newData.username);
          if (usernameExists) {
            return { message: 'Username already exists', success: false };
          }
          userToUpdate.username = newData.username;
        }
        if (newData.password) {
          const hashedPassword = await bcrypt.hash(newData.password, 10);
          userToUpdate.password = hashedPassword;
        }
        if (newData.hasOwnProperty('admin')) {
          userToUpdate.admin = newData.admin;
        }
        const usersFilePath = await getData.getUsersFilePath();
        await fs.writeFile(usersFilePath, JSON.stringify(usersData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error editing user:', error);
      return false;
    }
  }
  
};
  

module.exports = UserManagement;