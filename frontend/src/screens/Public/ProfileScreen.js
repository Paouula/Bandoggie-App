import React from 'react';
import 'react-native-gesture-handler';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de perfil superior */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value="Mirian Morales"
              editable={false}
            />

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value="mirianmorales@gmail.com"
              editable={false}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <TextInput
                  style={styles.input}
                  value="24/03/1997"
                  editable={false}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value="7456-9821"
                  editable={false}
                />
              </View>
            </View>

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value="••••••••••••"
              secureTextEntry={true}
              editable={false}
            />

            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar Datos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opciones del menú */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Pedidos')}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Tus pedidos</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Mensajes</Text>
              <View style={styles.notificationBadge}>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Reseñas')}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>Reseñas</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF2FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF9500',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formSection: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  editButton: {
    backgroundColor: '#FF9C46',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  menuSection: {
    gap: 2,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#CCCCCC',
    fontWeight: 'bold',
  },
});