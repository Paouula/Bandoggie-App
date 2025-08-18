import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./InputPassword.css";

const PasswordInput = ({ register, error, className = "", ...props }) => {
  const [show, setShow] = useState(false); // Controla si se muestra el texto o la contraseña

  // Limita la longitud de caracteres a 30 directamente en el input
  const handleLimit = (e) => {
    const max = e.target.value.slice(0, 30);
    e.target.value = max; // Modifica directamente el valor — esto puede afectar el estado si se usa react-hook-form
  };

  return (
    <div className="input-group">
      <div className="input-pass-group input-font">
        <input
          type={show ? "text" : "password"} // Alterna entre ver y ocultar contraseña
          onInput={handleLimit}             // Límite manual de caracteres (alternativa rápida a validation)
          className={`custom-input input-login ${className}`}
          {...register}                     // Registro del campo con react-hook-form
          {...props}
        />
        <button
          type="button"
          className="eye-toggle-btn"
          tabIndex={-1}                     // Excluye del tab focus para no interrumpir flujo de formulario
          onClick={() => setShow((v) => !v)} // Toggle entre mostrar/ocultar contraseña
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} // Accesibilidad
        >
          {show ? <FiEyeOff className="eye-icon" /> : <FiEye className="eye-icon" />}
        </button>
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default PasswordInput;
