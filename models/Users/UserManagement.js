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
};

module.exports = UserManagement;
