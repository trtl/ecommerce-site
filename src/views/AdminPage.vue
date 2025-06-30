<template>
   <div class="page-container">
    <div class="background-overlay"></div>
    <div class="container py-5">
      <div class="content-card mb-4">
        <h1 class="text-center mb-4">Admin Dashboard</h1>
        
        <!-- Updated Navigation -->
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a :class="{'nav-link': true, active: activeTab === 'products'}" 
               @click="setActiveTab('products')">
              <i class="bi bi-box me-2"></i>Products
            </a>
          </li>
          <li class="nav-item">
            <a :class="{'nav-link': true, active: activeTab === 'orders'}"
               @click="setActiveTab('orders')">
              <i class="bi bi-cart me-2"></i>Orders
            </a>
          </li>
          <li class="nav-item">
            <a :class="{'nav-link': true, active: activeTab === 'projects'}"
               @click="setActiveTab('projects')">
              <i class="bi bi-folder me-2"></i>Projects
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Products tab -->
    <div v-if="activeTab === 'products'" class="content-card">
      <form @submit.prevent="addProduct" class="mb-4">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" v-model="newProduct.name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea v-model="newProduct.description" class="form-control" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Category</label>
          <select v-model="newProduct.category" class="form-control" required>
            <option value="">Select Category</option>
            <option value="cinkuoti">Cinkuoti</option>
            <option value="plieniniai">Plieniniai</option>
            <option value="komplektai">Komplektai</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Sizes, Stock and Prices</label>
          <div class="d-flex gap-2 mb-2">
            <input 
              type="text" 
              v-model="newSize" 
              placeholder="Size" 
              class="form-control" 
            />
            <input 
              type="number" 
              v-model="newSizeStock" 
              placeholder="Stock" 
              class="form-control" 
            />
            <input 
              type="number" 
              v-model="newSizePrice" 
              placeholder="Price" 
              class="form-control" 
              step="0.01" 
            />
            <button type="button" @click="addSize" class="btn btn-secondary">Add</button>
          </div>
          <div v-if="Object.keys(newProduct.sizes).length > 0" class="mt-2">
            <h6>Added Sizes:</h6>
            <ul class="list-unstyled">
              <li v-for="(data, size) in newProduct.sizes" :key="size" class="mb-1">
                <span class="badge bg-secondary me-2">{{ size }}</span>
                Stock: {{ data.stock }} | Price: €{{ data.price.toFixed(2) }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Images</label>
          <input type="file" @change="handleFileSelection($event, 'images')" multiple class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">3D Models</label>
          <input type="file" @change="handleFileSelection($event, 'models')" multiple class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Add Product</button>
      </form>

      <ul class="list-group">
        <li v-for="product in products" :key="product.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h5>{{ product.name }}</h5>
            <p>{{ product.description }}</p>
            <p>Category: {{ product.category }}</p>
            
            <!-- Updated size, stock, and price display -->
            <div v-if="Object.keys(product.sizes || {}).length > 0">
              <h6>Sizes, Stock, and Prices:</h6>
              <ul class="list-unstyled">
                <li v-for="(data, size) in product.sizes" :key="size" class="mb-1">
                  <span class="badge bg-secondary me-2">{{ size }}</span>
                  Stock: {{ data.stock }} | Price: €{{ data.price.toFixed(2) }}
                </li>
              </ul>
            </div>
            <div v-if="product.assets?.length">
              <h6>Assets:</h6>
              <ul>
                <li v-for="(asset, index) in product.assets" :key="index">
                  <a :href="asset" target="_blank">{{ asset }}</a>
                </li>
              </ul>
            </div>
          </div>
          <button class="btn btn-danger btn-sm" @click="deleteProduct(product.id)">Delete</button>
        </li>
      </ul>
    </div>
    <!-- Orders tab -->
    <div v-if="activeTab === 'orders'" class="content-card">
      <ul class="list-group">
        <li
          v-for="order in orders"
          :key="order.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <h5>Order #{{ order.id }}</h5>
            <p>Status: 
              <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)">
                <option value="waiting for payment">Waiting for Payment</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </p>
            <p>Total: €{{ order.total.toFixed(2) }}</p>
            <p>Date:{{ new Date('2025-06-09').toLocaleDateString() }}</p>
            <ul class="list-unstyled">
              <li v-for="item in order.items" :key="item.productId" class="mb-2">
                <span class="fw-bold">{{ productNames[item.productId] || 'Loading...' }}</span>
                <span class="text-muted"> - Quantity: {{ item.quantity }}</span>
              </li>
            </ul>
          </div>
          <button class="btn btn-danger btn-sm" @click="deleteOrder(order.id)">Delete</button>
        </li>
      </ul>
    </div>
    <!-- Projects tab -->
    <div v-if="activeTab === 'projects'" class="content-card">
      <form @submit.prevent="addProject" class="mb-4">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" v-model="newProject.title" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea v-model="newProject.description" class="form-control" rows="3" required></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Images</label>
          <input type="file" @change="handleFileSelection($event, 'images')" multiple class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Add Project</button>
      </form>

      <!-- Project List -->
      <ul class="list-group">
        <li v-for="project in projects" :key="project.id" class="list-group-item">
          <h5>{{ project.title }}</h5>
          <p>{{ project.description }}</p>
          <p>Date: {{ project.date }}</p>
          <div v-if="project.assets.length">
            <h6>Assets:</h6>
            <ul>
              <li v-for="(asset, index) in project.assets" :key="index">
                <a :href="asset" target="_blank">{{ asset }}</a>
              </li>
            </ul>
          </div>
          <button 
            @click="deleteProject(project.id)" 
            class="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";

export default {
  setup() {
    const activeTab = ref("products");
    const db = getFirestore();
    const productNames = ref({});
    const products = ref([]);  
    const orders = ref([]);
    const newSize = ref("");
    const newSizeStock = ref(0);
    const newSizePrice = ref(0);
    const newProduct = ref({
      name: "",
      description: "",
      category: "",
      assets: [],
      sizes: {},
    });

    const projects = ref([]);
    const newProject = ref({
      title: "",
      description: "",
      assets: [],
      date: null,
    });

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        products.value = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((product) => product.id !== "productId");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchProductNames = async (orderItems) => {
      const uniqueProductIds = [...new Set(orderItems.map(item => item.productId))];
      
      for (const productId of uniqueProductIds) {
        try {
          const productDoc = await getDoc(doc(db, "products", productId));
          if (productDoc.exists()) {
            productNames.value[productId] = productDoc.data().name;
          }
        } catch (error) {
          console.error(`Error fetching product name for ID ${productId}:`, error);
        }
      }
    };

    const addProduct = async () => {
      try {
        const product = { ...newProduct.value };
        const docRef = await addDoc(collection(db, "products"), product);
        products.value.push({ id: docRef.id, ...product });
        alert("Product added successfully!");
        resetNewProduct();
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
      }
    };

    const addSize = () => {
      if (newSize.value && newSizeStock.value >= 0 && newSizePrice.value >= 0) {
        newProduct.value.sizes = {
          ...newProduct.value.sizes,
          [newSize.value]: {
            stock: newSizeStock.value,
            price: newSizePrice.value
          }
        };
        newSize.value = "";
        newSizeStock.value = 0;
        newSizePrice.value = 0;
      }
    };


    const handleFileSelection = (event, type) => {
      const files = event.target.files;
      if (activeTab.value === 'projects') {
        for (const file of files) {
          newProject.value.assets.push(`${file.name}`);
        }
      } else {
        for (const file of files) {
          if (type === "images") {
            newProduct.value.assets.push(`${file.name}`);
          } else if (type === "models") {
            newProduct.value.assets.push(`${file.name}`);
          }
        }
      }
    };

    const deleteProduct = async (id) => {
      try {
        await deleteDoc(doc(db, "products", id));
        products.value = products.value.filter((product) => product.id !== id);
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    };

    const resetNewProduct = () => {
      newProduct.value = {
        name: "",
        description: "",
        category: "",
        assets: [],
        sizes: {},
      };
    };

    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((order) => order.id !== "orderId");
        
        for (const order of ordersData) {
          await fetchProductNames(order.items);
        }
        
        orders.value = ordersData;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const deleteOrder = async (id) => {
      try {
        await deleteDoc(doc(db, "orders", id));
        orders.value = orders.value.filter((order) => order.id !== id);
        alert("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order.");
      }
    };

    const updateOrderStatus = async (id, status) => {
      try {
        const orderRef = doc(db, "orders", id);
        await updateDoc(orderRef, { status });
        alert("Order status updated successfully!");
      } catch (error) {
        console.error("Error updating order status:", error);
        alert("Failed to update order status.");
      }
    };

    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        projects.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((project) => project.id !== "projectId"); // filter placeholder document
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const addProject = async () => {
      try {
        const project = {
          title: newProject.value.title,
          description: newProject.value.description,
          assets: newProject.value.assets
        };
        const docRef = await addDoc(collection(db, "projects"), project);
        projects.value.push({ id: docRef.id, ...project });
        alert("Project added successfully!");
        resetNewProject();
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Failed to add project.");
      }
    };

    const deleteProject = async (id) => {
      try {
        await deleteDoc(doc(db, "projects", id));
        projects.value = projects.value.filter((project) => project.id !== id);
        alert("Project deleted successfully!");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project.");
      }
    };

    const resetNewProject = () => {
      newProject.value = {
        title: "",
        description: "",
        assets: [],
        date: null,
      };
    };

    onMounted(fetchProjects);
    onMounted(fetchOrders);
    onMounted(fetchProducts);

    const setActiveTab = (tab) => {
      activeTab.value = tab;
    };

    return {
      activeTab,
      products,
      orders,
      newProduct,
      addProduct,
      deleteProduct,
      setActiveTab,
      handleFileSelection,
      deleteOrder,
      updateOrderStatus,
      projects,
      newProject,
      addProject,
      newSize,
      newSizeStock,
      addSize,
      newSizePrice,
      productNames,
      deleteProject,
    };
  },
};
</script>

<style scoped>
.page-container {
  position: relative;
  min-height: 100vh;
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
  opacity: 0.2;
  z-index: -1;
}

.content-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-tabs {
  border-bottom: none;
}

.nav-tabs .nav-link {
  cursor: pointer;
  color: #666;
  border: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease;
}

.nav-tabs .nav-link.active {
  color: #40E0D0;
  border-bottom: 2px solid #40E0D0;
  background: none;
}

.nav-tabs .nav-link:hover {
  color: #40E0D0;
}

.btn-primary {
  background-color: #40E0D0;
  border-color: #40E0D0;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #3bcdc0;
  border-color: #3bcdc0;
}

.form-control:focus {
  border-color: #40E0D0;
  box-shadow: 0 0 0 0.2rem rgba(64, 224, 208, 0.25);
}

.list-group-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0,0,0,0.1);
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.form-label {
  color: #555;
  font-weight: 500;
}

.form-select:focus {
  border-color: #40E0D0;
  box-shadow: 0 0 0 0.2rem rgba(64, 224, 208, 0.25);
}

.card {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.card-body {
  padding: 1.5rem;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

</style>