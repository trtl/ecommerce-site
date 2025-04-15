<template>
  <div class="d-flex flex-column min-vh-100">
    <SiteHeader />
    <SiteNavbar />

    <main class="flex-grow-1">
      <router-view />
    </main>
    
    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from "./components/SiteHeader.vue";
import SiteNavbar from "./components/SiteNavbar.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { useUserStore } from "@/store/user";

export default {
  name: "App",
  components: {
    SiteHeader,
    SiteNavbar,
    SiteFooter
  },
  setup() {
    const userStore = useUserStore();
    userStore.initializeAuth(); // Initialize authentication state
  },
};
</script>
