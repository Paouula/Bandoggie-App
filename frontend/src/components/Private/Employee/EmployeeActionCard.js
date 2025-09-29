import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';

const EmployeeActionCard = ({ 
  employee, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-SV', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'N/A') return 'E';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(employee?.name)}
            </Text>
          </View>
          <View style={styles.nameInfo}>
            <Text style={styles.employeeName} numberOfLines={1}>
              {employee?.name || 'Sin nombre'}
            </Text>
            <Text style={styles.employeePosition} numberOfLines={1}>
              Empleado
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(employee)}
            disabled={loading}
          >
            <Pencil size={18} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(employee)}
            disabled={loading}
          >
            <Trash2 size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.column}>
          <View style={styles.infoField}>
            <Text style={styles.label}>NOMBRE:</Text>
            <Text style={styles.value}>{employee?.name || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoField}>
            <Text style={styles.label}>CORREO:</Text>
            <Text style={styles.value} numberOfLines={1}>{employee?.email || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoField}>
            <Text style={styles.label}>TELÉFONO:</Text>
            <Text style={styles.value}>{employee?.phoneEmployees || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoField}>
            <Text style={styles.label}>FECHA NAC.:</Text>
            <Text style={styles.value}>{formatDate(employee?.dateOfBirth)}</Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.infoField}>
            <Text style={styles.label}>DIRECCIÓN:</Text>
            <Text style={styles.value} numberOfLines={2}>{employee?.addressEmployees || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoField}>
            <Text style={styles.label}>CONTRASEÑA:</Text>
            <Text style={styles.value}>••••••••</Text>
          </View>
          
          <View style={styles.infoField}>
            <Text style={styles.label}>TRABAJA DESDE:</Text>
            <Text style={styles.value}>{formatDate(employee?.hireDateEmployee)}</Text>
          </View>
          
          <View style={styles.infoField}>
            <Text style={styles.label}>DUI:</Text>
            <Text style={styles.value}>{employee?.duiEmployees || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  nameInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  employeePosition: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  infoField: {
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '400',
  },
});

export default EmployeeActionCard;