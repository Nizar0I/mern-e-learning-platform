const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // <--- Get 'role'
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Utilisateur déjà existant" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const newUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      role: role || "student", // fallback if none provided
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    res.status(200).json(user); // On renvoie l'objet user au gateway (qui génèrera le JWT)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET /users?search=...
exports.getAllUsers = async (req, res) => {
  try {
    // Optional search by username OR email
    const { search } = req.query;
    let query = {};

    if (search) {
      // Case-insensitive regex search on username or email
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).select('-passwordHash'); 
    // Exclude passwordHash if you like
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    // If admin wants to reset user’s password
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();
    // Optionally exclude passwordHash from response
    const { passwordHash, ...rest } = user.toObject();
    res.json(rest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
