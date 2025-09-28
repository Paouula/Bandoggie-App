import { toast } from "react-hot-toast";
// Importa la funciÃ³n API_FETCH_FORM desde el archivo config
/*API_FETCH_FORM y API_FETCH_JSON son funciones que manejan las solicitudes HTTP de manera global del proyecto
En su interior, configura la URL base y los encabezados necesarios para las solicitudes en formato FormData y Json.*/
import { API_FETCH_FORM, API_FETCH_JSON } from "../../config.js";

//Hook para registro de veterinarias
const useFetchRegisterVet = () => {
  //Declaro el endpoint

  const endpoint = "registerVet";

  // FunciÃ³n para registrar veterinarias
  const handleRegister = async (nameVet, email, password, locationVet, nitVet, image) => {
    try {
      const formData = new FormData();
      formData.append("nameVet", nameVet);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("locationVet", locationVet);
      formData.append("nitVet", nitVet);
      if (image) {
        formData.append("image", image);
      }
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }
      const data = await API_FETCH_FORM(endpoint, formData, {
        method: "POST",
      });

      toast.success(
        "Se ha registrado correctamente. Por favor, verifica tu correo electrÃ³nico."
      );
      return data;
    } catch (error) {
      toast.error(error.message || "Error en el registro");
      throw error;
    }
  };

  //FunciÃ³n para verificar el correo electrÃ³nico
  // Esta funciÃ³n se usa para verificar el correo electrÃ³nico despuÃ©s del registro
  const verifyEmail = async (verificationCode) => {
    try {
      const data = await API_FETCH_JSON(`${endpoint}/verifyCodeEmail`, {
        method: "POST",
        body: { verificationCode },
      });

      return data;
    } catch (error) {
      toast.error(error.message || "Error al verificar el correo");
      throw error;
    }
  };

  // Retorna las funciones para ser usadas en los componentes
  return { handleRegister, verifyEmail };
};

export default useFetchRegisterVet;