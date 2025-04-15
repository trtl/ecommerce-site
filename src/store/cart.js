import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),
  getters: {
    totalPrice: (state) => {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  actions: {
    addToCart(item) {
      // Find an existing item that matches both id and size
      const existingItem = this.cart.find(
        cartItem => cartItem.id === item.id && cartItem.size === item.size
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        // Ensure each new item added has a unique reference
        this.cart.push({ ...item });
      }
    },
    updateQuantity(id, quantity) {
      const item = this.cart.find((cartItem) => cartItem.id === id);
      if (item) item.quantity = quantity;
    },
    removeFromCart(id, size) {
      this.cart = this.cart.filter((cartItem) => !(cartItem.id === id && cartItem.size === size));
    },
    clearCart() {
      this.cart = [];
    },
  },
});



