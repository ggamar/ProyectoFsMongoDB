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

export const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    // Construir la consulta de búsqueda y filtrado
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Búsqueda insensible a mayúsculas
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role; // Filtrar por rol
    }

    // Paginación y conversión a enteros, con valores predeterminados si no se proporcionan
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    const users = await User.find(query)
      .limit(limitNumber)       //Limitar cantidad de resultados
      .skip(skip)               //saltar registros para paginacion
      .sort({ createdAt: -1 }); //Ordenar por fecha de creacion (mas reciente primero)

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      totalUsers,
      currentPage: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalUsers / limitNumber), //calcular el total de pa
      users,
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Iniciar
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

export default loginUser;