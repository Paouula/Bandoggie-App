import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileCard = ({
  userInfo,
  isEditing,
  onEditToggle,
  onUpdateProfile,
  isLoading,
  isAuthenticated,
}) => {
  const handleSave = async () => {
    const success = await onUpdateProfile(userInfo);
    if (success) {
      onEditToggle();
    }
  };

  const getNameValue = () => {
    switch (userInfo.userType) {
      case 'employee':
        return userInfo.nameEmployees || userInfo.name || '';
      case 'vet':
        return userInfo.nameVet || userInfo.name || '';
      case 'client':
      default:
        return userInfo.name || '';
    }
  };

  const getProfileImage = () => {
    const name = getNameValue() || 'Usuario';
    if (userInfo?.image) {
      return { uri: userInfo.image };
    }
    return {
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200`,
    };
  };

  const getUserTypeLabel = () => {
    switch (userInfo.userType) {
      case 'client':
        return 'Cliente';
      case 'employee':
        return 'Empleado';
      case 'vet':
        return 'Veterinario';
      default:
        return 'Usuario';
    }
  };

  const getUserTypeStyle = () => {
    switch (userInfo.userType) {
      case 'client':
        return styles.badgeClient;
      case 'employee':
        return styles.badgeEmployee;
      case 'vet':
        return styles.badgeVet;
      default:
        return styles.badgeClient;
    }
  };

  if (!isAuthenticated || !userInfo) {
    return (
      <View style={styles.card}>
        <Text style={styles.notAuthText}>No autenticado</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header con imagen y botones */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.imageContainer}>
            <Image source={getProfileImage()} style={styles.profileImage} />
          </View>

          <View style={styles.userInfoSection}>
            <Text style={styles.nameText}>{getNameValue() || 'Sin nombre'}</Text>
            <Text style={styles.emailText}>{userInfo.email || 'Sin email'}</Text>
            <View style={[styles.badge, getUserTypeStyle()]}>
              <Text style={styles.badgeText}>{getUserTypeLabel()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {!isEditing ? (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={onEditToggle}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onEditToggle}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notAuthText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  userInfoHeader: {
    flex: 1,
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  editActions: {
    flexDirection: 'column',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    minWidth: 100,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  badgeContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
  },
  badgeClient: {
    backgroundColor: '#e8f4fd',
    borderColor: '#3498db',
  },
  badgeEmployee: {
    backgroundColor: '#fef5e7',
    borderColor: '#f39c12',
  },
  badgeVet: {
    backgroundColor: '#e8f8f5',
    borderColor: '#2ecc71',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
});

export default ProfileCard;