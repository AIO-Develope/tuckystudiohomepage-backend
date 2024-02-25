const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const RolesFetch = require('./RolesFetch');
const getData = require('../Users/getData');

const RolesManagement = {
  addRole: async (role) => {
    try {
      const rolesData = await RolesFetch.getAllRoles();
      const newRole = {
        roleName: role.roleName,
        id: uuidv4()
      };
      rolesData.push(newRole);
      const rolesFilePath = await getData.getRolesFilePath();
      await fs.writeFile(rolesFilePath, JSON.stringify(rolesData, null, 2));
      return true;
    } catch (error) {
      console.error('Error adding role:', error);
      return false;
    }
  },  

  removeRole: async (roleId) => {
    try {
      const rolesData = await RolesFetch.getAllRoles();
      const roleToRemoveIndex = rolesData.findIndex(role => role.id === roleId);
      if (roleToRemoveIndex === -1) {
        console.error('Role not found');
        return false;
      }
      rolesData.splice(roleToRemoveIndex, 1);
      const rolesFilePath = await getData.getRolesFilePath();
      await fs.writeFile(rolesFilePath, JSON.stringify(rolesData));
      return true;
    } catch (error) {
      console.error('Error removing role:', error);
      return false;
    }
  },

  editRole: async (roleId, newData) => {
    try {
      const rolesData = await RolesFetch.getAllRoles();
      const roleToUpdateIndex = rolesData.findIndex(role => role.id === roleId);
      if (roleToUpdateIndex !== -1) {
        const roleToUpdate = rolesData[roleToUpdateIndex];
        // Update fields if they exist in newData
        for (const key in newData) {
          if (newData.hasOwnProperty(key)) {
            roleToUpdate[key] = newData[key];
          }
        }
        const rolesFilePath = await getData.getRolesFilePath();
        await fs.writeFile(rolesFilePath, JSON.stringify(rolesData));
        return true;
      } else {
        console.error('Role not found');
        return false;
      }
    } catch (error) {
      console.error('Error editing role:', error);
      return false;
    }
  }
};

module.exports = RolesManagement;