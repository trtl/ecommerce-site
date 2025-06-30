<template>
  <div class="page-container">
    <div class="background-overlay"></div>
    <div class="container py-5">
      <div class="content-card signup-container">
        <h2 class="text-center mb-4">Sign Up</h2>
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="mb-3">
            <label for="firstName">First Name</label>
            <input v-model="firstName" type="text" id="firstName" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label for="lastName">Last Name</label>
            <input v-model="lastName" type="text" id="lastName" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label for="phone">Phone</label>
            <input v-model="phone" type="tel" id="phone" class="form-control form-control-sm" />
          </div>
          <div class="mb-3">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" class="form-control form-control-sm" required />
          </div>
          <div class="mb-3">
            <label for="confirmPassword">Confirm Password</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" class="form-control form-control-sm" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign Up</button>
        </form>
        <p class="mt-3 text-center">
          Already have an account? <router-link to="/login">Sign In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { createUserWithEmailAndPassword, auth, db } from "@/firebase/firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const phone = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const handleSignup = async () => {
      if (!firstName.value || !lastName.value) {
        alert("First Name and Last Name are required!");
        return;
      }

      if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
      }

      if (password.value.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value || null,
        });

        console.log("User signed up and data saved to Firestore:", user);
        alert("Signup successful!");
        router.push("/profile");
      } catch (error) {
        console.error("Error signing up:", error.message);
        alert("Error signing up: " + error.message);
        errorMessage.value = error.message;
      }
    };

    return {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      errorMessage,
      handleSignup,
    };
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.signup-form {
  max-width: 300px;
  margin: 0 auto;
}

.form-control {
  height: 38px;
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
</style>