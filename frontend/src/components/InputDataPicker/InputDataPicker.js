import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import Icon from 'react-native-vector-icons/Feather';

const DatePickerInput = ({
  label = 'Selecciona una fecha',
  value,
  onChange,
  onBlur,
  name,
  error,
}) => {
  const [internalValue, setInternalValue] = useState(null);
  const [show, setShow] = useState(false);

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

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // En iOS queda abierto, en Android se cierra
    const date = selectedDate || currentDate;
    if (onChange) {
      onChange(date);
    } else {
      setInternalValue(date);
    }
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? 'red' : '#ccc',
          borderRadius: 8,
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          value={displayDate}
          placeholder={label}
          editable={false}
          style={{ flex: 1, paddingVertical: 12 }}
          onBlur={onBlur}
        />
        <TouchableOpacity onPress={() => setShow(true)}>
          <Icon name="calendar" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          value={currentDate || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          locale="es-ES"
        />
      )}
    </View>
  );
};

export default DatePickerInput;
