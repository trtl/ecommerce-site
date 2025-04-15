<template>
  <div class="container py-5">
    <h1 class="mb-4">My Profile</h1>

    <!-- Tabs -->
    <ul class="nav nav-tabs">
      <li class="nav-item" @click="activeTab = 'profile'">
        <a :class="{'nav-link': true, active: activeTab === 'profile'}">Profile</a>
      </li>
      <li class="nav-item" @click="activeTab = 'orders'">
        <a :class="{'nav-link': true, active: activeTab === 'orders'}">My Orders</a>
      </li>
      <li class="nav-item" @click="activeTab = 'addresses'">
        <a :class="{'nav-link': true, active: activeTab === 'addresses'}">My Addresses</a>
      </li>
    </ul>

    <!-- Profile Section -->
    <div v-if="activeTab === 'profile'" class="mt-4">
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

    <!-- Orders Section -->
    <div v-if="activeTab === 'orders'" class="mt-4">
      <h3>My Orders</h3>
      <ul class="list-group">
        <li v-for="order in orders" :key="order.id" class="list-group-item">
          <h5>Order #{{ order.id }}</h5>
          <p>Status: {{ order.status }}</p>
          <p>Total: €{{ order.total.toFixed(2) }}</p>
          <p>Date: {{ order.date?.toDate().toLocaleString() }}</p>
          <ul>
            <li v-for="item in order.items" :key="item.productId">
              Product ID: {{ item.productId }}, Size: {{ item.size || "N/A" }}, Quantity: {{ item.quantity }}
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Addresses Section -->
    <div v-if="activeTab === 'addresses'" class="mt-4">
      <h3>My Addresses</h3>
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
</template>

<script>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { getFirestore, collection, query, where, doc, getDoc, addDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

export default {
  setup() {
    const activeTab = ref("profile");
    const userStore = useUserStore();
    const db = getFirestore();

    const user = ref({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    const isUpdating = ref(false);

    // Fetch user data from Firestore
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

    // Update user data in Firestore
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

    // Fetch user data on component mount
    onMounted(fetchUserData);

    const orders = ref([]);

    // Fetch user's orders from Firestore
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", userStore.userInfo.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        orders.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Fetch orders on component mount
    onMounted(fetchOrders);

    const addresses = ref([]);
    const newAddress = ref({
      street: "",
      buildingNumber: "",
      city: "",
      country: "Lithuania", // Default country
      postalCode: "",
    });
    const isEditing = ref(false);
    const editingAddressId = ref(null);

    // Fetch user's addresses from Firestore
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

    // Add a new address to Firestore
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

    // Edit an existing address
    const editAddress = (address) => {
      isEditing.value = true;
      editingAddressId.value = address.id;
      Object.assign(newAddress.value, address);
    };

    // Update an address in Firestore
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

    // Remove an address from Firestore
    const removeAddress = async (id) => {
      try {
        // Ensure the `id` is valid
        if (!id) {
          console.error("Invalid address ID:", id);
          return;
        }

        // Remove the address from Firestore
        await deleteDoc(doc(db, "addresses", id));
        console.log("Address removed from Firestore:", id);
        // Update the local `addresses` array to remove the deleted address
        addresses.value = addresses.value.filter((addr) => addr.id !== id);

        alert("Address removed successfully!");
      } catch (error) {
        console.error("Error removing address:", error);
        alert("Failed to remove address.");
      }
    };

    // Reset the new address form
    const resetNewAddress = () => {
      newAddress.value = {
        street: "",
        buildingNumber: "",
        city: "",
        country: "Lithuania",
        postalCode: "",
      };
    };

    // Fetch addresses on component mount
    onMounted(fetchAddresses);

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
    };
  },
};
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>