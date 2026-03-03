const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  // New field for professional touch
  suggestion: { type: String, default: "Pairs well with Sparkling Water" } 
});

module.exports = mongoose.model('MenuItem', menuItemSchema);