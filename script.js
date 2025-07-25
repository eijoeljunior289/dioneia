document.addEventListener('DOMContentLoaded', () => {
    const productPage = document.getElementById('product-page');
    const checkoutPage = document.getElementById('checkout-page');
    const trackingPage = document.getElementById('tracking-page');
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const messageBox = document.getElementById('message-box');
    const cartItemCount = document.getElementById('cart-item-count');
    const cartLink = document.getElementById('cart-link');
    const homeLink = document.getElementById('home-link');
    const trackOrderHeaderLink = document.getElementById('track-order-header-link');
    const cartModal = document.getElementById('cart-modal');
    const closeCartModalBtn = document.getElementById('close-cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
    const backToProductBtn = document.getElementById('back-to-product-btn');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');
    const continueToPaymentBtn = document.getElementById('continue-to-payment-btn');
    const paymentMethodsSection = document.getElementById('payment-methods-section');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const pixDetails = document.getElementById('pix-details');
    const creditCardDetails = document.getElementById('credit-card-details');
    const boletoDetails = document.getElementById('boleto-details');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const trackOrderBtn = document.getElementById('track-order-btn');
    const checkoutMessageBox = document.getElementById('checkout-message-box');
    const boletoValueElement = document.getElementById('boleto-value');
    const trackingStatusList = document.getElementById('tracking-status-list');
    const backFromTrackingBtn = document.getElementById('back-from-tracking-btn');

    let cart = [];
    let currentCheckoutItems = [];
    let animationState = 'button'; 
    const trackingStages = [
        { id: 'prepared', text: 'Produto sendo preparado', icon: '📦' },
        { id: 'posted', text: 'Postado', icon: '📮' },
        { id: 'on-the-way', text: 'A caminho', icon: '🚚' },
        { id: 'delivered', text: 'Em direção ao destinatário', icon: '🏠' }
    ];

   
    function updateCartCountDisplay() {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalItems;
        if (totalItems > 0) {
            cartItemCount.classList.remove('hidden');
        } else {
            cartItemCount.classList.add('hidden');
        }
    }

    
    function renderCartItems() {
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            proceedToCheckoutBtn.disabled = true;
            proceedToCheckoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            emptyCartMessage.classList.add('hidden');
            proceedToCheckoutBtn.disabled = false;
            proceedToCheckoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-200');
                itemElement.innerHTML = `
                    <span class="text-gray-800 text-lg">${item.name} (${item.quantity}x)</span>
                    <span class="text-gray-700 font-semibold">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-button" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                            <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                        <span class="tooltiptext">remove</span>
                    </button>
                `;
                cartItemsList.appendChild(itemElement);
                total += item.price * item.quantity;
            });

            // Add event listeners to newly created remove buttons
            cartItemsList.querySelectorAll('.remove-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const indexToRemove = parseInt(e.currentTarget.dataset.index);
                    removeItemFromCart(indexToRemove);
                });
            });
        }
        cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
    }

    function removeItemFromCart(index) {
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            renderCartItems();
            updateCartCountDisplay();
            showMessage(messageBox, 'Produto removido do carrinho!', 'info');
        }
    }
  
    function renderCheckoutSummary(itemsToDisplay) {
        checkoutItemsList.innerHTML = '';
        let total = 0;

        if (itemsToDisplay.length === 0) {
            checkoutItemsList.innerHTML = '<p class="text-gray-600">Nenhum item para finalizar a compra.</p>';
        } else {
            itemsToDisplay.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-1');
                itemElement.innerHTML = `
                    <span class="text-gray-700">${item.name} (${item.quantity}x)</span>
                    <span class="text-gray-700 font-medium">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutItemsList.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        checkoutTotalElement.textContent = `R$ ${total.toFixed(2)}`;
        boletoValueElement.textContent = `R$ ${total.toFixed(2)}`;
    }

  
    function showMessage(boxElement, message, type = 'success') {
        boxElement.textContent = message;
        boxElement.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700', 'bg-red-100', 'text-red-700');
        if (type === 'success') {
            boxElement.classList.add('bg-green-100', 'text-green-700');
        } else if (type === 'info') {
            boxElement.classList.add('bg-blue-100', 'text-blue-700');
        } else if (type === 'error') {
            boxElement.classList.add('bg-red-100', 'text-red-700');
        }
        setTimeout(() => {
            boxElement.classList.add('hidden');
        }, 3000);
    }

    
    function goToCheckout(itemsForCheckout) {
        productPage.classList.add('hidden');
        cartModal.classList.add('hidden');
        trackingPage.classList.add('hidden'); 
        checkoutPage.classList.remove('hidden');
        paymentMethodsSection.classList.add('hidden');
        currentCheckoutItems = itemsForCheckout;
        renderCheckoutSummary(currentCheckoutItems);
        displayPaymentDetails('pix');
        document.querySelector('input[name="payment-method"][value="pix"]').checked = true;

       
        confirmOrderBtn.classList.remove('box-state', 'truck-state', 'truck-driving');
        confirmOrderBtn.classList.add('button-state');
        confirmOrderBtn.innerHTML = '<span class="button-text-animation">Finalizar Compra</span><span class="icon-animation box-icon-animation">📦</span><span class="icon-animation truck-icon-animation">🚚</span>';
        animationState = 'button';
        confirmOrderBtn.style.transform = '';
        confirmOrderBtn.style.animation = '';
        confirmOrderBtn.style.display = 'flex'; 
        trackOrderBtn.classList.add('hidden'); 
    }

    
    function goToProductPage() {
        checkoutPage.classList.add('hidden');
        trackingPage.classList.add('hidden'); 
        productPage.classList.remove('hidden');
        checkoutForm.reset();
        paymentMethodsSection.classList.add('hidden');
        currentCheckoutItems = [];
        
        confirmOrderBtn.classList.remove('box-state', 'truck-state', 'truck-driving');
        confirmOrderBtn.classList.add('button-state');
        confirmOrderBtn.innerHTML = '<span class="button-text-animation">Finalizar Compra</span><span class="icon-animation box-icon-animation">📦</span><span class="icon-animation truck-icon-animation">🚚</span>';
        animationState = 'button';
        confirmOrderBtn.style.transform = '';
        confirmOrderBtn.style.animation = '';
        confirmOrderBtn.style.display = 'flex';
    }

    
    function displayPaymentDetails(method) {
        pixDetails.classList.add('hidden');
        creditCardDetails.classList.add('hidden');
        boletoDetails.classList.add('hidden');

        if (method === 'pix') {
            pixDetails.classList.remove('hidden');
        } else if (method === 'credit-card') {
            creditCardDetails.classList.remove('hidden');
        } else if (method === 'bank-slip') {
            boletoDetails.classList.remove('hidden');
        }
    }

    
    function renderTrackingStatus(currentStatusId) {
        trackingStatusList.innerHTML = '';
        trackingStages.forEach(stage => {
            const stageElement = document.createElement('div');
            stageElement.classList.add('tracking-stage');
            if (stage.id === currentStatusId) {
                stageElement.classList.add('active');
            }
            
            const currentIndex = trackingStages.findIndex(s => s.id === currentStatusId);
            const stageIndex = trackingStages.findIndex(s => s.id === stage.id);
            if (stageIndex < currentIndex) {
                stageElement.classList.add('completed');
            }

            stageElement.innerHTML = `<span class="icon">${stage.icon}</span> ${stage.text}`;
            trackingStatusList.appendChild(stageElement);
        });
    }

    
    function goToTrackingPage() {
        checkoutPage.classList.add('hidden');
        productPage.classList.add('hidden');
        trackingPage.classList.remove('hidden');
        renderTrackingStatus('prepared'); 
    }


    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            displayPaymentDetails(event.target.value);
        });
    });


    decreaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    
    addToCartBtn.addEventListener('click', () => {
        const productName = "Ventilador Turbo Max Pro";
        const quantity = parseInt(quantityInput.value);
        const price = 229.90; 

        const existingItemIndex = cart.findIndex(item => item.name === productName);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name: productName, price: price, quantity: quantity });
        }

        updateCartCountDisplay();
        showMessage(messageBox, `${quantity}x ${productName} adicionado(s) ao carrinho!`, 'success');
    });

    buyNowBtn.addEventListener('click', () => {
        const productName = "Ventilador Turbo Max Pro";
        const quantity = parseInt(quantityInput.value);
        const price = 229.90; 
        const directPurchaseItem = [{ name: productName, price: price, quantity: quantity }];

        showMessage(messageBox, `Redirecionando para o checkout de ${quantity}x ${productName}!`, 'info');
        setTimeout(() => {
            goToCheckout(directPurchaseItem);
        }, 500);
    });

    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCartItems();
        cartModal.classList.remove('hidden');
    });

    closeCartModalBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

   
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });

    proceedToCheckoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            goToCheckout(cart);
            cart = []; 
            updateCartCountDisplay();
        } else {
            showMessage(messageBox, 'Seu carrinho está vazio!', 'error');
        }
    });

    
    backToProductBtn.addEventListener('click', () => {
        goToProductPage();
    });

    
    continueToPaymentBtn.addEventListener('click', () => {
        const formFields = checkoutForm.querySelectorAll('input[required]');
        let allFieldsFilled = true;
        formFields.forEach(field => {
            if (!field.value.trim()) {
                allFieldsFilled = false;
                field.focus();
                showMessage(checkoutMessageBox, 'Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
        });

        if (allFieldsFilled) {
            paymentMethodsSection.classList.remove('hidden');
            paymentMethodsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    confirmOrderBtn.addEventListener('click', () => {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (selectedPaymentMethod === 'credit-card') {
            const cardNumber = document.getElementById('card-number').value.trim();
            const cardName = document.getElementById('card-name').value.trim();
            const expiryDate = document.getElementById('expiry-date').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                showMessage(checkoutMessageBox, 'Por favor, preencha todos os dados do cartão.', 'error');
                return;
            }
        }

        
        if (animationState === 'button') {
            confirmOrderBtn.classList.remove('button-state');
            confirmOrderBtn.classList.add('box-state');
            confirmOrderBtn.innerHTML = '<span class="icon-animation box-icon-animation">📦</span>';
            animationState = 'box';

            setTimeout(() => {
                confirmOrderBtn.classList.remove('box-state');
                confirmOrderBtn.classList.add('truck-state');
                confirmOrderBtn.innerHTML = `
                    <div class="truck-body">
                        <span>🚚</span>
                        <div class="truck-wheels">
                            <div class="wheel"></div>
                            <div class="wheel"></div>
                        </div>
                    </div>
                `;
                animationState = 'truck';

                setTimeout(() => {
                    confirmOrderBtn.classList.add('truck-driving');
                    confirmOrderBtn.addEventListener('animationend', function handler(event) {
                        if (event.animationName === 'driveTruck') {
                            confirmOrderBtn.removeEventListener('animationend', handler);

                            
                            confirmOrderBtn.style.display = 'none';
                           
                            trackOrderBtn.classList.remove('hidden');

                            
                            const fullName = document.getElementById('full-name').value;
                            const email = document.getElementById('email').value;
                            const address = document.getElementById('address').value;
                            const city = document.getElementById('city').value;
                            const state = document.getElementById('state').value;
                            const zipCode = document.getElementById('zip-code').value;

                            console.log('Dados do Pedido:', {
                                items: currentCheckoutItems,
                                total: checkoutTotalElement.textContent,
                                customer: { fullName, email, address, city, state, zipCode },
                                paymentMethod: selectedPaymentMethod
                            });

                            showMessage(checkoutMessageBox, `Pedido realizado com sucesso!`, 'success');

                           
                        }
                    }, { once: true });
                }, 1000);
            }, 1000);
        }
    });

    trackOrderBtn.addEventListener('click', () => {
        goToTrackingPage();
    });

    
    backFromTrackingBtn.addEventListener('click', () => {
        goToProductPage();
    });

    
    homeLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        goToProductPage(); 
    });

    trackOrderHeaderLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        goToTrackingPage(); 
    });

    
    updateCartCountDisplay();
});
