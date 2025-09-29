import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './CartStyle';

const { width } = Dimensions.get('window');

// Componente selector personalizado
const CustomPicker = ({ selectedValue, onValueChange, items, placeholder, style, error }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <>
      <TouchableOpacity
        style={[styles.customPickerButton, style, error && styles.inputError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.customPickerText, !selectedValue && styles.placeholderText]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedValue === item.value && styles.selectedItem
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.modalItemText,
                    selectedValue === item.value && styles.selectedItemText
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentStep, setCurrentStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [loading, setLoading] = useState(true);
  const [guestId, setGuestId] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    departamento: '',
    region: '',
    direccion: '',
    referencia: '',
    telefono: ''
  });

  const [errors, setErrors] = useState({});

  const departamentos = [
    { label: 'Seleccionar departamento', value: '' },
    { label: 'San Salvador', value: 'san-salvador' },
    { label: 'La Libertad', value: 'la-libertad' },
    { label: 'Santa Ana', value: 'santa-ana' },
    { label: 'Sonsonate', value: 'sonsonate' },
    { label: 'Ahuachapán', value: 'ahuachapan' },
  ];

  const regiones = [
    { label: 'Seleccionar región', value: '' },
    { label: 'San Salvador', value: 'san-salvador' },
    { label: 'Mejicanos', value: 'mejicanos' },
    { label: 'Soyapango', value: 'soyapango' },
    { label: 'Ciudad Delgado', value: 'ciudad-delgado' },
  ];

  const generateGuestId = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `guest_${timestamp}_${random}`;
  }, []);

  const loadCartFromStorage = useCallback(async () => {
    try {
      console.log('📄 Cargando carrito desde AsyncStorage...');
      
      const savedCart = await AsyncStorage.getItem('bandoggie_cart');
      console.log('📦 Carrito raw desde AsyncStorage:', savedCart);
      
      if (!savedCart || savedCart === 'undefined' || savedCart === 'null') {
        console.log('⚠️ No hay carrito guardado o está vacío');
        setCartItems([]);
        return;
      }

      const parsedCart = JSON.parse(savedCart);
      console.log('📋 Carrito parseado:', parsedCart);
      
      if (!Array.isArray(parsedCart)) {
        console.log('⚠️ El carrito no es un array válido');
        setCartItems([]);
        return;
      }

      if (parsedCart.length === 0) {
        console.log('🛒 El carrito está vacío');
        setCartItems([]);
        return;
      }

      const normalizedCart = parsedCart.map((item, index) => {
        console.log(`🔄 Normalizando item ${index}:`, item);
        
        const normalizedItem = {
          _id: item._id || item.id || `temp_${Date.now()}_${index}`,
          id: item._id || item.id || `temp_${Date.now()}_${index}`,
          name: item.name || item.nameProduct || 'Producto Sin Nombre',
          nameProduct: item.name || item.nameProduct || 'Producto Sin Nombre',
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
          subtotal: item.subtotal || (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1),
          talla: item.talla || null,
          color: item.color || null,
          petName: item.petName || null,
          image: item.image || (item.productInfo && item.productInfo.image) || null,
          productInfo: item.productInfo || {}
        };
        
        console.log(`✅ Item normalizado ${index}:`, normalizedItem);
        return normalizedItem;
      });
      
      console.log('✅ Carrito final normalizado:', normalizedCart);
      console.log(`📊 Total de items en el carrito: ${normalizedCart.length}`);
      
      setCartItems(normalizedCart);
      
    } catch (error) {
      console.error('❌ Error cargando carrito desde AsyncStorage:', error);
      setCartItems([]);
      Alert.alert('Error', 'Error al cargar el carrito');
    }
  }, []);

  useEffect(() => {
    const initializeCart = async () => {
      console.log('🚀 Inicializando CartScreen...');
      
      try {
        setLoading(true);
        
        if (!guestId) {
          const newGuestId = generateGuestId();
          setGuestId(newGuestId);
          console.log('🆔 Generated guest ID:', newGuestId);
        }

        await loadCartFromStorage();
        
      } catch (error) {
        console.error('❌ Error initializing cart:', error);
        Alert.alert('Error', 'Error al inicializar el carrito');
      } finally {
        setTimeout(() => {
          setLoading(false);
          console.log('✅ CartScreen inicializado');
        }, 500);
      }
    };

    initializeCart();
  }, [guestId, generateGuestId, loadCartFromStorage]);

  // Actualizar carrito cuando la pantalla obtiene foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 CartScreen obtuvo foco, recargando carrito...');
      loadCartFromStorage();
    });

    return unsubscribe;
  }, [navigation, loadCartFromStorage]);

  const saveCartToStorage = useCallback(async (items) => {
    try {
      if (items.length > 0) {
        const cartToSave = JSON.stringify(items);
        await AsyncStorage.setItem('bandoggie_cart', cartToSave);
        console.log('💾 Carrito guardado en AsyncStorage:', cartToSave);
      } else {
        await AsyncStorage.removeItem('bandoggie_cart');
        console.log('🗑️ Carrito limpiado del AsyncStorage');
      }
    } catch (error) {
      console.error('❌ Error saving cart to AsyncStorage:', error);
    }
  }, []);

  // Navegar al detalle del producto
  const navigateToProductDetail = (item) => {
    try {
      const product = {
        _id: item._id || item.id,
        nameProduct: item.nameProduct || item.name,
        price: item.price,
        image: item.image,
        description: item.productInfo?.description || '',
        designImages: item.productInfo?.designImages || [item.image],
        idCategory: item.idCategory || null
      };

      console.log('🔗 Navegando al detalle del producto:', product.nameProduct);
      
      navigation.navigate('ProductDetail', { product });
      
    } catch (error) {
      console.error('❌ Error navegando al detalle:', error);
      Alert.alert('Error', 'No se pudo abrir el detalle del producto');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateRequired = (value) => {
    return value && value.trim().length > 0;
  };

  const validateName = (name) => {
    return name && name.trim().length >= 2;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateCheckoutForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    if (!validateName(formData.nombre)) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validateName(formData.apellido)) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDeliveryForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.departamento)) {
      newErrors.departamento = 'Por favor selecciona un departamento';
    }

    if (!validateRequired(formData.region)) {
      newErrors.region = 'Por favor selecciona una región';
    }

    if (!validateRequired(formData.direccion)) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!validatePhone(formData.telefono)) {
      newErrors.telefono = 'Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const updatedItems = [...cartItems];
      const existingItemIndex = updatedItems.findIndex(item => 
        item._id === product._id && 
        item.talla === product.talla &&
        item.color === product.color &&
        item.petName === product.petName
      );
      
      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].subtotal = 
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      } else {
        const newItem = {
          _id: product._id || `temp_${Date.now()}`,
          id: product._id || `temp_${Date.now()}`,
          name: product.nameProduct || product.name || 'Producto',
          nameProduct: product.nameProduct || product.name || 'Producto',
          price: parseFloat(product.price) || 0,
          quantity: quantity,
          subtotal: (parseFloat(product.price) || 0) * quantity,
          talla: product.talla || null,
          color: product.color || null,
          petName: product.petName || null,
          image: product.image || null,
          productInfo: product.productInfo || {}
        };
        updatedItems.push(newItem);
      }
      
      setCartItems(updatedItems);
      await saveCartToStorage(updatedItems);
      Alert.alert('Éxito', `${product.nameProduct || product.name || 'Producto'} agregado al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Error al agregar al carrito');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedItems = cartItems.filter(item => 
        item._id !== productId && item.id !== productId
      );
      setCartItems(updatedItems);
      await saveCartToStorage(updatedItems);
      Alert.alert('Éxito', 'Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Error al remover del carrito');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const updatedItems = cartItems.map(item => {
        if (item._id === productId || item.id === productId) {
          return {
            ...item,
            quantity: parseInt(quantity),
            subtotal: item.price * parseInt(quantity)
          };
        }
        return item;
      });

      setCartItems(updatedItems);
      await saveCartToStorage(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Error al actualizar cantidad');
    }
  };

  const clearCart = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres vaciar el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, vaciar', 
          onPress: async () => {
            try {
              setCartItems([]);
              await AsyncStorage.removeItem('bandoggie_cart');
              Alert.alert('Éxito', 'Carrito limpiado');
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Error al limpiar carrito');
            }
          }
        }
      ]
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  const addSampleProduct = () => {
    const sampleProduct = {
      _id: `sample_${Date.now()}`,
      nameProduct: `Producto de Ejemplo ${cartItems.length + 1}`,
      price: Math.floor(Math.random() * 50) + 10,
      image: null,
      talla: 'M',
      petName: null,
      productInfo: {}
    };
    addToCart(sampleProduct, 1);
  };

  const sendBankingDetailsEmail = async (orderData) => {
    try {
      console.log('📧 Enviando email bancario para:', orderData.customerInfo.email);
      
      const shortReference = guestId ? guestId.slice(-8).toUpperCase() : `REF${Date.now().toString().slice(-6)}`;
      
      const emailPayload = {
        customerName: `${orderData.customerInfo.nombre} ${orderData.customerInfo.apellido}`,
        email: orderData.customerInfo.email,
        totalAmount: orderData.total,
        orderNumber: shortReference
      };

      console.log('📤 Payload del email:', emailPayload);

      const response = await fetch('https://bandoggie.onrender.com/api/email/send-simple-banking-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: `Error HTTP ${response.status}` };
        }
        
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email enviado exitosamente:', result);

      Alert.alert('Éxito', 'Email con datos bancarios enviado correctamente');
      
      return { 
        success: true, 
        message: 'Email enviado correctamente',
        data: result
      };

    } catch (error) {
      console.error('❌ Error completo:', error);
      
      let errorMessage = 'Error al enviar el email con datos bancarios';
      
      if (error.message.includes('fetch')) {
        errorMessage = 'Error de conexión con el servidor';
      } else if (error.message.includes('401')) {
        errorMessage = 'Error de autenticación';
      } else if (error.message.includes('404')) {
        errorMessage = 'Servicio de email no encontrado';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const processCheckout = async () => {
    try {
      setLoading(true);

      const shipping = 3.50;
      const subtotal = getCartTotal();
      const total = subtotal + shipping;

      const orderData = {
        orderNumber: `GUEST-${guestId}-${Date.now()}`,
        guestId: guestId,
        customerInfo: formData,
        items: cartItems,
        subtotal: subtotal,
        shippingCost: shipping,
        total: total,
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      if (paymentMethod === 'transferencia') {
        try {
          await sendBankingDetailsEmail(orderData);
        } catch (emailError) {
          console.error('Error enviando email:', emailError);
          Alert.alert('Aviso', 'Pedido creado, pero hubo un problema enviando el email. Contacta soporte.');
        }
      }

      setCartItems([]);
      await AsyncStorage.removeItem('bandoggie_cart');
      
      setCurrentStep('confirmation');
      Alert.alert('¡Éxito!', '¡Pedido realizado exitosamente!');

    } catch (error) {
      console.error('Error processing checkout:', error);
      Alert.alert('Error', 'Error al procesar la compra. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    try {
      if (currentStep === 'cart') {
        setCurrentStep('checkout');
      } else if (currentStep === 'checkout') {
        if (validateCheckoutForm()) {
          setCurrentStep('delivery');
        }
      } else if (currentStep === 'delivery') {
        if (validateDeliveryForm()) {
          setCurrentStep('payment');
        }
      } else if (currentStep === 'payment') {
        processCheckout();
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      Alert.alert('Error', 'Error al avanzar al siguiente paso');
    }
  };

  const subtotal = getCartTotal();
  const shipping = 3.50;
  const total = subtotal + shipping;

  if (loading && currentStep !== 'payment') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D2691E" />
          <Text style={styles.loadingText}>Cargando carrito...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.confirmationContainer}>
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            
            <View style={styles.logoContainer}>
              <Text style={styles.pawPrint}>🐾</Text>
              <View style={styles.logoText}>
                <Text style={styles.logoName}>BanDoggie</Text>
                <Text style={styles.logoTagline}>Cuidamos a tu mejor amigo</Text>
              </View>
            </View>

            <Text style={styles.confirmationTitle}>¡Compra realizada exitosamente!</Text>
            
            {paymentMethod === 'transferencia' ? (
              <Text style={styles.confirmationText}>
                Hemos enviado los datos bancarios a tu correo electrónico <Text style={styles.boldText}>{formData.email}</Text>.{'\n\n'}
                Una vez realices la transferencia, nos comunicaremos contigo para coordinar la entrega.{'\n\n'}
                ¡Gracias por confiar en BanDoggie!
              </Text>
            ) : (
              <Text style={styles.confirmationText}>
                Tu pedido ha sido registrado exitosamente.{'\n\n'}
                El pago se realizará en efectivo al momento de la entrega.{'\n\n'}
                Nos comunicaremos contigo pronto para coordinar la entrega.{'\n\n'}
                ¡Gracias por confiar en BanDoggie!
              </Text>
            )}

            {guestId && (
              <View style={styles.referenceContainer}>
                <Text style={styles.referenceText}>
                  <Text style={styles.boldText}>Número de referencia:</Text> {guestId.slice(-8).toUpperCase()}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => {
                setFormData({
                  email: '',
                  nombre: '',
                  apellido: '',
                  departamento: '',
                  region: '',
                  direccion: '',
                  referencia: '',
                  telefono: ''
                });
                setCurrentStep('cart');
                setErrors({});
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.continueButtonText}>Volver al catálogo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentStep === 'cart') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.cartHeader}>
          <Text style={styles.cartHeaderText}>Tu carrito</Text>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>
                Tu carrito está vacío
              </Text>
              
              <TouchableOpacity 
                style={styles.sampleButton}
                onPress={addSampleProduct}
              >
                <Text style={styles.sampleButtonText}>+ Agregar Producto de Ejemplo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.primaryButtonText}>Ir al catálogo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.itemsCountContainer}>
                <Text style={styles.itemsCountText}>
                  ✅ {cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en tu carrito
                </Text>
              </View>
              
              {cartItems.map(item => (
                <View key={item._id || item.id} style={styles.cartItemCard}>
                  <TouchableOpacity 
                    style={styles.cartItemContent}
                    onPress={() => navigateToProductDetail(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.productImageContainer}>
                      {item.image ? (
                        <Image 
                          source={{ uri: item.image }} 
                          style={styles.productImageStyle}
                        />
                      ) : (
                        <View style={styles.productImagePlaceholderContainer}>
                          <Text style={styles.productImagePlaceholder}>📦</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                      {(item.talla || item.color || item.petName) && (
                        <Text style={styles.productSpecs}>
                          {item.talla && `Talla: ${item.talla}`}
                          {item.color && ` | Color: ${item.color}`}
                          {item.petName && ` | Mascota: ${item.petName}`}
                        </Text>
                      )}
                      
                      <View style={styles.quantityAndSubtotal}>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              updateQuantity(item._id || item.id, item.quantity - 1);
                            }}
                            disabled={loading}
                          >
                            <Text style={styles.quantityButtonText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{item.quantity}</Text>
                          <TouchableOpacity 
                            style={styles.quantityButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              updateQuantity(item._id || item.id, item.quantity + 1);
                            }}
                            disabled={loading}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.itemSubtotal}>{formatPrice(item.subtotal)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item._id || item.id)}
                    disabled={loading}
                  >
                    <Text style={styles.removeButtonText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Costo estimado de envío:</Text>
                  <Text style={styles.totalValue}>{formatPrice(shipping)}</Text>
                </View>
                <View style={styles.totalRowMain}>
                  <Text style={styles.totalLabelMain}>TOTAL:</Text>
                  <Text style={styles.totalValueMain}>{formatPrice(total)}</Text>
                </View>
              </View>

              <View style={styles.continueButtonContainer}>
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={nextStep}
                  disabled={loading}
                >
                  <Text style={styles.continueButtonText}>
                    {loading ? 'Procesando...' : 'Continuar compra'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentStep === 'checkout') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.stepHeaderContainer}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepHeaderTitle}>¿Quién hace la compra?</Text>
          </View>

          <View style={styles.checkoutContainer}>
            <View style={styles.guestForm}>
              <Text style={styles.guestTitle}>Ingresa como invitado</Text>
              
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                placeholder="Ingresa tu correo electrónico"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={[styles.textInput, errors.nombre && styles.inputError]}
                placeholder="Ingrese sus nombres"
                value={formData.nombre}
                onChangeText={(text) => handleInputChange('nombre', text)}
                autoCapitalize="words"
              />
              {errors.nombre && <Text style={styles.errorMessage}>{errors.nombre}</Text>}

              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={[styles.textInput, errors.apellido && styles.inputError]}
                placeholder="Ingrese sus apellidos"
                value={formData.apellido}
                onChangeText={(text) => handleInputChange('apellido', text)}
                autoCapitalize="words"
              />
              {errors.apellido && <Text style={styles.errorMessage}>{errors.apellido}</Text>}

              <TouchableOpacity 
                style={styles.continueButton}
                onPress={nextStep}
                disabled={loading}
              >
                <Text style={styles.continueButtonText}>
                  {loading ? 'Procesando...' : 'Continuar'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={() => {
                    Alert.alert('Info', 'Función de login no implementada en este ejemplo');
                  }}
                >
                  <Text style={styles.loginButtonText}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => setCurrentStep('cart')}
          >
            <Text style={styles.backLinkText}>Regresar al carrito</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentStep === 'delivery') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.stepHeaderContainer}>
          <View style={styles.stepNumberCircle}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepHeaderTitle}>¿A dónde enviamos tu orden?</Text>
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.deliveryFormContainer}>
            <Text style={styles.countryLabel}>País</Text>
            <View style={styles.countryValueContainer}>
              <Text style={styles.countryText}>El Salvador</Text>
            </View>

            <View style={styles.selectRowContainer}>
              <View style={styles.selectFieldContainer}>
                <Text style={styles.inputLabel}>Departamento *</Text>
                <CustomPicker
                  selectedValue={formData.departamento}
                  onValueChange={(value) => handleInputChange('departamento', value)}
                  items={departamentos}
                  placeholder="Seleccionar departamento"
                  error={errors.departamento}
                />
                {errors.departamento && <Text style={styles.errorMessage}>{errors.departamento}</Text>}
              </View>
              
              <View style={styles.selectFieldContainer}>
                <Text style={styles.inputLabel}>Región *</Text>
                <CustomPicker
                  selectedValue={formData.region}
                  onValueChange={(value) => handleInputChange('region', value)}
                  items={regiones}
                  placeholder="Seleccionar región"
                  error={errors.region}
                />
                {errors.region && <Text style={styles.errorMessage}>{errors.region}</Text>}
              </View>
            </View>

            <Text style={styles.inputLabel}>Dirección de entrega *</Text>
            <TextInput
              style={[styles.textInputMultiline, errors.direccion && styles.inputError]}
              placeholder="Ingresa tu dirección completa"
              value={formData.direccion}
              onChangeText={(text) => handleInputChange('direccion', text)}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.direccion && <Text style={styles.errorMessage}>{errors.direccion}</Text>}

            <Text style={styles.inputLabel}>Punto de referencia</Text>
            <TextInput
              style={styles.textInputMultiline}
              placeholder="Puntos de referencia cercanos"
              value={formData.referencia}
              onChangeText={(text) => handleInputChange('referencia', text)}
              multiline={true}
              numberOfLines={2}
              textAlignVertical="top"
            />

            <View style={styles.nameRowContainer}>
              <View style={styles.nameFieldContainer}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <TextInput
                  style={[styles.textInput, errors.nombre && styles.inputError]}
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChangeText={(text) => handleInputChange('nombre', text)}
                  autoCapitalize="words"
                />
                {errors.nombre && <Text style={styles.errorMessage}>{errors.nombre}</Text>}
              </View>
              <View style={styles.nameFieldContainer}>
                <Text style={styles.inputLabel}>Apellidos</Text>
                <TextInput
                  style={[styles.textInput, errors.apellido && styles.inputError]}
                  placeholder="Tus apellidos"
                  value={formData.apellido}
                  onChangeText={(text) => handleInputChange('apellido', text)}
                  autoCapitalize="words"
                />
                {errors.apellido && <Text style={styles.errorMessage}>{errors.apellido}</Text>}
              </View>
            </View>

            <Text style={styles.inputLabel}>Teléfono de contacto *</Text>
            <TextInput
              style={[styles.textInput, errors.telefono && styles.inputError]}
              placeholder="Número de teléfono"
              value={formData.telefono}
              onChangeText={(text) => handleInputChange('telefono', text)}
              keyboardType="phone-pad"
            />
            {errors.telefono && <Text style={styles.errorMessage}>{errors.telefono}</Text>}

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                <Text style={styles.noteBold}>NOTA:</Text> Las entregas son realizadas por encomiendas, nos comunicaremos contigo sobre los detalles de tu envío.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={nextStep}
              disabled={loading}
            >
              <Text style={styles.continueButtonText}>
                {loading ? 'Procesando...' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentStep === 'payment') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.stepHeaderContainer}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepHeaderTitle}>Métodos de pago</Text>
          </View>

          <View style={styles.checkoutContainer}>
            <View style={styles.paymentForm}>
              <View style={styles.paymentToggle}>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton,
                    paymentMethod === 'transferencia' && styles.toggleButtonActive
                  ]}
                  onPress={() => setPaymentMethod('transferencia')}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    paymentMethod === 'transferencia' && styles.toggleButtonTextActive
                  ]}>
                    Transferencia
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton,
                    paymentMethod === 'efectivo' && styles.toggleButtonActive
                  ]}
                  onPress={() => setPaymentMethod('efectivo')}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    paymentMethod === 'efectivo' && styles.toggleButtonTextActive
                  ]}>
                    Efectivo
                  </Text>
                </TouchableOpacity>
              </View>

              {paymentMethod === 'transferencia' ? (
                <View style={styles.paymentContent}>
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                  <Text style={styles.confirmationTitle}>Confirmación de pedido</Text>
                  <Text style={styles.confirmationText}>
                    ¿Estás seguro de que deseas continuar con tu compra? Te enviaremos a tu correo los datos para realizar la transferencia. ¿Quieres continuar?
                  </Text>
                  <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={nextStep}
                    disabled={loading}
                  >
                    <Text style={styles.continueButtonText}>
                      {loading ? 'Procesando...' : 'Finalizar compra'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.paymentContent}>
                  <Text style={styles.efectivoText}>
                    ¡Gracias por tu compra! El pago se realizará en efectivo al momento de la entrega de tu producto.
                  </Text>
                  <TouchableOpacity 
                    style={styles.continueButton}
                    onPress={nextStep}
                    disabled={loading}
                  >
                    <Text style={styles.continueButtonText}>
                      {loading ? 'Procesando...' : 'Finalizar compra'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => setCurrentStep('delivery')}
          >
            <Text style={styles.backLinkText}>Regresar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D2691E" />
        <Text style={styles.loadingText}>Cargando carrito...</Text>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;