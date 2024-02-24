const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const UserFetch = require('./UserFetch');
const getData = require('./getData');
const bcrypt = require('bcrypt')

const UserManagement = {
  addUser: async (user) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      user.id = uuidv4();
      user.admin = false;
      user.tempPass = false;
      user.firstName = '';
      user.lastName = '';
      user.email = '';
      user.roles = []; 
      user.profilePicture = '';
      usersData.push(user);
      const usersFilePath = await getData.getUsersFilePath();
      await fs.writeFile(usersFilePath, JSON.stringify(usersData));
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  },

  addTempUser: async (user) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      const generatedPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = {
        username: user.username,
        id: uuidv4(),
        password: hashedPassword,
        admin: false,
        tempPass: true,
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: '',
        roles: []

      };
      usersData.push(newUser);
      const usersFilePath = await getData.getUsersFilePath();
      await fs.writeFile(usersFilePath, JSON.stringify(usersData));
      return generatedPassword;
    } catch (error) {
      console.error('Error adding temporary user:', error);
      return false;
    }
  },


  removeUser: async (userId) => {
    try {
      const usersData = await UserFetch.getAllUsers();
  
      const userToRemove = usersData.find(user => user.id === userId);
  
      if (!userToRemove) {
        console.error('User not found');
        return false;
      }
  
      const profilePicturePath = userToRemove.profilePicture;
  
      await fs.unlink(profilePicturePath);
  
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
        let tempPass;
  
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
          tempPass = false;
        }

        if (newData.hasOwnProperty('roles')) {
          userToUpdate.roles = newData.roles;
        }
  
        if (newData.hasOwnProperty('admin')) {
          userToUpdate.admin = newData.admin;
        }
  
        if (newData.hasOwnProperty('firstName')) {
          userToUpdate.firstName = newData.firstName;
        }
  
        if (newData.hasOwnProperty('lastName')) {
          userToUpdate.lastName = newData.lastName;
        }
  
        if (newData.hasOwnProperty('email')) {
          userToUpdate.email = newData.email;
        }
  
        if (newData.hasOwnProperty('profilePicture')) {
          userToUpdate.profilePicture = newData.profilePicture;
        }
  
        if (newData.hasOwnProperty('tempPass')) {
          userToUpdate.tempPass = newData.tempPass;
          tempPass = newData.tempPass;
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
function generateRandomPassword() {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
}

module.exports = UserManagement;
