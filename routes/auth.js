const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserFetch = require('../models/Users/UserFetch');

const verifyToken = require('../middlewares/verify');


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
    res.json({ userId: user.id, token });
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
    };
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
