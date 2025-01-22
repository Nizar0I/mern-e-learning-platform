// src/routes/user.routes.js

const router = require('express').Router();
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Admin-protected routes
router.get('/', getAllUsers);       // GET all users, optionally with search
router.get('/:id', getUserById);    // GET single user by ID
router.put('/:id', updateUser);     // UPDATE user (role, email, etc.)
router.delete('/:id', deleteUser);  // DELETE user

module.exports = router;
