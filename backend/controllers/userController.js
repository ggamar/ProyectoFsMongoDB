import User from '../models/User.js';

export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch(error){
        res.status(400).json({ error : 'Error al crear el usuario'});
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
