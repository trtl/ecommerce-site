<template>
  <div class="container py-5" v-if="item">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center position-relative">
        <!-- Item Image -->
        <img 
          :src="`/images/${item.assets[0]}` || '/placeholder-image.jpg'" 
          :alt="item.name" 
          class="img-fluid mb-4" 
          @error="handleImageError"
        />
        <button 
          v-if="item.assets?.find(asset => asset.endsWith('.glb'))"
          class="btn btn-secondary position-absolute top-0 end-0 m-2"
          @click="show3DModal = true"
        >
          <i class="fas fa-cube"></i> View 3D
        </button>
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
    <!-- 3D Model Modal -->
    <div v-if="show3DModal" class="modal-overlay" @click.self="show3DModal = false">
      <div class="modal-content">
        <button class="close-button" @click="show3DModal = false">&times;</button>
        <model-viewer
          :src="get3DModelUrl()"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          ar
          ar-modes="webxr scene-viewer quick-look"
          style="width: 100%; height: 500px;"
          ></model-viewer>
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
    const show3DModal = ref(false);

    const get3DModelUrl = () => {
      if (!item.value?.assets) return '';
      const glbFile = item.value.assets.find(asset => asset.endsWith('.glb'));
      return glbFile ? `/models/${glbFile}` : '';
    };

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
      handleImageError,
      show3DModal,
      get3DModelUrl
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  position: relative;
}

.close-button {
  position: absolute;
  right: 10px;
  top: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
}

model-viewer {
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>