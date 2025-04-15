<template>
  <div class="signup-page">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignup">
      <div class="mb-3">
        <label for="firstName">First Name</label>
        <input v-model="firstName" type="text" id="firstName" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="lastName">Last Name</label>
        <input v-model="lastName" type="text" id="lastName" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="phone">Phone</label>
        <input v-model="phone" type="tel" id="phone" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="confirmPassword">Confirm Password</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-success w-100">Sign Up</button>
    </form>
    <p class="mt-3">
      Already have an account? <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "@/firebase/firebaseConfig.js";
import { auth, db } from "@/firebase/firebaseConfig.js"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
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
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Save user info to Firestore
        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value || null, // Optional phone field
        });

        console.log("User signed up and data saved to Firestore:", user);
        alert("Signup successful!");
        router.push("/profile"); // Redirect to Profile Page after successful signup
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
.signup-page {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.signup-page form {
  display: flex;
  flex-direction: column;
}

.signup-page .mb-3 {
  margin-bottom: 1rem;
}

.signup-page h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>