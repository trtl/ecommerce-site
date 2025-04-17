<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>

    <nav>
      <ul>
        <li @click="setActiveTab('products')">Products</li>
        <li @click="setActiveTab('orders')">Orders</li>
        <li @click="setActiveTab('projects')">Projects</li>
      </ul>
    </nav>

    <!-- Products Tab -->
    <div v-if="activeTab === 'products'">
      <h2>Product Management</h2>

      <!-- Add Product Form -->
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
          <input type="text" v-model="newProduct.category" class="form-control" required />
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
          <!-- Display added sizes -->
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

      <!-- Product List -->
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
    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'">
      <h2>Order Management</h2>

      <!-- Order List -->
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
            <p>Date: {{ order.date?.toDate().toLocaleString() }}</p>
            <ul>
              <li v-for="item in order.items" :key="item.productId">
                Product ID: {{ item.productId }}, Quantity: {{ item.quantity }}
              </li>
            </ul>
          </div>
          <button class="btn btn-danger btn-sm" @click="deleteOrder(order.id)">Delete</button>
        </li>
      </ul>
    </div>
    <div v-if="activeTab === 'projects'">
      <h2>Project Management</h2>

      <!-- Add Project Form -->
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
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default {
  setup() {
    const activeTab = ref("products");
    const db = getFirestore();
    

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

    // Fetch products from Firestore
    // Fetch a single product by its productId
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        products.value = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((product) => product.id !== "productId"); // Exclude placeholder
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };


    // Add a new product to Firestore
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

    // Update the addSize method
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

    // Delete a product from Firestore
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

    // Reset the new product form
    const resetNewProduct = () => {
      newProduct.value = {
        name: "",
        description: "",
        category: "",
        assets: [],
        sizes: {},
      };
    };


    // Fetch all orders from Firestore
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        orders.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((order) => order.id !== "orderId"); // Exclude placeholder
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Delete an order from Firestore
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

    // Update the status of an order in Firestore
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

    // Fetch all projects from Firestore
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        projects.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((project) => project.id !== "projectId"); // Exclude placeholder");
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    // Add a new project to Firestore
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

    // Reset the new project form
    const resetNewProject = () => {
      newProject.value = {
        title: "",
        description: "",
        assets: [],
        date: null,
      };
    };

    // Fetch projects on component mount
    onMounted(fetchProjects);

    // Fetch orders on component mount
    onMounted(fetchOrders);



    // Fetch products on component mount
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
    };
  },
};
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}
nav ul {
  display: flex;
  gap: 15px;
  list-style: none;
  padding: 0;
}
nav ul li {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
nav ul li:hover {
  background-color: #f0f0f0;
}
</style>