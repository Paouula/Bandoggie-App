import { toast } from "react-hot-toast";
//Importo las funciones globales para realizar el fetch
import { API_FETCH_FORM, API_FETCH_JSON } from "../../config";

//Creo una constante que contendra los metodos
const useFetchUsers = () => {
  //Declaro los endpoints en un arreglo
  const endpoint = ["clients", "vets"];

  //Obtener todos los clientes
  const handleGetClientes = async () => {
    try {
      const data = await API_FETCH_JSON(endpoint[0]);
      return data;
    } catch (error) {
      toast.error("Error al obtener los clientes");
      console.error(error);
    }
  };

  //Obtener todos las Veterinarias
  const handleGetVets = async () => {
    try {
      const data = await API_FETCH_JSON(endpoint[1]);
      return data;
    } catch (error) {
      toast.error("Error al obtener los clientes");
      console.error(error);
    }
  };

  return {
    handleGetClientes,
    handleGetVets,
  }
};

export default useFetchUsers;
