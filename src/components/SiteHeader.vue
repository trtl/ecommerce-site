<template>
  <div class="site-header py-2">
    <div class="container-fluid px-4"> <!-- Changed to container-fluid for full width -->
      <div class="row align-items-center">
        <!-- Logo (Left Side) -->
        <div class="col-auto ms-0"> <!-- Added ms-0 to remove left margin -->
          <router-link to="/" class="text-decoration-none">
            <img src="/images/logo.png" alt="Logo" class="site-header__logo">
          </router-link>
        </div>

        <!-- User Actions (Right Side) -->
        <div class="col-auto ms-auto"> <!-- Added ms-auto to push to right -->
          <div class="d-flex align-items-center">
            <!-- Language Toggle -->
            <button 
              class="btn btn-link text-decoration-none p-2"
              @click="toggleLanguage"
            >
              {{ currentLanguage }}
            </button>

            <!-- User Menu -->
            <div class="header-action-btn">
              <button 
                class="btn btn-link text-decoration-none p-2"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person fs-5"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <template v-if="userStore.isLoggedIn">
                  <li>
                    <router-link class="dropdown-item" to="/profile">
                      <i class="bi bi-person-circle me-2"></i>Profile
                    </router-link>
                  </li>
                  <li>
                    <button class="dropdown-item" @click="logout">
                      <i class="bi bi-box-arrow-right me-2"></i>Sign Out
                    </button>
                  </li>
                </template>
                <template v-else>
                  <li>
                    <router-link class="dropdown-item" to="/login">
                      <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" to="/signup">
                      <i class="bi bi-person-plus me-2"></i>Sign Up
                    </router-link>
                  </li>
                </template>
              </ul>
            </div>

            <!-- Cart -->
            <div class="header-action-btn">
              <button 
                class="btn btn-link text-decoration-none p-2 position-relative"
                type="button"
                id="cartMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-cart fs-5"></i>
                <span 
                  v-if="cartItemCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {{ cartItemCount }}
                </span>
              </button>
              <div class="dropdown-menu dropdown-menu-end cart-dropdown" aria-labelledby="cartMenu">
                <div v-if="cart.length > 0">
                  <div class="cart-dropdown-item" v-for="item in cart" :key="item.id">
                    <div class="d-flex align-items-center gap-2">
                      <img 
                        :src="item.image ? `/images/${item.image}` : '/images/placeholder.jpg'" 
                        alt="Product" 
                        class="rounded"
                        style="width: 50px; height: 50px; object-fit: cover;"
                      >
                      <div class="flex-grow-1">
                        <div class="text-truncate-2">{{ item.name }}</div>
                        <small>{{ item.size }} | Qty: {{ item.quantity }}</small>
                      </div>
                      <div class="text-end">
                        <div>€{{ (item.price * item.quantity).toFixed(2) }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="border-top mt-3 pt-3">
                    <div class="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong>€{{ totalPrice.toFixed(2) }}</strong>
                    </div>
                    <router-link 
                      to="/cart" 
                      class="btn btn-primary w-100"
                    >
                      Go to Cart
                    </router-link>
                  </div>
                </div>
                <div v-else class="text-center py-3">
                  Your cart is empty
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { useCartStore } from "@/store/cart";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const cartStore = useCartStore();
    const searchQuery = ref("");
    const currentLanguage = ref("LT");

    const { cart, cartItemCount, totalPrice } = storeToRefs(cartStore);

    const toggleLanguage = () => {
      currentLanguage.value = currentLanguage.value === "LT" ? "EN" : "LT";
    };

    const logout = async () => {
      try {
        await userStore.logout();
        router.push("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return {
      searchQuery,
      userStore,
      cart,
      cartItemCount,
      totalPrice,
      currentLanguage,
      toggleLanguage,
      logout
    };
  }
};
</script>

<style scoped>
.site-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.site-header__logo {
  height: 40px;
  width: auto;
}

/* Updated button styles for consistent spacing */
.btn-link {
  color: #333;
  transition: color 0.2s ease;
  padding: 0.5rem !important;
  margin: 0 0.25rem;
}

.btn-link:hover {
  color: #40E0D0; /* Changed to turquoise color */
}

/* Remove margin from the last button */
.header-action-btn:last-child .btn-link {
  margin-right: 0;
}

/* Ensure consistent spacing between action buttons */
.header-action-btn {
  display: inline-flex;
  align-items: center;
}

/* Style dropdown items hover state */
.dropdown-item:hover {
  color: #40E0D0;
  background-color: #f8f9fa;
}
</style>