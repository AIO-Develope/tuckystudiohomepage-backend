const fs = require('fs').promises;
const path = require('path');

const getData = {
  async getUsersData() {
    try {
      const usersFilePathEnv = process.env.USERS_FILE_PATH;

      const rootDir = path.resolve(__dirname, '../../');

      const usersFilePath = path.join(rootDir, usersFilePathEnv);

      try {
        await fs.access(usersFilePath);
      } catch (error) {
        await fs.writeFile(usersFilePath, '[]');
      }

      const usersData = await fs.readFile(usersFilePath, 'utf8');

      const users = JSON.parse(usersData);

      return users;
    } catch (error) {
      console.error('Error reading users data:', error);
      return null;
    }
  },
  async getUsersFilePath() {
    try {
      const usersFilePathEnv = process.env.USERS_FILE_PATH;

      const rootDir = path.resolve(__dirname, '../../');

      return path.join(rootDir, usersFilePathEnv);
    } catch (error) {
      console.error('Error getting users file path:', error);
      return null;
    }
  },
  async getRolesFilePath() {
    try {
      const rolesFilePathEnv = process.env.ROLES_FILE_PATH;

      const rootDir = path.resolve(__dirname, '../../');

      return path.join(rootDir, rolesFilePathEnv);
    } catch (error) {
      console.error('Error getting users file path:', error);
      return null;
    }
  },
  async getRolesData() {
    try {
      const rolesFilePathEnv = process.env.ROLES_FILE_PATH;

      const rootDir = path.resolve(__dirname, '../../');

      const rolesFilePath = path.join(rootDir, rolesFilePathEnv);

      try {
        await fs.access(rolesFilePath);
      } catch (error) {
        await fs.writeFile(rolesFilePath, '[]');
      }

      const rolesData = await fs.readFile(rolesFilePath, 'utf8');

      const roles = JSON.parse(rolesData);

      return roles;
    } catch (error) {
      console.error('Error reading users data:', error);
      return null;
    }
  },
};

module.exports = getData;
