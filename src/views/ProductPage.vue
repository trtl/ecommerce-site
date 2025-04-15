<template>
  <div class="container mt-4">
    <h1 class="text-center">Product Page</h1>
    <p>Fitingio detales</p>

    <!-- Display Products -->
    <div class="row">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-3">
        <div class="card p-3 text-center">
          <router-link :to="'/product/' + product.id">
            <img 
              :src="product.assets?.[0] ? `/images/${product.assets[0]}` : '/images/placeholder-image.jpg'" 
              alt="Product Image" 
              class="img-fluid mb-3 product-image" 
            />
          </router-link>

          <h5>{{ product.name }}</h5>
          <p>Category: {{ product.category }}</p>
          <!-- Display lowest price from sizes -->
          <p>Starting from: €{{ getLowestPrice(product.sizes) }}</p>
          <!-- Display available sizes -->
          <div class="mt-2">
            <small class="text-muted">Available sizes: 
              {{ getAvailableSizes(product.sizes) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const products = ref([]);
    const db = getFirestore();

    // Get lowest price from sizes object
    const getLowestPrice = (sizes) => {
      if (!sizes || Object.keys(sizes).length === 0) return '0.00';
      const prices = Object.values(sizes).map(size => size.price);
      return Math.min(...prices).toFixed(2);
    };

    // Get available sizes string
    const getAvailableSizes = (sizes) => {
      if (!sizes) return 'None';
      const availableSizes = Object.entries(sizes)
        .filter(([, data]) => data.stock > 0)
        .map(([size]) => size);
      return availableSizes.length ? availableSizes.join(', ') : 'Out of stock';
    };

    // Fetch products from Firestore
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

    // Fetch products when component mounts
    onMounted(fetchProducts);

    return {
      products,
      getLowestPrice,
      getAvailableSizes
    };
  },
};
</script>

<style scoped>
.product-image {
  max-height: 150px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.product-image:hover {
  transform: scale(1.05);
}
</style>
