<template>
  <footer class="site-footer">
    <div class="container-fluid px-4">
      <div class="row align-items-center py-2">
        <!-- Nav links -->
        <div class="col-auto">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link to="/about" class="nav-link ps-0">About Us</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/privacy-policy" class="nav-link ps-0">Privacy Policy</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/shipping-returns" class="nav-link ps-0">Shipping & Returns</router-link>
            </li>
          </ul>
        </div>
        <!-- Social links -->
        <div class="col-auto ms-auto">
          <div class="social-links d-flex flex-column align-items-end">
            <a href="https://www.instagram.com/fitingis.lt/" target="_blank" class="nav-link pe-0"><i class="bi bi-instagram"></i></a>
            <a href="https://www.facebook.com/Fitingis.lt/" target="_blank" class="nav-link pe-0"><i class="bi bi-facebook"></i></a>
            <a href="#" target="_blank" class="nav-link pe-0"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #f8f9fa;
  width: 100%;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.nav-link {
  color: #333;
  transition: color 0.2s ease;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

.nav-link:hover {
  color: #40E0D0;
}

.social-links {
  font-size: 1.2rem;
}

.social-links .nav-link {
  padding: 0.15rem 0;
}
</style>