import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, User, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react-native';

const EmployeeFormModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  employee = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneEmployees: '',
    addressEmployees: '',
    dateOfBirth: '',
    hireDateEmployee: '',
    duiEmployees: '',
    password: '',
  });

  useEffect(() => {
    if (employee) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phoneEmployees: employee.phoneEmployees || '',
        addressEmployees: employee.addressEmployees || '',
        dateOfBirth: formatDateForInput(employee.dateOfBirth) || '',
        hireDateEmployee: formatDateForInput(employee.hireDateEmployee) || '',
        duiEmployees: employee.duiEmployees || '',
        password: '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: '',
        email: '',
        phoneEmployees: '',
        addressEmployees: '',
        dateOfBirth: '',
        hireDateEmployee: today,
        duiEmployees: '',
        password: '',
      });
    }
  }, [employee, visible]);

  const handleSubmit = () => {
    if (!employee) {
      if (!formData.name || !formData.email || !formData.phoneEmployees || !formData.duiEmployees) {
        alert('Por favor complete los campos obligatorios: Nombre, Email, Teléfono y DUI');
        return;
      }
      if (!formData.password) {
        alert('La contraseña es obligatoria para nuevos empleados');
        return;
      }
    }

    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Por favor ingrese un email válido');
        return;
      }
    }

    if (formData.duiEmployees && formData.duiEmployees.trim() !== '') {
      const duiRegex = /^\d{8}-\d$/;
      if (!duiRegex.test(formData.duiEmployees)) {
        alert('Por favor ingrese un DUI válido (formato: 12345678-9)');
        return;
      }
    }

    if (formData.password && (formData.password.length < 8 || formData.password.length > 30)) {
      alert('La contraseña debe tener entre 8 y 30 caracteres');
      return;
    }

    const dataToSubmit = { ...formData };

    if (employee && !formData.password) {
      delete dataToSubmit.password;
    }

    if (dataToSubmit.name) {
      dataToSubmit.name = dataToSubmit.name.trim();
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
      if (!nameRegex.test(dataToSubmit.name)) {
        alert('El nombre solo puede contener letras y espacios');
        return;
      }
    }

    Object.keys(dataToSubmit).forEach(key => {
      if (typeof dataToSubmit[key] === 'string') {
        dataToSubmit[key] = dataToSubmit[key].trim();
      }
      if (dataToSubmit[key] === '' || dataToSubmit[key] === null || dataToSubmit[key] === undefined) {
        delete dataToSubmit[key];
      }
    });

    onSubmit(dataToSubmit);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Nombre Completo {!employee && '*'}</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Escriba aquí..."
                    placeholderTextColor="#aaa"
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Correo Electrónico {!employee && '*'}</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Escriba aquí..."
                    placeholderTextColor="#aaa"
                    value={formData.email}
                    onChangeText={(value) => updateField('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Teléfono {!employee && '*'}</Text>
                <View style={styles.inputContainer}>
                  <Phone size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Escriba aquí..."
                    placeholderTextColor="#aaa"
                    value={formData.phoneEmployees}
                    onChangeText={(value) => updateField('phoneEmployees', value)}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>DUI {!employee && '*'}</Text>
                <View style={styles.inputContainer}>
                  <CreditCard size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Escriba aquí..."
                    placeholderTextColor="#aaa"
                    value={formData.duiEmployees}
                    onChangeText={(value) => updateField('duiEmployees', value)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Dirección</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Escriba aquí..."
                    placeholderTextColor="#aaa"
                    value={formData.addressEmployees}
                    onChangeText={(value) => updateField('addressEmployees', value)}
                    multiline
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Fecha de Nacimiento</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor="#aaa"
                    value={formData.dateOfBirth}
                    onChangeText={(value) => updateField('dateOfBirth', value)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Fecha de Contratación</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor="#aaa"
                    value={formData.hireDateEmployee}
                    onChangeText={(value) => updateField('hireDateEmployee', value)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>
                  {employee ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { paddingLeft: 16 }]}
                    placeholder="Escriba aquí..."
                    placeholderTextColor="#aaa"
                    value={formData.password}
                    onChangeText={(value) => updateField('password', value)}
                    secureTextEntry={true}
                  />
                </View>
                {employee ? (
                  <Text style={styles.helpText}>Dejar vacío para mantener la contraseña actual</Text>
                ) : (
                  <Text style={styles.helpText}>La contraseña debe tener entre 8 y 30 caracteres</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Guardando...' : (employee ? 'Actualizar' : 'Crear')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minHeight: 50,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    paddingLeft: 4,
  },
});

export default EmployeeFormModal;
