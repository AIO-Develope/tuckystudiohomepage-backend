const express = require('express');
const UserManagement = require('../models/Users/UserManagement');
const UserFetch = require('../models/Users/UserFetch');
const bcrypt = require('bcrypt')

const verifyToken = require('../middlewares/verify');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.post('/user/register', verifyToken, isAdmin, async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await UserFetch.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashedPassword };
      await UserManagement.addUser(newUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.delete('/user/delete/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const userToDelete = await UserFetch.getUserById(userIdToDelete);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    await UserManagement.removeUser(userIdToDelete);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/user/edit/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
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