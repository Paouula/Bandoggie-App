import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // === ESTILOS BÁSICOS ===
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },

  // === CARRITO - PANTALLA 1 ===
  cartHeader: {
    backgroundColor: '#D2691E',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cartHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyCartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  itemsCountContainer: {
    backgroundColor: '#e8f5e8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemsCountText: {
    color: '#2d5a2d',
    fontSize: 14,
    fontWeight: '500',
  },

  // Items del carrito
  cartItemCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cartItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productImagePlaceholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4169E1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImagePlaceholder: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D2691E',
    marginBottom: 4,
  },
  productSpecs: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  quantityAndSubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    color: '#333',
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 18,
  },

  // Sección de totales
  totalSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D2691E',
  },
  totalRowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabelMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValueMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D2691E',
  },
  continueButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // === SELECTOR PERSONALIZADO ===
  customPickerButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customPickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '85%',
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#666',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },

  // === HEADERS DE PASOS ===
  stepHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepNumberCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#D2691E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D2691E',
    flex: 1,
  },

  // === FORMULARIO DE ENTREGA ===
  deliveryFormContainer: {
    backgroundColor: '#e3f2fd',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  countryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  countryValueContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
  selectRowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  selectFieldContainer: {
    flex: 1,
  },
  nameRowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  nameFieldContainer: {
    flex: 1,
  },

  // === INPUTS Y FORMULARIOS ===
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  textInputMultiline: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    minHeight: 80,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },

  // === NOTAS Y AVISOS ===
  noteContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  noteBold: {
    fontWeight: 'bold',
  },

  // === BOTONES ===
  continueButton: {
    backgroundColor: '#4a90a4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#6c757d',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: 16,
  },
  sampleButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  sampleButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#dc3545',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#dc3545',
    fontWeight: '500',
    fontSize: 14,
  },
  backLink: {
    padding: 16,
    alignItems: 'center',
  },
  backLinkText: {
    color: '#4a90a4',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  // === CHECKOUT ===
  checkoutContainer: {
    padding: 16,
  },
  guestForm: {
    backgroundColor: '#e3f2fd',
    padding: 24,
    borderRadius: 12,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginPromptText: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#ffc1cc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  loginButtonText: {
    color: '#333',
    fontWeight: '500',
  },

  // === PAGO ===
  paymentForm: {
    flex: 1,
  },
  paymentToggle: {
    flexDirection: 'row',
    backgroundColor: '#4a90a4',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
  },
  toggleButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  toggleButtonTextActive: {
    color: '#4a90a4',
  },
  paymentContent: {
    backgroundColor: '#e3f2fd',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },

  // === CONFIRMACIÓN ===
  confirmationContainer: {
    backgroundColor: '#e3f2fd',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pawPrint: {
    fontSize: 50,
    marginBottom: 15,
  },
  logoText: {
    alignItems: 'center',
  },
  logoName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  logoTagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkmarkText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: 300,
  },
  efectivoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: 300,
  },
  boldText: {
    fontWeight: 'bold',
  },
  referenceContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  referenceText: {
    fontSize: 14,
    color: '#666',
  },

  // === ESTILOS ADICIONALES ===
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Contenedores de botones
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  extraButtons: {
    gap: 8,
  },

  // Headers alternativos (para compatibilidad)
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#D2691E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#D2691E',
    flex: 1,
  },

  // Elementos de confirmación mejorados
  checkmarkContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#22c55e',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 6,
    borderColor: '#dcfce7',
  }
});