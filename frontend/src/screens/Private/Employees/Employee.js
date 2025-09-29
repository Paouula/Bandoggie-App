import React, { useState, useEffect } from 'react';
import { 
    View, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Text,
    Image,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import employeeService from '../../../hooks/Employees/useFetchEmployees';

import EmployeeFormModal from '../../../components/Private/Employee/EmployeeFormModal';
import EmployeeActionCard from '../../../components/Private/Employee/EmployeeActionCard';
import DeleteConfirmationModal from '../../../components/Private/Employee/DeleteConfirmationModal';
import FloatingAddButton from '../../../components/Private/Employee/FloatingAddButton';
import SearchBar from '../../../components/Private/Clients/SearchBar';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getEmployees();
            
            // Verificar si los datos son un array o necesitan ser extraídos
            if (Array.isArray(data)) {
                setEmployees(data);
            } else if (data && Array.isArray(data.data)) {
                setEmployees(data.data);
            } else if (data && Array.isArray(data.employees)) {
                setEmployees(data.employees);
            } else {
                console.error('Formato de datos no reconocido:', data);
                setEmployees([]);
            }
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            Alert.alert('Error', 'No se pudieron cargar los empleados');
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEmployees();
        setRefreshing(false);
    };

    const handleCreateEmployee = async (employeeData) => {
        try {
            setSubmitting(true);
            console.log('Creando empleado con datos:', employeeData);
            const result = await employeeService.createEmployee(employeeData);
            console.log('Empleado creado:', result);
            Alert.alert('Éxito', 'Empleado creado correctamente');
            await loadEmployees();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error al crear empleado:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'No se pudo crear el empleado';
            Alert.alert('Error', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateEmployee = async (employeeData) => {
        try {
            setSubmitting(true);
            const id = selectedEmployee._id || selectedEmployee.id;
            console.log('Actualizando empleado ID:', id);
            console.log('Datos a enviar:', employeeData);
            
            const result = await employeeService.updateEmployee(id, employeeData);
            console.log('Empleado actualizado:', result);
            
            Alert.alert('Éxito', 'Empleado actualizado correctamente');
            await loadEmployees();
            setIsModalVisible(false);
            setSelectedEmployee(null);
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            console.error('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'No se pudo actualizar el empleado';
            Alert.alert('Error', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            setSubmitting(true);
            const id = selectedEmployee._id || selectedEmployee.id;
            await employeeService.deleteEmployee(id);
            Alert.alert('Éxito', 'Empleado eliminado correctamente');
            await loadEmployees();
            setIsDeleteModalVisible(false);
            setSelectedEmployee(null);
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'No se pudo eliminar el empleado';
            Alert.alert('Error', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (employee) => {
        console.log('Editando empleado:', employee);
        setSelectedEmployee(employee);
        setIsModalVisible(true);
    };

    const handleDelete = (employee) => {
        setSelectedEmployee(employee);
        setIsDeleteModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsModalVisible(true);
    };

    // Filtrado seguro
    const filteredEmployees = employees.filter(employee => {
        if (!employee) return false;
        
        const searchLower = searchText.toLowerCase();
        const name = employee.name?.toLowerCase() || '';
        const email = employee.email?.toLowerCase() || '';
        const phone = employee.phoneEmployees || '';
        const username = employee.username?.toLowerCase() || '';
        
        return name.includes(searchLower) || 
               email.includes(searchLower) || 
               phone.includes(searchText) ||
               username.includes(searchLower);
    });

    const renderEmployee = ({ item }) => (
        <EmployeeActionCard
            employee={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
            loading={submitting}
        />
    );

    if (loading && employees.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando empleados...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.titleSection}>
                <LinearGradient
                    colors={['#DFEFF6', '#E8E9F9', '#F6EDFE']}
                    style={styles.titleGradientBackground}
                >
                    <Text style={styles.title}>Empleados</Text>
                    
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBackground}>
                            <Image
                                source={require('../../../../assets/Employee/EmployeeHeader.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <View style={styles.searchSection}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    handleAgregarProducto={handleAdd}
                />
            </View>

            <FlatList
                data={filteredEmployees}
                renderItem={renderEmployee}
                keyExtractor={(item, index) => 
                    item?.id?.toString() || item?._id?.toString() || `employee-${index}`
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchText 
                                ? 'No se encontraron empleados con ese criterio'
                                : 'No hay empleados registrados'
                            }
                        </Text>
                        {!searchText && (
                            <Text style={styles.emptySubtext}>
                                Toca el botón + para agregar uno
                            </Text>
                        )}
                    </View>
                }
            />

            <FloatingAddButton onPress={handleAdd} />

            <EmployeeFormModal
                visible={isModalVisible}
                employee={selectedEmployee}
                onClose={() => {
                    setIsModalVisible(false);
                    setSelectedEmployee(null);
                }}
                onSubmit={selectedEmployee ? handleUpdateEmployee : handleCreateEmployee}
                loading={submitting}
            />

            <DeleteConfirmationModal
                visible={isDeleteModalVisible}
                employeeName={selectedEmployee?.name || 'este empleado'}
                onDelete={handleDeleteConfirm}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                    setSelectedEmployee(null);
                }}
                loading={submitting}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    titleSection: {
        marginBottom: 0,
    },
    titleGradientBackground: {
        paddingTop: 20,
        paddingBottom: 80,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    logoContainer: {
        position: 'absolute',
        right: 20,
        bottom: -40,
    },
    logoBackground: {
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    logoImage: {
        width: 60,
        height: 60,
    },
    searchSection: {
        paddingHorizontal: 20,
        marginTop: 60,
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 80,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default Employee;