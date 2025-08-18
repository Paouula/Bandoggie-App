import React, { useRef, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";

//Este componente es un selector de fecha personalizado que utiliza MUI y date-fns para manejar la selección de fechas.

const DatePickerComponent = ({
  value,
  onChange,
  label = "Fecha",
  open,
  onClose,
}) => {
  // Se utiliza useRef para manejar el enfoque del input de fecha
  // y useEffect para asegurarse de que el input se enfoque cuando el selector esté abierto
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    // Se utiliza LocalizationProvider para establecer el adaptador de fecha y la localización
    // El DatePicker se configura con las propiedades necesarias para manejar la selección de fecha
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <DatePicker
        label={label}
        value={value}
        onChange={(d) => {
          onChange(d);
          onClose();
        }}
        // Se utiliza el inputRef para manejar el enfoque del input de fecha
        /*Tambien se elimina el textfield que trae por defecto MUI para personalizar el estilo y asi al darle 
        al Input no se sobreponga el que ya tiene */
        open={open}
        onClose={onClose}
        slotProps={{
          textField: {
            inputRef,
            sx: {
              position: "absolute",
              width: 0,
              height: 0,
              padding: 0,
              margin: 0,
              border: 0,
              visibility: "hidden",
            },
          },
          // Se configura el popper para que se posicione correctamente en la pantalla
          // y se asegure de que el zIndex sea alto para que no se superponga con otros elementos
          popper: {
            disablePortal: true,
            sx: {
              position: "fixed !important",
              top: "50% !important",
              left: "50% !important",
              transform: "translate(-50%, -50%) !important",
              zIndex: 1500,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
