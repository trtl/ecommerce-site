<template>
  <div class="container py-5" v-if="item">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center">
        <!-- Item Image -->
        <img 
          :src="`/images/${item.assets[0]}` || '/placeholder-image.jpg'" 
          :alt="item.name" 
          class="img-fluid mb-4" 
          @error="handleImageError"
        />
      </div>
      <div class="col-md-6">
        <!-- Item Details -->
        <h1 class="mb-3">{{ item.name }}</h1>
        <p class="mb-4">{{ item.description }}</p>

        <!-- Size and Price Selector -->
        <div class="mb-3">
          <label for="size" class="form-label">Size</label>
          <select v-model="selectedSize" id="size" class="form-control w-50">
            <option value="">Select a size</option>
            <option 
              v-for="(data, size) in item.sizes" 
              :key="size" 
              :value="size"
              :disabled="data.stock <= 0"
              :class="{ 'text-muted': data.stock <= 0 }"
            >
              {{ size }} - €{{ data.price.toFixed(2) }} 
            </option>
          </select>
        </div>

        <!-- Selected Price Display -->
        <h3 class="text-success mb-4" v-if="selectedSize">
          €{{ item.sizes[selectedSize]?.price.toFixed(2) }}
        </h3>

        <!-- Quantity Selector -->
        <div class="mb-3">
          <label for="quantity" class="form-label">Quantity</label>
          <input
            id="quantity"
            type="number"
            class="form-control w-25"
            v-model.number="quantity"
            :max="selectedSize ? item.sizes[selectedSize].stock : 1"
            min="1"
          />
        </div>

        <!-- Add to Cart Button -->
        <button 
          class="btn btn-primary" 
          @click="addToCart"
          :disabled="!selectedSize || !item.sizes[selectedSize]?.stock"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
  <div v-else class="container py-5 text-center">
    <p>Loading...</p>
  </div>
</template>

<script>
import { useCartStore } from "@/store/cart";
import { ref, onMounted } from "vue";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  props: ["id"],
  setup(props) {
    const cartStore = useCartStore();
    const db = getFirestore();
    const item = ref(null);
    const quantity = ref(1);
    const selectedSize = ref("");

    const fetchItem = async () => {
      try {
        const docRef = doc(db, "products", props.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          item.value = {
            id: docSnap.id,
            ...docSnap.data()
          };
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const handleImageError = (e) => {
      e.target.src = '/placeholder-image.jpg';
    };

    const addToCart = () => {
      if (!selectedSize.value) {
        alert("Please select a size before adding to the cart.");
        return;
      }

      const selectedSizeData = item.value.sizes[selectedSize.value];
      if (!selectedSizeData || selectedSizeData.stock < quantity.value) {
        alert("Selected quantity is not available in stock.");
        return;
      }

      cartStore.addToCart({
        id: item.value.id,
        name: item.value.name,
        price: selectedSizeData.price,
        quantity: quantity.value,
        size: selectedSize.value,
        image: item.value.assets?.[0]
      });

      alert(`${quantity.value} ${item.value.name}(s) (Size: ${selectedSize.value}) added to the cart!`);
    };

    onMounted(fetchItem);

    return {
      item,
      quantity,
      selectedSize,
      addToCart,
      handleImageError
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
img {
  max-height: 400px;
  object-fit: cover;
}
option:disabled {
  color: #999;
  font-style: italic;
}
</style>