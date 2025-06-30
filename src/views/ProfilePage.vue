


<template>
  <div class="page-container">
    <div class="background-overlay"></div>
    <div class="container py-5">
   
      <div class="content-card mb-4">
        <ul class="nav nav-tabs">
          <li class="nav-item" @click="activeTab = 'profile'">
            <a :class="{'nav-link': true, active: activeTab === 'profile'}">
              <i class="bi bi-person-circle me-2"></i>Profile
            </a>
          </li>
          <li class="nav-item" @click="activeTab = 'orders'">
            <a :class="{'nav-link': true, active: activeTab === 'orders'}">
              <i class="bi bi-box-seam me-2"></i>Orders
            </a>
          </li>
          <li class="nav-item" @click="activeTab = 'addresses'">
            <a :class="{'nav-link': true, active: activeTab === 'addresses'}">
              <i class="bi bi-geo-alt me-2"></i>Addresses
            </a>
          </li>
        </ul>
      </div>

      <!-- Profile -->
      <div v-if="activeTab === 'profile'" class="content-card">
        <h3>Profile Information</h3>
        <form @submit.prevent="updateProfile">
          <div class="mb-3">
            <label class="form-label">First Name</label>
            <input type="text" v-model="user.firstName" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Last Name</label>
            <input type="text" v-model="user.lastName" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" v-model="user.email" class="form-control" disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Phone</label>
            <input type="tel" v-model="user.phone" class="form-control" />
          </div>
          <button class="btn btn-primary" :disabled="isUpdating">Update Profile</button>
        </form>
      </div>

      <!-- Orders -->
      <div v-if="activeTab === 'orders'" class="content-card">
        <h3 class="mb-4">My Orders</h3>
        <div class="order-list">
          <div v-for="order in orders" :key="order.id" class="order-card mb-4">
            <div class="order-header">
              <div>
                <h5 class="mb-0">Order #{{ order.id }}</h5>
                <span class="badge rounded-pill" 
                      :class="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              </div>
              <!-- Display order date
              <div class="order-date">
                {{ order.date?.toDate().toLocaleString() }}
              </div>
              -->
              <div class="order-date">
                {{ new Date('2025-06-09').toLocaleDateString() }}
              </div>
            </div>
            <div class="order-items">
              <div v-for="item in order.items" :key="item.productId" class="order-item">
                <div class="item-details">
                  <span class="item-name">{{ productNames[item.productId] || 'Loading...' }}</span>
                  <span class="item-size">Size: {{ item.size || "N/A" }}</span>
                  <span class="item-quantity">Qty: {{ item.quantity }}</span>
                </div>
              </div>
            </div>
            <div class="order-footer">
              <strong>Total: €{{ order.total.toFixed(2) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div v-if="activeTab === 'addresses'" class="mt-4">
        <ul class="list-group mb-3">
          <li v-for="address in addresses" :key="address.id" class="list-group-item">
            {{ address.street }}, {{ address.buildingNumber }}, {{ address.city }}, {{ address.country }}, {{ address.postalCode }}
            <button class="btn btn-warning btn-sm float-end ms-2" @click="editAddress(address)">Edit</button>
            <button class="btn btn-danger btn-sm float-end" @click="removeAddress(address.id)">Remove</button>
          </li>
        </ul>
        <h4 v-if="isEditing">Edit Address</h4>
        <h4 v-else>Add New Address</h4>
        <form @submit.prevent="isEditing ? updateAddress() : addAddress()">
          <div class="mb-3">
            <label class="form-label">Street</label>
            <input type="text" v-model="newAddress.street" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Building Number</label>
            <input type="text" v-model="newAddress.buildingNumber" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">City</label>
            <input type="text" v-model="newAddress.city" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Country</label>
            <input type="text" v-model="newAddress.country" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Postal Code</label>
            <input type="text" v-model="newAddress.postalCode" class="form-control" required />
          </div>
          <button class="btn btn-primary" type="submit">{{ isEditing ? "Update Address" : "Add Address" }}</button>
          <button class="btn btn-secondary ms-2" type="button" @click="resetNewAddress" v-if="isEditing">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { getFirestore, collection, query, where, doc, getDoc, addDoc, updateDoc, deleteDoc, getDocs } from "@firebase/firestore";

export default {
  setup() {
    const activeTab = ref("profile");
    const userStore = useUserStore();
    const db = getFirestore();

    const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
    case 'pending': return 'bg-warning text-dark';
    case 'processing': return 'bg-info text-dark';
    case 'shipped': return 'bg-primary';
    case 'delivered': return 'bg-success';
    case 'cancelled': return 'bg-danger';
    default: return 'bg-secondary';
    }};
    const user = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    const isUpdating = ref(false);
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userStore.userInfo.uid));
        if (userDoc.exists()) {
          Object.assign(user.value, userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const updateProfile = async () => {
      isUpdating.value = true;
      try {
        await updateDoc(doc(db, "users", userStore.userInfo.uid), {
          firstName: user.value.firstName,
          lastName: user.value.lastName,
          phone: user.value.phone,
        });
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      } finally {
        isUpdating.value = false;
      }
    };

    const orders = ref([]);
    const productNames = ref({});
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", userStore.userInfo.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const order of ordersData) {
          await fetchProductNames(order.items);
        }
        
        orders.value = ordersData;
      } catch (error) {
        console.error("Error fetching orders:", error);
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

    const addresses = ref([]);
    const newAddress = ref({
      street: "",
      buildingNumber: "",
      city: "",
      country: "Lithuania",
      postalCode: "",
    });
    const isEditing = ref(false);
    const editingAddressId = ref(null);

    const fetchAddresses = async () => {
      try {
        const addressesQuery = query(
          collection(db, "addresses"),
          where("userId", "==", userStore.userInfo.uid)
        );
        const querySnapshot = await getDocs(addressesQuery);
        addresses.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    const addAddress = async () => {
      if (addresses.value.length >= 3) {
        alert("You can only store up to 3 addresses.");
        return;
      }

      try {
        const address = {
          ...newAddress.value,
          userId: userStore.userInfo.uid,
        };
        const docRef = await addDoc(collection(db, "addresses"), address);
        addresses.value.push({ id: docRef.id, ...address });
        alert("Address added successfully!");
        resetNewAddress();
      } catch (error) {
        console.error("Error adding address:", error);
        alert("Failed to add address.");
      }
    };
    const editAddress = (address) => {
      isEditing.value = true;
      editingAddressId.value = address.id;
      Object.assign(newAddress.value, address);
    };
    const updateAddress = async () => {
      try {
        const addressRef = doc(db, "addresses", editingAddressId.value);
        await updateDoc(addressRef, newAddress.value);
        const index = addresses.value.findIndex((addr) => addr.id === editingAddressId.value);
        if (index !== -1) {
          addresses.value[index] = { id: editingAddressId.value, ...newAddress.value };
        }
        alert("Address updated successfully!");
        resetNewAddress();
        isEditing.value = false;
        editingAddressId.value = null;
      } catch (error) {
        console.error("Error updating address:", error);
        alert("Failed to update address.");
      }
    };

    const removeAddress = async (id) => {
    try {
      if (!confirm('Are you sure you want to delete this address?')) {
        return;
      }

      const addressRef = doc(db, "addresses", id);
      await deleteDoc(addressRef);

      addresses.value = addresses.value.filter((addr) => addr.id !== id);
      alert("Address removed successfully!");

    } catch (error) {
      console.error("Error removing address:", error);
      alert("Failed to remove address: " + error.message);
    }
  };

    const resetNewAddress = () => {
      newAddress.value = {
        street: "",
        buildingNumber: "",
        city: "",
        country: "Lithuania",
        postalCode: "",
      };
    };

    onMounted(async () => {
      try {
        await Promise.all([
          fetchUserData(),       
          fetchOrders(),     
          fetchAddresses()     
        ]);
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    });

    return {
      activeTab,
      user,
      isUpdating,
      updateProfile,
      orders,
      addresses,
      newAddress,
      addAddress,
      editAddress,
      updateAddress,
      removeAddress,
      resetNewAddress,
      getStatusClass,
      productNames,
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

.order-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.order-date {
  color: #666;
  font-size: 0.9rem;
}

.order-items {
  margin: 1rem 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-details {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-name {
  font-weight: 500;
}

.item-size, .item-quantity {
  color: #666;
  font-size: 0.9rem;
}

.order-footer {
  margin-top: 1rem;
  text-align: right;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.btn-primary {
  background-color: #40E0D0;
  border-color: #40E0D0;
}

.btn-primary:hover {
  background-color: #3bcdc0;
  border-color: #3bcdc0;
}
</style>