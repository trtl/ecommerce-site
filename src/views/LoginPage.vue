<template>
  <div class="page-container">
    <div class="background-overlay"></div>
    <div class="container py-5">
      <div class="content-card login-container">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="mb-3">
            <label>Email</label>
            <input v-model="email" type="email" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input v-model="password" type="password" class="form-control form-control-sm" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign In</button>
        </form>
        <p class="mt-3 text-center">Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { signInWithEmailAndPassword, auth  } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();
    const userStore = useUserStore();

    const handleLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("User logged in:", userCredential.user);

        await userStore.initializeAuth();
        router.push("/profile");

      } catch (error) {
        console.error("Error logging in:", error.message);
        errorMessage.value = error.message;
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

.login-containerstyle scoped> {
  max-width: 400px;
  margin: 0 auto;
}

.btn-primary {
  background-color: #40E0D0;
  border-color: #40E0D0;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  background-color: #40E0D0;
  border-color: #40E0D0;
  opacity: 0.9;
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
  opacity: 1;
  z-index: -1;
}

.login-container {
  max-width: 350px;
  margin: 0 auto;
  padding: 2rem;
}

.login-form {
  max-width: 280px;
  margin: 0 auto;
}

.form-control {
  height: 38px;
}
</style>
