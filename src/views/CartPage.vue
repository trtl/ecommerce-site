<template>
  <div class="cart-page-container">
    <div class="background-overlay"></div>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Your Cart</h1>
  
      <div v-if="cart.length > 0">
        <div v-for="item in cart" :key="item.id" class="card mb-3 p-3">
          <div class="d-flex justify-content-between align-items-center">
            <img 
              :src="getImageUrl(item.image)" 
              :alt="item.name" 
              class="cart-img"
              @error="handleImageError"
            />
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
  
        <div class="card p-3 mt-4">
          <h3 class="text-end mb-0">Total: €{{ totalPrice.toFixed(2) }}</h3>
        </div>
        <router-link to="/checkout" class="btn btn-success w-100 mt-3">Proceed to Checkout</router-link>
      </div>
  
      <div v-else class="card p-5 text-center">
        <p class="mb-0">Your cart is empty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/store/cart";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const cartStore = useCartStore();
    const { cart, totalPrice } = storeToRefs(cartStore);

    const getImageUrl = (path) => {
      if (!path) return '/images/placeholder-image.jpg';
      return path.startsWith('http') ? path : `/images/${path}`;
    };

    const handleImageError = (e) => {
      e.target.src = '/images/placeholder-image.jpg';
    };

    return {
      cart,
      totalPrice,
      updateQuantity: cartStore.updateQuantity,
      removeFromCart: cartStore.removeFromCart,
      getImageUrl,
      handleImageError
    };
  },
};
</script>

<style scoped>
.cart-page-container {
  position: relative;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/fitingiai2.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.2;
  z-index: -1;
}

.card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.cart-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-success {
  background-color: #40E0D0;
  border-color: #40E0D0;
}

.btn-success:hover {
  background-color: #3bcdc0;
  border-color: #3bcdc0;
}

.btn-danger {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-danger:hover {
  background-color: #ff5252;
  border-color: #ff5252;
}
</style>