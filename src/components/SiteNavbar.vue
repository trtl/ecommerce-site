<template>
  <nav class="site-nav">
    <div class="container">
      <ul class="nav justify-content-center">
        <li class="nav-item">
          <router-link to="/products" class="nav-link">
            Products
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/contacts" class="nav-link">
            Contact
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.site-nav {
  background-color: #f8f9fa;
  padding: 0.25rem 0;  /* Reduced from 0.5rem */
  height: 40px;        /* Added fixed height */
  display: flex;
  align-items: center;
}

.nav-link {
  color: #333;
  padding: 0.25rem 1.5rem;  /* Reduced top/bottom padding from 0.5rem */
  transition: color 0.2s ease;
  line-height: 1;    /* Added to reduce line height */
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #40E0D0;
}
</style>