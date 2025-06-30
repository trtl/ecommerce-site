import { defineStore } from "pinia";

  export const useCartStore = defineStore("cart", {
    state: () => ({
      cart: [],
      isInitialized: false
    }),

    getters: {
      cartItemCount: (state) => state.cart.length,
      totalPrice: (state) => {
        return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },

    actions: {
      initializeCart() {
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            this.cart = JSON.parse(savedCart);
          }
          this.isInitialized = true;
        } catch (error) {
          console.error('Error initializing cart:', error);
          this.cart = [];
          this.isInitialized = true;
        }
      },

    addToCart(item) {
      const existingItem = this.cart.find(
        cartItem => cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.cart.push({ ...item });
      }
      this.saveCart();
    },

    updateQuantity(id, quantity) {
      const item = this.cart.find((cartItem) => cartItem.id === id);
      if (item) {
        item.quantity = quantity;
        this.saveCart();
      }
    },

    removeFromCart(id, size) {
      this.cart = this.cart.filter((cartItem) => !(cartItem.id === id && cartItem.size === size));
      this.saveCart();
    },

    clearCart() {
      this.cart = [];
      this.saveCart();
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  },
});


