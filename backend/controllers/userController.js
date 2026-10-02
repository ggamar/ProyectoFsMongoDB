import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({ message : 'El usuario ya existe'});
        } 

        const newUser = ({name, email, password});
        await newUser.save();

        //Generar el token jwt
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
    
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token,
        });
        
    } catch(error){
        console.error(error)
        res.status(500).json({ message: 'Error del servidor'});
    }


};

export const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(error){
        res.status(400).json({ error : 'Error al encontrar el usuario'})
    }
};

// Iniciar sesion
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};