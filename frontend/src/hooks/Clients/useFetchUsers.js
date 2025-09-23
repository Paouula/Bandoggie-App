import { useState, useEffect } from 'react';
import { toast } from 'react-native-toast-message';
import { API_FETCH_JSON } from '../../config';

const useFetchUsers = () => {
  const [clients, setClients] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const endpoint = ["clients", "vets"];

  // Función para generar avatar por defecto
  const getDefaultAvatar = (userType, index) => {
    const avatars = {
      client: [
        
      ],
      vet: [
       
      ]
    };
    return avatars[userType][index % avatars[userType].length];
  };

  const handleGetClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await API_FETCH_JSON(endpoint[0]);
      console.log('Clientes obtenidos - estructura completa:', JSON.stringify(data, null, 2));
      
      const normalizedData = (data || []).map((client, index) => ({
        ...client,
        id: client._id || client.id,
        nombre: client.name || client.nombre || 'Sin nombre',
        correo: client.email || client.correo || 'Sin correo',
        telefono: client.phone || client.telefono || 'Sin teléfono',
        registrado: client.createdAt ? new Date(client.createdAt).toLocaleDateString() : client.registrado || 'Sin fecha',
        direccion: client.address || client.direccion || 'Sin dirección',
        avatar: client.avatar || client.photo || client.image || client.profileImage || getDefaultAvatar('client', index),
        userType: 'client'
      }));
      
      console.log('Clientes normalizados:', normalizedData);
      setClients(normalizedData);
      return normalizedData;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError(error.message);
      toast.show({
        type: 'error',
        text1: 'Error al obtener los clientes',
        text2: 'Verifica tu conexión a internet'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGetVets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await API_FETCH_JSON(endpoint[1]);
      console.log('Veterinarios obtenidos - estructura completa:', JSON.stringify(data, null, 2));
      
      const normalizedData = (data || []).map((vet, index) => ({
        ...vet,
        id: vet._id || vet.id,
        nombre: vet.name || vet.nombre || 'Sin nombre',
        correo: vet.email || vet.correo || 'Sin correo',
        telefono: vet.phone || vet.telefono || 'Sin teléfono',
        registrado: vet.createdAt ? new Date(vet.createdAt).toLocaleDateString() : vet.registrado || 'Sin fecha',
        direccion: vet.address || vet.direccion || 'Sin dirección',
        avatar: vet.avatar || vet.photo || vet.image || vet.profileImage || getDefaultAvatar('vet', index),
        userType: 'vet'
      }));
      
      console.log('Veterinarios normalizados:', normalizedData);
      setVets(normalizedData);
      return normalizedData;
    } catch (error) {
      console.error('Error al obtener veterinarios:', error);
      setError(error.message);
      toast.show({
        type: 'error',
        text1: 'Error al obtener los veterinarios',
        text2: 'Verifica tu conexión a internet'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = () => {
    handleGetClientes();
    handleGetVets();
  };

  useEffect(() => {
    handleGetClientes();
    handleGetVets();
  }, []);

  return {
    clients,
    vets,
    loading,
    error,
    handleGetClientes,
    handleGetVets,
    refreshUsers,
  };
};

export default useFetchUsers;

