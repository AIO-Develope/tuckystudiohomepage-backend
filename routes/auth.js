const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserFetch = require('../models/Users/UserFetch');

const verifyToken = require('../middlewares/verify');

const UserManagement = require('../models/Users/UserManagement')
const router = express.Router();



router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserFetch.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ userId: user.id, token, tempPass: user.tempPass });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/verify', verifyToken, (req, res) => {
  try {
    res.json({ message: 'Token is valid' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/getUserInformationsAuth', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserFetch.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      isAdmin: user.admin,
      tempUser: user.tempPass,
    };
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch('/edit', verifyToken, async (req, res) => {
  try {
    const userIdToUpdate = req.userId;
    const userDataToUpdate = req.body;

    if (!Object.keys(userDataToUpdate).length) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    const userToUpdate = await UserFetch.getUserById(userIdToUpdate);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const filteredUserData = {};
    for (const key in userDataToUpdate) {
      if (userDataToUpdate[key] !== undefined) {
        filteredUserData[key] = userDataToUpdate[key];
      }
    }

    const updateResult = await UserManagement.editUser(userIdToUpdate, filteredUserData);
    if (updateResult === true) {
      return res.json({ message: 'User information updated successfully' });
    } else {
      return res.status(400).json({ message: updateResult.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
