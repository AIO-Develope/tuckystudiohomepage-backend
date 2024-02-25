const getData = require('./getData');

const UserFetch = {
  getUserByUsername: async (username) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      return usersData.find(user => user.username === username);
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  },
  getUsersByRole: async (roleName) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      const usersWithRole = usersData.filter(user => {
        return user.roles.some(role => role.roleName === roleName);
      });
      return usersWithRole;
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  },

  getUserById: async (userId) => {
    try {
      const usersData = await UserFetch.getAllUsers();
      return usersData.find(user => user.id === userId)
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  getAllUsers: async () => {
    try {
      const usersData = await getData.getUsersData();
      return usersData;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  },

  isAdminById: async (userId) => {
    try {
      const user = await UserFetch.getUserById(userId);
      return user && user.admin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  

};

module.exports = UserFetch;
