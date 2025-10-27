// controllers/authController.js

import Client from '../models/Client.js';
import Employee from '../models/Employee.js';
import Vet from '../models/Vet.js';

/**
 * Actualizar perfil del usuario autenticado
 * PUT /api/auth/me/update
 */
export const updateProfile = async (req, res) => {
  try {
    // El usuario viene del middleware de autenticación
    const userId = req.user.id || req.user._id;
    const userType = req.user.userType;
    const updateData = req.body;

    console.log('Updating profile for user:', userId);
    console.log('User type:', userType);
    console.log('Update data:', updateData);

    // Validar que haya datos para actualizar
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay datos para actualizar'
      });
    }

    let updatedUser = null;
    let Model = null;

    // Seleccionar el modelo correcto según el tipo de usuario
    switch(userType) {
      case 'client':
        Model = Client;
        break;
      case 'employee':
        Model = Employee;
        break;
      case 'vet':
        Model = Vet;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario no válido'
        });
    }

    // Campos que NO se pueden actualizar
    const protectedFields = ['password', '_id', 'userType', 'createdAt'];
    protectedFields.forEach(field => {
      delete updateData[field];
    });

    // Actualizar el usuario en MongoDB
    updatedUser = await Model.findByIdAndUpdate(
      userId,
      { 
        $set: updateData,
        updatedAt: new Date()
      },
      { 
        new: true, // Devolver el documento actualizado
        runValidators: true // Ejecutar validaciones del esquema
      }
    ).select('-password'); // No devolver la contraseña

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    console.log('User updated successfully:', updatedUser._id);

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Datos actualizados correctamente',
      user: {
        _id: updatedUser._id,
        id: updatedUser._id,
        email: updatedUser.email,
        userType: updatedUser.userType,
        name: updatedUser.name,
        nameVet: updatedUser.nameVet,
        nameEmployees: updatedUser.nameEmployees,
        phone: updatedUser.phone,
        phoneEmployees: updatedUser.phoneEmployees,
        address: updatedUser.address,
        addressEmployees: updatedUser.addressEmployees,
        birthday: updatedUser.birthday,
        dateOfBirth: updatedUser.dateOfBirth,
        hireDateEmployee: updatedUser.hireDateEmployee,
        duiEmployees: updatedUser.duiEmployees,
        locationVet: updatedUser.locationVet,
        nitVet: updatedUser.nitVet,
        image: updatedUser.image,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Errores de validación de MongoDB
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar los datos',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const userType = req.user.userType;

    let user = null;
    let Model = null;

    // Seleccionar modelo según tipo de usuario
    switch(userType) {
      case 'client':
        Model = Client;
        break;
      case 'employee':
        Model = Employee;
        break;
      case 'vet':
        Model = Vet;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario no válido'
        });
    }

    // Buscar usuario
    user = await Model.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        nameVet: user.nameVet,
        nameEmployees: user.nameEmployees,
        phone: user.phone,
        phoneEmployees: user.phoneEmployees,
        address: user.address,
        addressEmployees: user.addressEmployees,
        birthday: user.birthday,
        dateOfBirth: user.dateOfBirth,
        hireDateEmployee: user.hireDateEmployee,
        duiEmployees: user.duiEmployees,
        locationVet: user.locationVet,
        nitVet: user.nitVet,
        image: user.image
      }
    });

  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil'
    });
  }
};