document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos (DOM) ---

    // Preços e Variáveis do Produto
    const unitPrice = 229.90; 
    const originalUnitPrice = 449.90; 
    
    // Elementos de Preço
    const priceDisplay = document.getElementById('dynamic-price'); 
    const originalPriceDisplay = document.getElementById('original-price'); 

    // Páginas
    const pages = {
        product: document.getElementById('product-page'),
        checkout: document.getElementById('checkout-page'),
        tracking: document.getElementById('tracking-page')
    };
    
    // Navegação
    const links = {
        home: document.getElementById('home-link'),
        orders: document.getElementById('track-order-header-link'),
        cart: document.getElementById('cart-link')
    };
    const cartCountBadge = document.getElementById('cart-item-count');

    // Produto
    const quantityInput = document.getElementById('quantity');
    const productBtns = {
        decrease: document.getElementById('decrease-quantity'),
        increase: document.getElementById('increase-quantity'),
        add: document.getElementById('add-to-cart-btn'),
        buy: document.getElementById('buy-now-btn')
    };
    const productMessageBox = document.getElementById('message-box');

    // Carrinho
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalDisplay = document.getElementById('cart-total');
    const emptyCartMsg = document.querySelector('#cart-items-list p'); 
    const proceedCheckoutBtn = document.getElementById('proceed-to-checkout-btn');

    // Checkout
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    const checkoutTotalDisplay = document.getElementById('checkout-total');
    const continuePaymentBtn = document.getElementById('continue-to-payment-btn');
    const backProductBtn = document.getElementById('back-to-product-btn');
    const checkoutMessageBox = document.getElementById('checkout-message-box');

    // Pagamento
    const paymentSection = document.getElementById('payment-methods-section');
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    
    const pixDetails = document.getElementById('pix-details');
    const creditCardDetails = document.getElementById('credit-card-details');
    const boletoDetails = document.getElementById('boleto-details');
    
    const copyPixBtn = document.getElementById('copy-pix-btn');
    const pixKeyInput = document.getElementById('pix-key-input');
    const copyFeedback = document.getElementById('copy-feedback');

    // Botão Final
    const confirmOrderBtn = document.getElementById('confirm-order-btn');

    // Rastreamento
    const trackingList = document.getElementById('tracking-status-list');
    const backTrackingBtn = document.getElementById('back-from-tracking-btn');

    // --- Estado ---
    let cart = [];
    
    const trackingStages = [
        { id: 'prepared', text: 'Pedido recebido', icon: 'fa-box-open' },
        { id: 'posted', text: 'Nota fiscal emitida', icon: 'fa-file-invoice' },
        { id: 'transit', text: 'Em trânsito', icon: 'fa-truck-fast' },
        { id: 'delivery', text: 'Saiu para entrega', icon: 'fa-motorcycle' },
        { id: 'delivered', text: 'Entregue', icon: 'fa-house-circle-check' }
    ];

    // --- Funções Principais ---

    // AQUI ESTÁ A LÓGICA QUE VOCÊ PEDIU:
    // Atualiza Preços (Atual e Riscado) baseado na quantidade
    function updatePriceDisplay() {
        const qty = parseInt(quantityInput.value);

        if (priceDisplay) {
            const total = unitPrice * qty;
            priceDisplay.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        if (originalPriceDisplay) {
            const originalTotal = originalUnitPrice * qty;
            originalPriceDisplay.textContent = originalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }

    function switchPage(pageId) {
        Object.values(pages).forEach(page => page.classList.add('hidden'));
        pages[pageId].classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function updateCartUI() {
        const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCountBadge.textContent = totalQty;
        cartCountBadge.classList.toggle('hidden', totalQty === 0);

        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.appendChild(emptyCartMsg);
            if(emptyCartMsg) emptyCartMsg.classList.remove('hidden'); 
            proceedCheckoutBtn.disabled = true;
            proceedCheckoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            proceedCheckoutBtn.disabled = false;
            proceedCheckoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const div = document.createElement('div');
                div.className = 'flex justify-between items-center py-3 border-b border-gray-100 animate-fade-in';
                div.innerHTML = `
                    <div>
                        <p class="font-medium text-gray-800">${item.name}</p>
                        <p class="text-sm text-gray-500">Qtd: ${item.quantity} x R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-blue-600">R$ ${itemTotal.toFixed(2)}</span>
                        <button onclick="removeCartItem(${index})" class="text-gray-400 hover:text-red-500 transition p-1">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsList.appendChild(div);
            });
        }
        cartTotalDisplay.textContent = `R$ ${total.toFixed(2)}`;
    }

    window.removeCartItem = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    function showFeedback(element, message, type = 'success') {
        element.innerHTML = message;
        element.className = 'mt-4 p-3 rounded-md text-center font-medium animate-fade-in';
        if (type === 'success') element.classList.add('bg-green-100', 'text-green-700');
        else if (type === 'error') element.classList.add('bg-red-100', 'text-red-700');
        element.classList.remove('hidden');
        setTimeout(() => element.classList.add('hidden'), 3000);
    }

    function initCheckout(items) {
        checkoutItemsList.innerHTML = '';
        let total = 0;
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex justify-between text-sm py-1 border-b border-gray-50';
            div.innerHTML = `<span class="text-gray-600">${item.name} (${item.quantity}x)</span> <span class="font-medium">R$ ${(item.price * item.quantity).toFixed(2)}</span>`;
            checkoutItemsList.appendChild(div);
            total += item.price * item.quantity;
        });
        checkoutTotalDisplay.textContent = `R$ ${total.toFixed(2)}`;
        
        paymentSection.classList.add('hidden');
        
        // Reset Pix select
        if(document.querySelector('input[value="pix"]')) {
             document.querySelector('input[value="pix"]').click();
        }

        switchPage('checkout');
    }

    function renderTracking() {
        trackingList.innerHTML = '';
        const currentStageIndex = 2; // Simula "Em Trânsito"

        trackingStages.forEach((stage, index) => {
            const div = document.createElement('div');
            let statusClass = '';
            let iconColor = 'text-gray-400';
            
            if (index < currentStageIndex) {
                statusClass = 'completed';
                iconColor = 'text-green-500';
            } else if (index === currentStageIndex) {
                statusClass = 'active';
                iconColor = 'text-blue-600';
            }

            div.className = `tracking-item ${statusClass} flex gap-4 mb-4 pl-4`;
            div.innerHTML = `
                <div class="flex flex-col">
                    <span class="font-bold text-gray-800 ${index > currentStageIndex ? 'opacity-50' : ''}">${stage.text}</span>
                    <span class="text-xs text-gray-500">${index <= currentStageIndex ? 'Atualizado' : 'Aguardando'}</span>
                </div>
                <div class="ml-auto">
                    <i class="fa-solid ${stage.icon} ${iconColor} text-xl"></i>
                </div>
            `;
            trackingList.appendChild(div);
        });
    }

    // --- Event Listeners ---

    // Quantidade e Preço (CHAMANDO A ATUALIZAÇÃO DOS DOIS PREÇOS)
    productBtns.decrease.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        if (val > 1) {
            quantityInput.value = val - 1;
            updatePriceDisplay(); // Atualiza ambos
        }
    });

    productBtns.increase.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        quantityInput.value = val + 1;
        updatePriceDisplay(); // Atualiza ambos
    });

    // Add Cart
    productBtns.add.addEventListener('click', () => {
        const qty = parseInt(quantityInput.value);
        const exists = cart.find(i => i.name === 'Kit Dioneia Standard');
        if (exists) exists.quantity += qty;
        else cart.push({ name: 'Kit Dioneia Standard', price: unitPrice, quantity: qty });
        
        updateCartUI();
        showFeedback(productMessageBox, '<i class="fa-solid fa-check"></i> Adicionado ao carrinho!', 'success');
    });

    // Buy Direct
    productBtns.buy.addEventListener('click', () => {
        const qty = parseInt(quantityInput.value);
        initCheckout([{ name: 'Kit Dioneia Standard', price: unitPrice, quantity: qty }]);
    });

    // Modal Cart
    links.cart.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.classList.remove('hidden');
    });
    document.getElementById('close-cart-modal').addEventListener('click', () => cartModal.classList.add('hidden'));
    cartModal.addEventListener('click', (e) => {
        if(e.target === cartModal) cartModal.classList.add('hidden');
    });
    proceedCheckoutBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
        initCheckout(cart);
    });

    // Nav
    links.home.addEventListener('click', (e) => { e.preventDefault(); switchPage('product'); });
    links.orders.addEventListener('click', (e) => {
        e.preventDefault();
        renderTracking();
        switchPage('tracking');
    });
    backProductBtn.addEventListener('click', () => switchPage('product'));
    backTrackingBtn.addEventListener('click', () => switchPage('product'));

    // Form Step
    continuePaymentBtn.addEventListener('click', () => {
        const inputs = checkoutForm.querySelectorAll('input');
        let valid = true;
        inputs.forEach(input => {
            if(!input.value) {
                valid = false;
                input.classList.add('border-red-500', 'ring-1', 'ring-red-500');
            } else {
                input.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
            }
        });

        if(valid) {
            paymentSection.classList.remove('hidden');
            paymentSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            showFeedback(checkoutMessageBox, 'Por favor, preencha seu endereço completo.', 'error');
        }
    });

    // Payment Toggle
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const method = e.target.value;
            pixDetails.classList.add('hidden');
            creditCardDetails.classList.add('hidden');
            boletoDetails.classList.add('hidden');

            if (method === 'pix') {
                pixDetails.classList.remove('hidden');
            } else if (method === 'credit-card') {
                creditCardDetails.classList.remove('hidden');
            } else if (method === 'boleto') {
                boletoDetails.classList.remove('hidden');
            }
        });
    });

    // Copy Pix
    if(copyPixBtn) {
        copyPixBtn.addEventListener('click', () => {
            pixKeyInput.select();
            pixKeyInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(pixKeyInput.value).then(() => {
                copyFeedback.classList.remove('hidden');
                setTimeout(() => copyFeedback.classList.add('hidden'), 2000);
            });
        });
    }

    // Confirm Logic with Animation
    confirmOrderBtn.addEventListener('click', () => {
        const methodInput = document.querySelector('input[name="payment-method"]:checked');
        const method = methodInput ? methodInput.value : 'pix';

        if (method === 'credit-card') {
            const cardNum = document.getElementById('card-number').value;
            if(!cardNum) {
                showFeedback(checkoutMessageBox, 'Preencha os dados do cartão.', 'error');
                return;
            }
        }

        const originalContent = confirmOrderBtn.innerHTML;
        confirmOrderBtn.disabled = true;
        confirmOrderBtn.classList.add('btn-loading', 'bg-blue-800');
        confirmOrderBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin-fast text-xl"></i> Processando...`;

        setTimeout(() => {
            confirmOrderBtn.classList.remove('bg-blue-800');
            confirmOrderBtn.classList.add('bg-green-700');
            confirmOrderBtn.innerHTML = `<i class="fa-solid fa-circle-check text-xl"></i> Aprovado!`;
            
            showFeedback(checkoutMessageBox, 'Pedido realizado com sucesso!', 'success');

            setTimeout(() => {
                cart = [];
                updateCartUI();
                renderTracking();
                switchPage('tracking');
                
                setTimeout(() => {
                    confirmOrderBtn.disabled = false;
                    confirmOrderBtn.classList.remove('btn-loading', 'bg-green-700');
                    confirmOrderBtn.innerHTML = originalContent;
                }, 1000);
            }, 1500);

        }, 2500);
    });

    // --- CHATBOT WIDGET LOGIC ---
    const chatWidget = {
        window: document.getElementById('chat-window'),
        toggleBtn: document.getElementById('toggle-chat-btn'),
        closeBtn: document.getElementById('close-chat-btn'),
        messagesArea: document.getElementById('chat-messages'),
        form: document.getElementById('chat-form'),
        input: document.getElementById('chat-input'),
        isOpen: false
    };

    function toggleChat() {
        chatWidget.isOpen = !chatWidget.isOpen;
        if (chatWidget.isOpen) {
            chatWidget.window.classList.remove('hidden');
            setTimeout(() => {
                chatWidget.window.classList.add('chat-open');
                chatWidget.window.classList.remove('scale-95', 'opacity-0');
            }, 10);
            chatWidget.input.focus();
        } else {
            chatWidget.window.classList.remove('chat-open');
            chatWidget.window.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                chatWidget.window.classList.add('hidden');
            }, 300);
        }
    }

    if(chatWidget.toggleBtn) {
        chatWidget.toggleBtn.addEventListener('click', toggleChat);
        chatWidget.closeBtn.addEventListener('click', toggleChat);

        chatWidget.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatWidget.input.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            chatWidget.input.value = '';

            showTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                const botResponse = getBotResponse(text);
                addMessage(botResponse, 'bot');
            }, 1500 + Math.random() * 1000);
        });
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        const isUser = sender === 'user';
        div.className = `flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`;
        div.innerHTML = `
            <div class="${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-100'} p-3 rounded-2xl shadow-sm text-sm max-w-[85%] ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}">
                ${text}
            </div>
        `;
        chatWidget.messagesArea.appendChild(div);
        chatWidget.messagesArea.scrollTop = chatWidget.messagesArea.scrollHeight;
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'flex justify-start animate-fade-in';
        div.innerHTML = `
            <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatWidget.messagesArea.appendChild(div);
        chatWidget.messagesArea.scrollTop = chatWidget.messagesArea.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('preço') || lowerInput.includes('valor') || lowerInput.includes('quanto')) {
            return "O preço promocional é R$ 229,90 (50% OFF). Aproveite que o estoque é limitado!";
        }
        if (lowerInput.includes('frete') || lowerInput.includes('entrega') || lowerInput.includes('chega')) {
            return "O prazo médio é de 3 a 7 dias úteis. Você recebe o código de rastreio por e-mail.";
        }
        if (lowerInput.includes('pix') || lowerInput.includes('pagamento')) {
            return "Aceitamos Pix (aprovação na hora), Cartão e Boleto. Escolha no checkout!";
        }
        if (lowerInput.includes('funciona') || lowerInput.includes('mosquito')) {
            return "A Dioneia usa luz UV para atrair e sucção silenciosa para capturar. Sem veneno e seguro para pets.";
        }
        if (lowerInput.includes('ola') || lowerInput.includes('oi')) {
            return "Olá! Tudo bem? Posso ajudar com sua compra da Dioneia hoje?";
        }
        return "Desculpe, não entendi. Pode perguntar sobre preço, frete ou funcionamento?";
    }

    // Inicializa preço com o valor de 1 unidade
    updatePriceDisplay();
});
