require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/restaurantDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// --- MODELS ---

// 1. Menu Model
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
  name: String, description: String, price: Number, category: String, imageUrl: String, suggestion: String
}));

// 2. Order Model (New)
const OrderSchema = new mongoose.Schema({
  items: [{ name: String, price: Number, quantity: Number }],
  totalPrice: Number,
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  status: { type: String, default: "Preparing" },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --- DATA SEED (Same as before) ---
const menuItems = [
  // VEG SNACKS
  { name: "Tandoori Ajwani Aloo", price: 99, category: "Veg Snacks", suggestion: "Served with Mint Chutney", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500" },
  { name: "American Corn Pepper Salt", price: 119, category: "Veg Snacks", suggestion: "Crunchy & Spicy", imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500" },
  { name: "French Fries", price: 149, category: "Veg Snacks", suggestion: "Classic Golden Fries", imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500" },
  { name: "Chilli Paneer Tikka", price: 169, category: "Veg Snacks", suggestion: "Spicy Cottage Cheese", imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500" },
  // NON-VEG SNACKS
  { name: "Chilli Chicken (Dry)", price: 169, category: "Non-Veg Snacks", suggestion: "Spicy & Tangy", imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500" },
  { name: "Chicken Lollipop", price: 169, category: "Non-Veg Snacks", suggestion: "Crispy Wings", imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500" },
  { name: "Chicken Tikka", price: 179, category: "Non-Veg Snacks", suggestion: "Tandoor Classic", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
  { name: "Tandoori Chicken (Half)", price: 299, category: "Non-Veg Snacks", suggestion: "Signature Dish", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
  // MAIN COURSE
  { name: "Paneer Butter Masala", price: 199, category: "Veg Main Course", suggestion: "All Time Favorite", imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500" },
  { name: "Kadhai Paneer", price: 199, category: "Veg Main Course", suggestion: "Bell Peppers & Paneer", imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500" },
  { name: "Murg Tikka Masala", price: 199, category: "Non-Veg Main Course", suggestion: "Rich & Creamy", imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500" },
  { name: "Mutton Roganjosh", price: 249, category: "Non-Veg Main Course", suggestion: "Kashmiri Special", imageUrl: "https://images.unsplash.com/photo-1545247181-516773cae754?w=500" },
  // CHINESE & RICE
  { name: "Chilli Paneer Gravy", price: 169, category: "Chinese", suggestion: "Indo-Chinese", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500" },
  { name: "Chicken Fried Rice", price: 129, category: "Rice & Noodles", suggestion: "Wok Tossed", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500" },
  { name: "Chicken Dum Biryani", price: 149, category: "Rice & Noodles", suggestion: "Authentic Layers", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500" },
  // BREADS
  { name: "Butter Naan", price: 49, category: "Breads", suggestion: "Buttered Goodness", imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500" },
  { name: "Garlic Naan", price: 59, category: "Breads", suggestion: "Garlic Topping", imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500" }
];

const seedDB = async () => {
  if (await MenuItem.countDocuments() === 0) {
      await MenuItem.insertMany(menuItems);
      console.log("Menu Seeded");
  }
};
seedDB();

// --- ROUTES ---

// Get Menu
app.get('/api/menu', async (req, res) => res.json(await MenuItem.find()));

// Place Order (New)
app.post('/api/order', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order Placed Successfully!", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.listen(5000, () => console.log('Server running on 5000'));