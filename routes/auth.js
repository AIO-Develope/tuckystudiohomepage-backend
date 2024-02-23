const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserFetch = require('../models/Users/UserFetch');

const verifyToken = require('../middlewares/verify');

const UserManagement = require('../models/Users/UserManagement')
const router = express.Router();


const multer = require('multer');
const path = require('path');


// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });


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

    let imageLink = null; // Initialize imageLink as null
    if (user.profilePicture) {
      imageLink = `${req.protocol}://${req.get('host')}/${user.profilePicture}`;
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.admin,
      tempUser: user.tempPass
    };

    // Add profilePicture to userInfo only if it exists
    if (imageLink !== null) {
      userInfo.profilePicture = imageLink;
    }

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







router.post('/edit', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const userIdToUpdate = req.userId;

    const userToUpdate = await UserFetch.getUserById(userIdToUpdate);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDataToUpdate = req.body;

    const filteredUserData = {};
    for (const key in userDataToUpdate) {
      if (userDataToUpdate[key] !== undefined) {
        filteredUserData[key] = userDataToUpdate[key];
      }
    }

    if (req.file) {
      
      filteredUserData.profilePicture = req.file.path;
      
    }
    if (filteredUserData.password) {

      filteredUserData.tempPass = false;
    }

    if (Object.keys(filteredUserData).length === 0) {
      return res.status(400).json({ message: 'At least one field to update is required' });
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
