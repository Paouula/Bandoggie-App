import React, { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import DatePickerComponent from "./DatePicker";
import "./InputDataPicker.css";

const DatePickerInput = ({
  label = "Selecciona una fecha",
  value,
  onChange,
  onBlur,
  name,
  error,
  className = "",     
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(null);

  // Si llega una nueva fecha desde fuera, la convertimos en objeto Date y la almacenamos localmente
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value ? new Date(value) : null);
    }
  }, [value]);

  // Define cuál será la fecha actual: si hay prop externa, se usa; si no, se toma la interna
  const currentDate =
    value !== undefined
      ? (value ? new Date(value) : null)
      : internalValue;

  // Convierte la fecha a un string legible en formato español si es válida
  const displayDate =
    currentDate instanceof Date && !isNaN(currentDate)
      ? currentDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  // Maneja el cambio de fecha desde el DatePicker, propagándolo si hay handler externo
  const handleChange = (date) => {
    if (onChange) {
      onChange(date); // control externo (por ejemplo react-hook-form)
    } else {
      setInternalValue(date); // lo maneja internamente si no se controla desde fuera
    }
    setOpen(false); // cierra el calendario luego de elegir fecha
  };

  return (
    <div className={`input-group ${className}`}>
      <div className="input-date-group">
        <input
          type="text"
          className={`input-date-trigger ${error ? "input-error" : ""}`}
          value={displayDate}
          readOnly
          onClick={() => setOpen(true)}
          placeholder={label}
          onBlur={onBlur}
          name={name}
        />

        <button
          type="button"
          className="calendar-toggle-btn"
          onClick={() => setOpen(true)}
        >
          <FiCalendar className="calendar-icon" />
        </button>

        <DatePickerComponent
          value={currentDate}
          onChange={handleChange}
          open={open}
          onClose={() => setOpen(false)}
          label={label}
        />
      </div>
    </div>
  );
};

export default DatePickerInput;
