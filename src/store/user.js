import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoggedIn: false,
    isInitialized: false,
    isLoading: true,
    userInfo: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "", 
    },
  }),
  actions: {
    async initializeAuth() {
      const auth = getAuth();
      const db = getFirestore();

      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            this.isLoggedIn = true;
            this.userInfo.uid = currentUser.uid;
            this.userInfo.email = currentUser.email;

            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              this.userInfo.firstName = userData.firstName || "";
              this.userInfo.lastName = userData.lastName || "";
              this.userInfo.phone = userData.phone || "";
              this.userInfo.role = userData.role || ""; 
            }
          } else {
            this.resetUserState();
          }
          this.isInitialized = true; 
          resolve();
        });
      });
    },

    async login(email, password) {
      const auth = getAuth();
      const db = getFirestore();

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        this.isLoggedIn = true;
        this.userInfo.email = user.email;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.userInfo.firstName = userData.firstName || "";
          this.userInfo.lastName = userData.lastName || "";
          this.userInfo.phone = userData.phone || "";
          this.userInfo.role = userData.role || "";
        }
      } catch (error) {
        console.error("Login error:", error.message);
        throw error;
      }
    },

    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.resetUserState();
      } catch (error) {
        console.error("Logout error:", error.message);
        throw error;
      }
    },

    resetUserState() {
      this.isLoggedIn = false;
      this.isInitialized = false;
      this.isLoading = true;
      this.userInfo = {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "",
      };
    },
  },
});