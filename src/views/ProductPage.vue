<template>
  <div class="product-page-container">
    <div class="background-overlay"></div>
    <div class="container mt-4 content-container">    
      <!-- Filters -->
      <div class="row mb-4 align-items-center">
        <div class="col-md-3">
          <select v-model="selectedCategory" class="form-select" @change="filterProducts">
            <option value="all">All Products</option>
            <option value="cinkuoti">Cinkuoti</option>
            <option value="plieninis">Plieniniai</option>
            <option value="komplektai">Komplektai</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="selectedSize" class="form-select">
            <option value="all">All Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="sortOrder" class="form-select">
            <option value="none">Sort by Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <!-- Products cards -->
      <div class="row">
        <div v-for="product in filteredProducts" :key="product.id" class="col-md-4 mb-3">
          <div class="card p-3 text-center">
            <router-link :to="'/product/' + product.id">
              <img 
                :src="product.assets?.[0] ? `/images/${product.assets[0]}` : '/images/pr1.png'" 
                :alt="product.name" 
                class="img-fluid mb-3 product-image"
                @error="handleImageError" 
              />
            </router-link>
            <h5>{{ product.name }}</h5>
            <p>Starting from: €{{ getLowestPrice(product.sizes) }}</p>
            <div class="mt-2">
              <small class="text-muted">Available sizes: 
                {{ getAvailableSizes(product.sizes) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from '@firebase/firestore';

export default {
  setup() {
    const products = ref([]);
    const selectedCategory = ref('all');
    const selectedSize = ref('all');
    const db = getFirestore();
    const sortOrder = ref('none');

    const filteredProducts = computed(() => {
      let filtered = products.value;
      if (selectedCategory.value !== 'all') {
        filtered = filtered.filter(product => 
          product.category?.toLowerCase() === selectedCategory.value
        );
      }
      if (selectedSize.value !== 'all') {
        filtered = filtered.filter(product => {
          const sizes = product.sizes || {};
          return sizes[selectedSize.value] && sizes[selectedSize.value].stock > 0;
        });
      }
      if (sortOrder.value !== 'none') {
        filtered = [...filtered].sort((a, b) => {
          const priceA = Math.min(...Object.values(a.sizes || {}).map(size => size.price));
          const priceB = Math.min(...Object.values(b.sizes || {}).map(size => size.price));
          return sortOrder.value === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

      return filtered;
    });

    const getLowestPrice = (sizes) => {
      if (!sizes || Object.keys(sizes).length === 0) return '0.00';
      const prices = Object.values(sizes).map(size => size.price);
      return Math.min(...prices).toFixed(2);
    };

    const getAvailableSizes = (sizes) => {
      if (!sizes) return 'None';
      const availableSizes = Object.entries(sizes)
        .filter(([, data]) => data.stock > 0)
        .map(([size]) => size);
      return availableSizes.length ? availableSizes.join(', ') : 'Out of stock';
    };

    const handleImageError = (e) => {
      const fallbackImage = '/images/pr1.png';
      if (e.target.src !== fallbackImage) {
        e.target.src = fallbackImage;
      }
    };

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(product => product.id !== "productId");
        products.value = productsData;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    onMounted(fetchProducts);

    return {
      products,
      selectedCategory,
      filteredProducts,
      selectedSize,
      sortOrder,
      getLowestPrice,
      getAvailableSizes,
      handleImageError
    };
  }
};
</script>

<style scoped>
.product-page-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/fitingiai.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  opacity: 1;
  z-index: -1;
}

.content-container {
  position: relative;
  z-index: 1;
}

.product-image {
  max-height: 150px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.product-image:hover {
  transform: scale(1.05);
}

.card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.form-select {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.form-select:focus {
  border-color: #40E0D0;
  box-shadow: 0 0 0 0.2rem rgba(64, 224, 208, 0.25);
}

.row.align-items-center {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.col-md-3 {
  flex: 0 0 auto;
  min-width: 200px;
  margin-right: 1rem;
}

.form-select {
  width: 100%;
}
</style>