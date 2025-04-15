<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-success w-100">Login</button>
    </form>
    <p class="mt-3">Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "@/firebase/firebaseConfig.js";
import { auth } from "@/firebase/firebaseConfig.js"; // Import Firebase authentication
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user"; // Assuming you have a user store to manage user state

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();
    const userStore = useUserStore(); // Assuming you have a user store to manage user state

    const handleLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("User logged in:", userCredential.user);

        // Reinitialize the user store to fetch the new user's data
        await userStore.initializeAuth();

        // Redirect to the intended route or default to /profile
        const redirectTo = router.currentRoute.value.query.redirect || "/profile";
        router.push(redirectTo);
        //router.push("/profile"); // Uncomment this if you have a Dashboard page
      } catch (error) {
        console.error("Error logging in:", error.message);
        errorMessage.value = error.message; // Display error message
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-page {
  width: 300px;
  margin: 0 auto;
}
</style>
