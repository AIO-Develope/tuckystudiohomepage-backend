const express = require('express');

const UserFetch = require('../models/Users/UserFetch');

const verifyToken = require('../middlewares/verify');

const router = express.Router();

















router.get('/staff', async (req, res) => {
  try {
    const user = await UserFetch.getUserById(req.userId);


    const allUsers = await UserFetch.getAllUsers();


    const usersData = allUsers.map(user => {
      let imageLink = null;
      if (user.profilePicture) {
        imageLink = `${req.protocol}://${req.get('host')}/${user.profilePicture}`;
      } else {
        imageLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png';
      }
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        profilePicture: imageLink
      };
    });

    res.json(usersData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});










module.exports = router;
