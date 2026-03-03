import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CartProvider, useCart } from './context/cartContext';
import './App.css';

// --- COMPONENTS ---

// 1. Menu Item Card
const MenuCard = ({ item }) => {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.find(i => i.name === item.name);

  return (
    <div className="menu-card">
      <div className="card-image-box">
        <img src={item.imageUrl} alt={item.name} />
        <span className="category-label">{item.category}</span>
      </div>
      <div className="card-details">
        <div className="top-info">
          <h3>{item.name}</h3>
          <span className="price">₹{item.price}</span>
        </div>
        <div className="card-footer">
          <span className="suggestion-text">💡 {item.suggestion}</span>
          <button 
            className={`add-btn ${inCart ? 'added' : ''}`} 
            onClick={() => addToCart(item)}
          >
            {inCart ? 'ADDED' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Cart Sidebar
const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, totalPrice, updateQuantity } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrder = async () => {
    const orderPayload = {
      items: cartItems,
      totalPrice,
      ...customerData
    };
    
    try {
      await axios.post('http://localhost:5000/api/order', orderPayload);
      setOrderPlaced(true);
      setTimeout(() => {
        setIsCartOpen(false);
        setOrderPlaced(false);
        window.location.reload(); 
      }, 3000);
    } catch (err) {
      alert("Error placing order");
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        
        {!showCheckout ? (
          <>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? <p className="empty-msg">Your cart is empty</p> : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.name} className="cart-item-row">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price}</p>
                      </div>
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.name, 'dec')}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, 'inc')}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <h3>Total: ₹{totalPrice}</h3>
                  <button className="checkout-btn" onClick={() => setShowCheckout(true)}>PROCEED TO CHECKOUT</button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="checkout-form">
            <h2>Checkout</h2>
            {orderPlaced ? (
              <div className="success-msg">
                <h3>🎉 Order Placed Successfully!</h3>
                <p>Thank you for ordering from The Hungry Diary!</p>
              </div>
            ) : (
              <>
                <input type="text" placeholder="Your Name" required onChange={e => setCustomerData({...customerData, name: e.target.value})} />
                <input type="text" placeholder="Phone Number" required onChange={e => setCustomerData({...customerData, phone: e.target.value})} />
                <textarea placeholder="Delivery Address" required onChange={e => setCustomerData({...customerData, address: e.target.value})} />
                <button className="place-order-btn" onClick={handleOrder}>PLACE ORDER</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Main App
function AppContent() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu').then(res => setMenuItems(res.data));
  }, []);

  const categories = ['All', 'Veg Snacks', 'Non-Veg Snacks', 'Veg Main Course', 'Non-Veg Main Course', 'Chinese', 'Rice & Noodles', 'Breads'];
  const filteredItems = menuItems.filter(item => activeCategory === 'All' || item.category === activeCategory);

  return (
    <div className="app">
      {/* Sticky Top Bar */}
      <nav className="top-bar">
        <div className="brand">
          {/* UPDATED NAME */}
          <h1>📖 The Hungry Diary</h1>
        </div>
        <div className="search-bar">
          <input placeholder="Search for dishes..." />
        </div>
        <div className="cart-icon-container" onClick={() => setIsCartOpen(true)}>
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && <span className="badge">{totalItems}</span>}
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="hero-zomato">
        <div className="hero-content">
          {/* UPDATED NAME */}
          <h1>The Hungry Diary</h1>
          <p>Every dish tells a story. Start writing yours today.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-container">
        <div className="filters-bar">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredItems.map(item => <MenuCard key={item._id} item={item} />)}
        </div>
      </div>

      <CartSidebar />
    </div>
  );
}

// Wrapper
function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;