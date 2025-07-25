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

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-200');
                itemElement.innerHTML = `
                    <span class="text-gray-800 text-lg">${item.name} (${item.quantity}x)</span>
                    <span class="text-gray-700 font-semibold">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                `;
                cartItemsList.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
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

        // Reset animation state for confirm order button and hide track button
        confirmOrderBtn.classList.remove('box-state', 'truck-state', 'truck-driving');
        confirmOrderBtn.classList.add('button-state');
        confirmOrderBtn.innerHTML = '<span class="button-text-animation">Finalizar Compra</span><span class="icon-animation box-icon-animation">📦</span><span class="icon-animation truck-icon-animation">🚚</span>';
        animationState = 'button';
        confirmOrderBtn.style.transform = '';
        confirmOrderBtn.style.animation = '';
        confirmOrderBtn.style.display = 'flex'; // Ensure it's visible
        trackOrderBtn.classList.add('hidden'); // Hide track button
    }

    // Navigate back to product page (from checkout or tracking)
    function goToProductPage() {
        checkoutPage.classList.add('hidden');
        trackingPage.classList.add('hidden'); // Ensure tracking page is hidden
        productPage.classList.remove('hidden');
        checkoutForm.reset();
        paymentMethodsSection.classList.add('hidden');
        currentCheckoutItems = [];
        // Reset buttons on checkout page when returning to product page
        confirmOrderBtn.classList.remove('box-state', 'truck-state', 'truck-driving');
        confirmOrderBtn.classList.add('button-state');
        confirmOrderBtn.innerHTML = '<span class="button-text-animation">Finalizar Compra</span><span class="icon-animation box-icon-animation">📦</span><span class="icon-animation truck-icon-animation">🚚</span>';
        animationState = 'button';
        confirmOrderBtn.style.transform = '';
        confirmOrderBtn.style.animation = '';
        confirmOrderBtn.style.display = 'flex'; // Ensure it's visible
        trackOrderBtn.classList.add('hidden'); // Hide track button
    }

    // Function to display specific payment details section
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

    // Function to render tracking status
    function renderTrackingStatus(currentStatusId) {
        trackingStatusList.innerHTML = '';
        trackingStages.forEach(stage => {
            const stageElement = document.createElement('div');
            stageElement.classList.add('tracking-stage');
            if (stage.id === currentStatusId) {
                stageElement.classList.add('active');
            }
            // For demonstration, all previous stages are "completed"
            const currentIndex = trackingStages.findIndex(s => s.id === currentStatusId);
            const stageIndex = trackingStages.findIndex(s => s.id === stage.id);
            if (stageIndex < currentIndex) {
                stageElement.classList.add('completed');
            }

            stageElement.innerHTML = `<span class="icon">${stage.icon}</span> ${stage.text}`;
            trackingStatusList.appendChild(stageElement);
        });
    }

    // Navigate to tracking page
    function goToTrackingPage() {
        checkoutPage.classList.add('hidden');
        productPage.classList.add('hidden');
        trackingPage.classList.remove('hidden');
        renderTrackingStatus('prepared'); // Initial status: Produto sendo preparado
    }


    // Event listener for payment method radio buttons
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            displayPaymentDetails(event.target.value);
        });
    });

    // Handle quantity changes
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

    // Handle "Add to Cart" button click
    addToCartBtn.addEventListener('click', () => {
        const productName = "Ventilador Turbo Max Pro";
        const quantity = parseInt(quantityInput.value);
        const price = 299.99;

        const existingItemIndex = cart.findIndex(item => item.name === productName);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name: productName, price: price, quantity: quantity });
        }

        updateCartCountDisplay();
        showMessage(messageBox, `${quantity}x ${productName} adicionado(s) ao carrinho!`, 'success');
    });

    // Handle "Buy Now" button click
    buyNowBtn.addEventListener('click', () => {
        const productName = "Ventilador Turbo Max Pro";
        const quantity = parseInt(quantityInput.value);
        const price = 299.99;
        const directPurchaseItem = [{ name: productName, price: price, quantity: quantity }];

        showMessage(messageBox, `Redirecionando para o checkout de ${quantity}x ${productName}!`, 'info');
        setTimeout(() => {
            goToCheckout(directPurchaseItem);
        }, 500);
    });

    // Handle "Carrinho" link click to open modal
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCartItems();
        cartModal.classList.remove('hidden');
    });

    // Handle close modal button click
    closeCartModalBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    // Close modal if clicking outside the content
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });

    // Handle "Finalizar Compra" button click in cart modal
    proceedToCheckoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            goToCheckout(cart);
            cart = [];
            updateCartCountDisplay();
        } else {
            showMessage(messageBox, 'Seu carrinho está vazio!', 'error');
        }
    });

    // Handle "Voltar" button click on checkout page
    backToProductBtn.addEventListener('click', () => {
        goToProductPage();
    });

    // Handle "Continuar para Pagamento" button click
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

    // Handle "Finalizar Compra" button click in payment methods section (now with animation)
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

        // Start the animation
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

                            // Hide the confirm order button completely
                            confirmOrderBtn.style.display = 'none';
                            // Show the track order button
                            trackOrderBtn.classList.remove('hidden');

                            // Perform final order confirmation logic
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

                            // No immediate redirect to product page. User can now click "Acompanhar Pedido"
                        }
                    }, { once: true });
                }, 1000);
            }, 1000);
        }
    });

    // Handle "Acompanhar Pedido" button click
    trackOrderBtn.addEventListener('click', () => {
        goToTrackingPage();
    });

    // Handle "Voltar para a Página Inicial" button on tracking page
    backFromTrackingBtn.addEventListener('click', () => {
        goToProductPage();
    });

    // Add event listener for the "Início" link
    homeLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        goToProductPage(); // Call the function to navigate to the product page
    });

    // Add event listener for the new "Acompanhar Pedido" link in the header
    trackOrderHeaderLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        goToTrackingPage(); // Call the function to navigate to the tracking page
    });

    // Initial cart display update
    updateCartCountDisplay();
});