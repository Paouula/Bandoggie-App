import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import useFetchUser from '../../hooks/Profile/useFetchProfileCard';
import { styles } from './ProfileScreen.styles.js';

const ProfileScreen = ({ navigation }) => {
  const { user, loadingUser, logout: authLogout, updateUserData: updateAuthUserData } = useAuth();
  
  const {
    userInfo,
    isLoading: profileLoading,
    updateUserData: updateProfileServer,
    fetchUserData,
  } = useFetchUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({});

  // Usar primero los datos del servidor (userInfo), luego del contexto (user)
  const displayUserInfo = (userInfo && userInfo._id) ? userInfo : user;
  const currentRole = displayUserInfo?.userType || user?.userType || 'client';

  // Configuración de menú según el rol
  const menuConfig = {
    client: [
      { id: 1, icon: 'basket-outline', text: 'Tus pedidos', badge: null, route: 'Pedidos' },
      { id: 2, icon: 'star-outline', text: 'Reseñas', badge: null, route: 'Reseñas' },
    ],
    employee: [
      { id: 1, icon: 'basket-outline', text: 'Gestión de Pedidos', badge: 8, route: null },
      { id: 2, icon: 'people-outline', text: 'Clientes', badge: null, route: null },
      { id: 3, icon: 'bar-chart-outline', text: 'Análisis', badge: null, route: null },
      { id: 4, icon: 'settings-outline', text: 'Configuración', badge: null, route: null },
    ],
    vet: [
      { id: 1, icon: 'medical-outline', text: 'Consultas', badge: 5, route: null },
      { id: 2, icon: 'star-outline', text: 'Reseñas', badge: null, route: null },
      { id: 3, icon: 'shield-checkmark-outline', text: 'Certificaciones', badge: null, route: null },
    ],
  };

  // Verificar autenticación y redirigir si es necesario
  useEffect(() => {
    if (!loadingUser && !user) {
      navigation.replace('Login');
    }
  }, [loadingUser, user, navigation]);

  // Inicializar editedUserInfo con datos disponibles
  useEffect(() => {
    if (displayUserInfo) {
      setEditedUserInfo(displayUserInfo);
    }
  }, [displayUserInfo]);

  // Sincronizar cuando cambie userInfo del servidor
  useEffect(() => {
    if (userInfo && userInfo._id) {
      setEditedUserInfo(userInfo);
    }
  }, [userInfo]);

  const handleMenuClick = (item) => {
    if (item.route) {
      navigation.navigate(item.route);
    } else {
      Alert.alert('Próximamente', `${item.text} - Función próximamente disponible`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await authLogout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Si cancela, restaurar los datos originales
      setEditedUserInfo(displayUserInfo);
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field, value) => {
    setEditedUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Guardar perfil en el servidor
   * Usa AMBAS funciones: del contexto y del hook para asegurar sincronización
   */
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // 1. Guardar en el servidor usando el hook useFetchUser
      const serverSuccess = await updateProfileServer(editedUserInfo);
      
      if (serverSuccess) {
        // 2. Actualizar el contexto con los datos del servidor
        await updateAuthUserData(editedUserInfo);
        
        // 3. Refrescar datos del servidor para asegurar sincronización
        await fetchUserData();
        
        setIsEditing(false);
        
        Alert.alert('Éxito', 'Perfil actualizado correctamente en el servidor');
      } else {
        Alert.alert(
          'Error', 
          'No se pudo actualizar el perfil en el servidor. Por favor, intenta nuevamente.'
        );
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert(
        'Error', 
        'Ocurrió un error al actualizar el perfil. Verifica tu conexión a internet.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'No especificada';
    }
  };

  const getWelcomeMessage = () => {
    const name = getNameValue();
    const roleMessages = {
      client: `¡Hola${name ? `, ${name}` : ''}! Bienvenido a tu perfil`,
      employee: `¡Hola${name ? `, ${name}` : ''}! Panel de empleado`,
      vet: `¡Hola${name ? `, Dr. ${name}` : ''}! Panel veterinario`,
    };
    return roleMessages[currentRole] || `¡Hola${name ? `, ${name}` : ''}!`;
  };

  const getRoleLabel = () => {
    const roles = { client: 'Cliente', employee: 'Empleado', vet: 'Veterinario' };
    return roles[currentRole] || 'Usuario';
  };

  const getNameValue = () => {
    switch (currentRole) {
      case "employee":
        return editedUserInfo.nameEmployees || editedUserInfo.name || '';
      case "vet":
        return editedUserInfo.nameVet || editedUserInfo.name || '';
      case "client":
      default:
        return editedUserInfo.name || '';
    }
  };

  const getPhoneValue = () => {
    return currentRole === "employee"
      ? editedUserInfo.phoneEmployees || ''
      : editedUserInfo.phone || '';
  };

  const getAddressValue = () => {
    return currentRole === "employee"
      ? editedUserInfo.addressEmployees || ''
      : editedUserInfo.address || '';
  };

  const handleNameChange = (value) => {
    const updates = { name: value };
    if (currentRole === "employee") {
      updates.nameEmployees = value;
    } else if (currentRole === "vet") {
      updates.nameVet = value;
    }
    setEditedUserInfo((prev) => ({ ...prev, ...updates }));
  };

  const handlePhoneChange = (value) => {
    const field = currentRole === "employee" ? "phoneEmployees" : "phone";
    setEditedUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (value) => {
    const field = currentRole === "employee" ? "addressEmployees" : "address";
    setEditedUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const getProfileImage = () => {
    const name = getNameValue() || 'Usuario';
    if (editedUserInfo?.image) {
      return { uri: editedUserInfo.image };
    }
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF9C46&color=fff&size=200` 
    };
  };

  // Mostrar loading solo si realmente está cargando y no hay datos disponibles
  if (loadingUser && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9C46" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Overlay de carga mientras se guarda en el servidor */}
      {isSaving && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FF9C46" />
            <Text style={styles.loadingText}>Guardando en el servidor...</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Mensaje de bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
        </View>

        {/* Tarjeta de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={getProfileImage()}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.formSection}>
            {/* Botones de editar/guardar */}
            {!isEditing ? (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={handleEditToggle}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.editButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.editButton, styles.cancelButton]} 
                  onPress={handleEditToggle}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]} 
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.editButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Campos del formulario */}
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={[styles.input, isEditing && styles.inputEditable]}
              value={getNameValue()}
              onChangeText={handleNameChange}
              editable={isEditing}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, isEditing && styles.inputEditable]}
              value={editedUserInfo.email || ''}
              onChangeText={(value) => handleFieldChange('email', value)}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#999"
            />

            {/* Campos específicos por rol */}
            {currentRole === 'client' && (
              <>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Fecha de nacimiento</Text>
                    <TextInput
                      style={styles.input}
                      value={formatDate(editedUserInfo.birthday)}
                      editable={false}
                    />
                  </View>

                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                      style={[styles.input, isEditing && styles.inputEditable]}
                      value={getPhoneValue()}
                      onChangeText={handlePhoneChange}
                      editable={isEditing}
                      keyboardType="phone-pad"
                      placeholder="1234-5678"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={[styles.input, styles.textArea, isEditing && styles.inputEditable]}
                  value={getAddressValue()}
                  onChangeText={handleAddressChange}
                  editable={isEditing}
                  multiline={true}
                  numberOfLines={2}
                  placeholder="Ingresa tu dirección"
                  placeholderTextColor="#999"
                />
              </>
            )}

            {currentRole === 'employee' && (
              <>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Fecha de nacimiento</Text>
                    <TextInput
                      style={styles.input}
                      value={formatDate(editedUserInfo.dateOfBirth)}
                      editable={false}
                    />
                  </View>

                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                      style={[styles.input, isEditing && styles.inputEditable]}
                      value={getPhoneValue()}
                      onChangeText={handlePhoneChange}
                      editable={isEditing}
                      keyboardType="phone-pad"
                      placeholder="1234-5678"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={[styles.input, styles.textArea, isEditing && styles.inputEditable]}
                  value={getAddressValue()}
                  onChangeText={handleAddressChange}
                  editable={isEditing}
                  multiline={true}
                  numberOfLines={2}
                  placeholder="Ingresa tu dirección"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Fecha de Contratación</Text>
                <TextInput
                  style={styles.input}
                  value={formatDate(editedUserInfo.hireDateEmployee)}
                  editable={false}
                />

                <Text style={styles.label}>DUI</Text>
                <TextInput
                  style={[styles.input, isEditing && styles.inputEditable]}
                  value={editedUserInfo.duiEmployees || ''}
                  onChangeText={(value) => handleFieldChange('duiEmployees', value)}
                  editable={isEditing}
                  placeholder="12345678-9"
                  placeholderTextColor="#999"
                />
              </>
            )}

            {currentRole === 'vet' && (
              <>
                <Text style={styles.label}>Ubicación de Consultorio</Text>
                <TextInput
                  style={[styles.input, isEditing && styles.inputEditable]}
                  value={editedUserInfo.locationVet || ''}
                  onChangeText={(value) => handleFieldChange('locationVet', value)}
                  editable={isEditing}
                  placeholder="Ubicación del consultorio"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>NIT</Text>
                <TextInput
                  style={[styles.input, isEditing && styles.inputEditable]}
                  value={editedUserInfo.nitVet || ''}
                  onChangeText={(value) => handleFieldChange('nitVet', value)}
                  editable={isEditing}
                  placeholder="1234-567890-123-4"
                  placeholderTextColor="#999"
                />
              </>
            )}

            {!isEditing && (
              <>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  value="••••••••••••"
                  secureTextEntry={true}
                  editable={false}
                />
              </>
            )}
          </View>
        </View>

        {/* Tipo de cuenta */}
        <View style={styles.accountTypeCard}>
          <Text style={styles.accountTypeLabel}>Tipo de cuenta</Text>
          <View style={styles.accountTypeValueContainer}>
            <Ionicons 
              name={currentRole === 'client' ? 'person' : currentRole === 'employee' ? 'briefcase' : 'medical'} 
              size={20} 
              color="#FF9C46" 
            />
            <Text style={styles.accountTypeValue}>{getRoleLabel()}</Text>
          </View>
        </View>

        {/* Opciones del menú */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Opciones</Text>
          <View style={styles.menuList}>
            {menuConfig[currentRole]?.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuClick(item)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={24} color="#FF9C46" />
                  <Text style={styles.menuItemText}>{item.text}</Text>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutButton]}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color="#FF4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </View>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#FF4444" />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#FF4444" />
          )}
        </TouchableOpacity>

        {/* Información adicional */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>ID: {editedUserInfo?._id || editedUserInfo?.id || user?.id || 'N/A'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;