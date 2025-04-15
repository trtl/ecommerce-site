<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Your Cart</h1>
  
      <div v-if="cart.length > 0">
        <div v-for="item in cart" :key="item.id" class="card mb-3 p-3">
          <div class="d-flex justify-content-between align-items-center">
            <img :src="item.image" alt="Item Image" class="cart-img" />
            <div>
              <h5>{{ item.name }}</h5>
              <p>Price: €{{ item.price.toFixed(2) }}</p>
              <p>Size: {{ item.size }}</p>
              <div class="d-flex align-items-center">
                <label class="me-2">Quantity:</label>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="form-control w-25"
                  @change="updateQuantity(item.id, item.quantity)"
                />
              </div>
            </div>
            <button class="btn btn-danger" @click="removeFromCart(item.id, item.size)">Remove</button>
          </div>
        </div>
  
        <h3 class="text-end mt-4">Total: €{{ totalPrice.toFixed(2) }}</h3>
        <router-link to="/checkout" class="btn btn-success w-100 mt-3">Proceed to Checkout</router-link>
      </div>
  
      <div v-else>
        <p class="text-center">Your cart is empty.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useCartStore } from "@/store/cart";
  import { storeToRefs } from "pinia";
  
  export default {
    setup() {
      const cartStore = useCartStore();
      const { cart, totalPrice } = storeToRefs(cartStore); // Ensure reactivity

  
      return {
        cart,
        totalPrice,
        updateQuantity: cartStore.updateQuantity,
        removeFromCart: cartStore.removeFromCart,
      };
    },
  };
  </script>
  
  <style scoped>
  .cart-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
  </style>
  