const CART_KEY = 'ikigai-cart';
const cartCountElements = document.querySelectorAll('.cart-count');
const addButtons = document.querySelectorAll('.add-cart-btn');
const cartLinkElements = document.querySelectorAll('.cart-button');

function getCart() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach(el => {
    el.textContent = count;
  });
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
}

function buildCartItem(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity || 1
  };
}

if (addButtons.length > 0) {
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const product = buildCartItem({
        id: button.dataset.productId,
        name: button.dataset.productName,
        price: Number(button.dataset.productPrice)
      });
      addToCart(product);
      button.classList.add('added');
      setTimeout(() => {
        button.classList.remove('added');
      }, 1200);
    });
  });
}

if (cartLinkElements.length > 0) {
  cartLinkElements.forEach(link => {
    link.addEventListener('click', () => updateCartCount());
  });
}

updateCartCount();

if (window.location.pathname.includes('checkout.html')) {
  const checkoutRoot = document.getElementById('checkout-root');
  const cart = getCart();

  function renderCheckout() {
    if (!checkoutRoot) return;
    checkoutRoot.innerHTML = '';
    if (cart.length === 0) {
      checkoutRoot.innerHTML = '<div class="empty-cart-message">Your cart is empty. Add items from the shop to see them here.</div>';
      return;
    }

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'checkout-items';

    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'checkout-item';
      itemEl.innerHTML = `
        <div class="checkout-item-details">
          <h3>${item.name}</h3>
          <p>Price: R${item.price}</p>
          <span>Quantity: ${item.quantity}</span>
        </div>
        <div class="checkout-item-actions">
          <span>Subtotal: R${item.price * item.quantity}</span>
          <button class="remove-cart-btn" data-item-id="${item.id}">Remove</button>
        </div>
      `;
      itemsContainer.appendChild(itemEl);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalEl = document.createElement('div');
    totalEl.className = 'checkout-total';
    totalEl.innerHTML = `<span>Total</span><strong>R${total}</strong>`;

    const actions = document.createElement('div');
    actions.className = 'checkout-actions';
    actions.innerHTML = `
      <button class="clear-cart-btn" type="button">Clear cart</button>
      <a class="secondary-button" href="items.html">Continue shopping</a>
    `;

    checkoutRoot.appendChild(itemsContainer);
    checkoutRoot.appendChild(totalEl);
    checkoutRoot.appendChild(actions);

    const removeButtons = checkoutRoot.querySelectorAll('.remove-cart-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        const updated = cart.filter(item => item.id !== id);
        localStorage.setItem(CART_KEY, JSON.stringify(updated));
        location.reload();
      });
    });

    actions.querySelector('.clear-cart-btn').addEventListener('click', () => {
      localStorage.removeItem(CART_KEY);
      location.reload();
    });
  }

  renderCheckout();
}
 const authButtons = document.getElementById('authButtons');

            function renderAuthButtons() {
                const storedUser = localStorage.getItem('ikigaiCurrentUser');

                if (!authButtons) {
                    return;
                }

                if (!storedUser) {
                    authButtons.innerHTML = `
                        <a href="login.html" class="auth-link">Login</a>
                        <a href="login.html?mode=register" class="auth-link secondary">Create account</a>
                    `;
                    return;
                }

                const user = JSON.parse(storedUser);
                authButtons.innerHTML = `
                    <span class="user-chip">Hi, ${user.name || user.email}</span>
                    <button type="button" class="auth-link logout-btn">Logout</button>
                `;

                const logoutButton = authButtons.querySelector('.logout-btn');
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('ikigaiCurrentUser');
                    renderAuthButtons();
                });
            }

            document.addEventListener('DOMContentLoaded', renderAuthButtons);