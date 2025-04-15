<template>
  <header class="d-flex justify-content-between align-items-center p-3 bg-light">
    <div><img src="images/logo.png"></div>
    <div class="d-flex align-items-center position-relative">
      <!-- User Dropdown -->
      <div
        class="position-relative me-2"
        @mouseenter="showUserMenu = true"
        @mouseleave="showUserMenu = false"
      >
        <button class="btn btn-outline-dark" @click.prevent="goToProfile">
          👤
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showUserMenu"
          class="position-absolute top-100 end-0 bg-white border rounded shadow-sm mt-1"
          style="z-index: 10; min-width: 140px;"
        >
          <template v-if="userStore.isLoggedIn">
            <button class="dropdown-item text-dark w-100 text-start px-3 py-2" @click="goToProfile">👤 Profile</button>
            <button class="dropdown-item text-dark w-100 text-start px-3 py-2" @click="logout">🚪 Sign Out</button>
          </template>
          <template v-else>
            <router-link class="dropdown-item text-dark w-100 text-start px-3 py-2" to="/login">🔑 Sign In</router-link>
            <router-link class="dropdown-item text-dark w-100 text-start px-3 py-2" to="/signup">📝 Sign Up</router-link>
          </template>
        </div>
      </div>

      <!-- Cart Button -->
      <router-link to="/cart" class="btn btn-outline-dark position-relative">
        🛒
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ cartItemCount }}
        </span>
      </router-link>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user"; // Import the user store
import { useCartStore } from "@/store/cart"; // Import the cart store

export default {
  setup() {
    const router = useRouter();
    const userStore = useUserStore(); // Access the user store
    const cartStore = useCartStore(); // Access the cart store

    const showUserMenu = ref(false);

    // Redirect to profile or login based on user state
    const goToProfile = () => {
      if (userStore.isLoggedIn) {
        router.push("/profile");
      } else {
        router.push("/login");
      }
    };

    // Logout logic
    const logout = async () => {
      try {
        await userStore.logout(); // Call the logout action from the user store
        router.push("/"); // Redirect to the home page after logout
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return {
      cartItemCount: cartStore.cartItemCount,
      userStore,
      showUserMenu,
      goToProfile,
      logout,
    };
  },
};
</script>

<style scoped>
.dropdown-item {
  cursor: pointer;
  font-weight: 500;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>