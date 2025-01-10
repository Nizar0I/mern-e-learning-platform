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
