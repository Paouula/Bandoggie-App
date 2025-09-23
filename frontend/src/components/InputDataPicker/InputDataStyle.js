import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { FiCalendar } from 'react-icons/fi';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './InputDataStyle';

const DatePickerInput = ({
  label = 'Selecciona una fecha',
  value,
  onChange,
  onBlur,
  name,
  error,
}) => {
  const [internalValue, setInternalValue] = useState(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value ? new Date(value) : null);
    }
  }, [value]);

  const currentDate =
    value !== undefined ? (value ? new Date(value) : null) : internalValue;

  const displayDate =
    currentDate instanceof Date && !isNaN(currentDate)
      ? format(currentDate, 'dd/MM/yyyy', { locale: es })
      : '';

  const handleChange = (date) => {
    if (onChange) {
      onChange(date);
    } else {
      setInternalValue(date);
    }
    setOpen(false);
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.inputDateGroup}>
        <TextInput
          ref={inputRef}
          style={[
            styles.inputDateTrigger,
            error && { borderColor: 'red' },
          ]}
          value={displayDate}
          readOnly
          placeholder={label}
          onFocus={() => setOpen(true)}
          onBlur={onBlur}
          name={name}
        />
        <TouchableOpacity
          style={styles.calendarToggleBtn}
          onPress={() => setOpen(true)}
        >
          <FiCalendar style={styles.calendarIcon} />
        </TouchableOpacity>
        {open && (
          <View style={{ position: 'absolute', top: 65, left: 0, zIndex: 10 }}>
            <DatePicker
              selected={currentDate}
              onChange={handleChange}
              onClickOutside={() => setOpen(false)}
              inline
              locale={es}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default DatePickerInput;
