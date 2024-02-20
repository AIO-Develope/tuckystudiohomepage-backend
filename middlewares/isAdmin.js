const UserFetch = require('../models/Users/UserFetch');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await UserFetch.getUserById(userId);
    if (!user || !user.admin) {
      return res.status(403).json({ message: 'Only admin users can access this resource.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isAdmin;
