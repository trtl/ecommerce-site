<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Sticky Header -->
    <header class="sticky-top shadow-sm bg-white">
      <SiteHeader />
      <SiteNavbar />
    </header>

    <!-- Main Content -->
    <main>
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
    userStore.initializeAuth();
  },
};
</script>

<style>
.sticky-top {
  z-index: 1020;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

</style>