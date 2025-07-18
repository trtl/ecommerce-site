<template>
  <div class="page-container">
    <div class="background-overlay"></div>
    <div class="container py-5" v-if="item">
      <div class="content-card">
        <div class="text-center mb-4">
          <div class="position-relative d-inline-block">
            <img 
              :src="`/images/${item.assets[0]}` || '/placeholder-image.jpg'" 
              :alt="item.name" 
              class="product-image mb-3" 
              @error="handleImageError"
            />
            <button 
              v-if="item.assets?.find(asset => asset.endsWith('.glb'))"
              class="btn btn-light position-absolute bottom-0 end-0 m-2"
              @click="show3DModal = true"
            >
              <i class="bi bi-badge-3d"></i>
            </button>
          </div>
          <h1 class="mb-2">{{ item.name }}</h1>
          <h3 class="text-success mb-4" v-if="selectedSize">
            €{{ item.sizes[selectedSize]?.price.toFixed(2) }}
          </h3>
        </div>
        <!-- Product details -->
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="size" class="form-label">Size</label>
              <select v-model="selectedSize" id="size" class="form-control">
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
            <div class="mb-4">
              <label for="quantity" class="form-label">Quantity</label>
              <input
                id="quantity"
                type="number"
                class="form-control"
                v-model.number="quantity"
                :max="selectedSize ? item.sizes[selectedSize].stock : 1"
                min="1"
              />
            </div>
            <button 
              class="btn btn-primary w-100 mb-4" 
              @click="addToCart"
              :disabled="!selectedSize || !item.sizes[selectedSize]?.stock"
            >Add to Cart</button>
          </div>
        </div>
        <hr class="my-4">
        <div class="product-description">
          <h4 class="mb-3">Description</h4>
          <p>{{ item.description }}</p>
        </div>

        <!-- 3D viewer -->
        <div v-if="show3DModal" class="modal-overlay" @click.self="show3DModal = false">
          <div class="modal-content">
            <button class="close-button" @click="show3DModal = false">&times;</button>
            <div class="model-viewer-container">
              <model-viewer
                :src="get3DModelUrl()"
                auto-rotate
                camera-controls
                shadow-intensity="1"
                ar
                ar-modes="webxr scene-viewer quick-look"
                style="width: 100%; height: 500px;"
              ></model-viewer>
              <div class="qr-code-container desktop-only">
                <QRCode
                  :value="arUrl"
                  :size="80"
                  level="H"
                  render-as="svg"
                />
                <p class="qr-code-text">Scan for AR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/store/cart";
import { ref, onMounted, computed } from "vue";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import QRCode from 'qrcode.vue';

export default {
  components:{
    QRCode
  },
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

    const arUrl = computed(() => {
      if (!item.value?.assets) return '';
      const glbFile = item.value.assets.find(asset => asset.endsWith('.glb'));
      if (!glbFile) return '';
       const modelUrl = `http://192.168.31.22:8080/models/${glbFile}`;
      return `https://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar_only;`;
    });
    

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
      get3DModelUrl,
      arUrl,
    };
  },
};
</script>

<style scoped>

.product-image {
  max-height: 400px;
  object-fit: contain;
  margin: 0 auto;
}

.content-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 2rem;
}

.btn-primary {
  background-color: #40E0D0;
  border-color: #40E0D0;
}

.btn-primary:hover {
  background-color: #3bcdc0;
  border-color: #3bcdc0;
}

.btn-light {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}


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
  padding-bottom: 100px;
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

.model-viewer-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/fitingiai2.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 1;
  z-index: -1;
}

.qr-code-container {
  position: absolute;
  left: 20px;
  bottom: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

}

.qr-code-text {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.modal-content {
  min-height: 600px;
  position: relative;
}

.desktop-only {
  display: none;
}


@media screen and (min-width: 1024px) {
  .desktop-only {
    display: flex;
  }
}
</style>
