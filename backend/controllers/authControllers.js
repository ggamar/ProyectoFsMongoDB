import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (userId) => jwt.sign(
  { id: userId },
  process.env.JWT_SECRET,
  { expiresIn: '1h' },
);

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: createToken(user._id),
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error del servidor al crear la cuenta.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const passwordMatches = user && await user.matchPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: createToken(user._id),
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error del servidor al iniciar sesión.' });
  }
};

export default registerUser;