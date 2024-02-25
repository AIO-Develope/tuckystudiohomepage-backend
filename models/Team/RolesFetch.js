const getData = require('../Users/getData');

const RolesFetch = {
  getRoleByName: async (roleName) => {
    try {
      const rolesData = await RolesFetch.getAllRoles();
      return rolesData.find(role => role.roleName === roleName);
    } catch (error) {
      console.error('Error getting role by name:', error);
      return null;
    }
  },
  getRoleById: async (id) => {
    try {
      const rolesData = await RolesFetch.getAllRoles();
      return rolesData.find(role => role.id === id);
    } catch (error) {
      console.error('Error getting role by name:', error);
      return null;
    }
  },

  getAllRoles: async () => {
    try {
      const rolesData = await getData.getRolesData();
      return rolesData;
    } catch (error) {
      console.error('Error getting all roles:', error);
      return [];
    }
  }
};

module.exports = RolesFetch;
