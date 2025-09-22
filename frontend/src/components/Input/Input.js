import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

//Componente reutilizable para la introduccion de fechas
const DatePickerInput = ({
  label = 'Selecciona una fecha',
  value,
  onChange,
  name,
  error,
  style = {},
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [internalDate, setInternalDate] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setInternalDate(value ? new Date(value) : null);
    }
  }, [value]);

  const currentDate =
    value !== undefined ? (value ? new Date(value) : null) : internalDate;

  const displayDate =
    currentDate instanceof Date && !isNaN(currentDate)
      ? currentDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    setIsFocused(false);
    if (selectedDate) {
      if (onChange) {
        onChange(selectedDate);
      } else {
        setInternalDate(selectedDate);
      }
    }
  };

  return (
    <View style={[styles.inputDateGroup, style]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputDateTrigger,
          isFocused && styles.inputDateTriggerFocused,
          error && { borderColor: '#ff4d4d' },
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setShowPicker(true);
            setIsFocused(true);
          }}
        >
          <Text style={{ color: '#365A7D' }}>
            {displayDate || 'Selecciona una fecha'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.calendarToggleBtn}
          onPress={() => {
            setShowPicker(true);
            setIsFocused(true);
          }}
        >
          <Icon name="calendar" size={20} color="#365A7D" style={styles.calendarIcon} />
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={currentDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputDateGroup: {
    position: 'relative',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#365A7D',
    fontFamily: 'Raleway',
  },
  inputDateTrigger: {
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: '#b4ceec',
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fafdff',
    color: '#365A7D',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDateTriggerFocused: {
    borderWidth: 2,
    borderColor: '#ff9900',
    backgroundColor: '#fffdfa',
    shadowColor: '#ffe0b2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarToggleBtn: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12.5 }],
    width: 25,
    height: 25,
    backgroundColor: 'transparent',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  calendarToggleBtnHover: {
    backgroundColor: '#b4ceec',
  },
  calendarIcon: {
    width: 22,
    height: 22,
  },
});

export default DatePickerInput;
