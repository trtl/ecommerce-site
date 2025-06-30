<template>
  <div class="container mt-5">
    <h1 class="text-center">Checkout</h1>
    <p class="text-center">Please review your order and proceed to payment.</p>

    <div class="card p-4">
      <h3>Order Summary</h3>
      <ul>
        <li v-for="item in cart" :key="item.id">
          {{ item.name }} (x{{ item.quantity }}) - €{{ (item.price * item.quantity).toFixed(2) }}
        </li>
      </ul>
      <h4 class="text-end">Total: €{{ totalPrice.toFixed(2) }}</h4>
    </div>
    <!-- Info form -->
    <div class="card p-4 mt-4">
      <h3>Buyer Information</h3>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="buyerInfo.name" 
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            @blur="handleBlur('name')"
            required 
          />
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
        </div>

        <div class="mb-3">
          <label for="surname" class="form-label">Surname</label>
          <input 
            type="text" 
            id="surname" 
            v-model="buyerInfo.surname" 
            class="form-control"
            :class="{ 'is-invalid': errors.surname }"
            @blur="handleBlur('surname')"
            required 
          />
          <div class="invalid-feedback" v-if="errors.surname">{{ errors.surname }}</div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="buyerInfo.email" 
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            @blur="handleBlur('email')"
            required 
          />
          <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="buyerInfo.phone" 
            class="form-control"
            :class="{ 'is-invalid': errors.phone }"
            @blur="handleBlur('phone')"
            required 
          />
          <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <textarea 
            id="address" 
            v-model="buyerInfo.address" 
            class="form-control"
            :class="{ 'is-invalid': errors.address }"
            @blur="handleBlur('address')"
            rows="3" 
            required
          ></textarea>
          <div class="invalid-feedback" v-if="errors.address">{{ errors.address }}</div>
        </div>

        <div class="mb-3">
          <label for="city" class="form-label">City</label>
          <input 
            type="text" 
            id="city" 
            v-model="buyerInfo.city" 
            class="form-control"
            :class="{ 'is-invalid': errors.city }"
            @blur="handleBlur('city')"
            required 
          />
          <div class="invalid-feedback" v-if="errors.city">{{ errors.city }}</div>
        </div>

        <div class="mb-3">
          <label for="postalCode" class="form-label">Postal Code</label>
          <input 
            type="text" 
            id="postalCode" 
            v-model="buyerInfo.postalCode" 
            class="form-control"
            :class="{ 'is-invalid': errors.postalCode }"
            @blur="handleBlur('postalCode')"
            required 
          />
          <div class="invalid-feedback" v-if="errors.postalCode">{{ errors.postalCode }}</div>
        </div>

        <div class="mb-3">
          <label for="country" class="form-label">Country</label>
          <select 
            id="country" 
            v-model="buyerInfo.country" 
            class="form-select" 
            required
          >
            <option value="Lithuania">Lithuania</option>
            <option value="Latvia">Latvia</option>
          </select>
        </div>
      </form>
    </div>

    <button 
      class="btn btn-primary w-100 mt-4" 
      @click="redirectToPaysera"
      :disabled="Object.keys(errors).length > 0"
    >
      Proceed to Paysera
    </button>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { getFirestore, collection, addDoc, serverTimestamp, doc, runTransaction } from "firebase/firestore";
import { validateForm, validateField } from "@/utility/inputRules";

export default {
  setup() {
    const cartStore = useCartStore();
    const { cart, totalPrice } = storeToRefs(cartStore);
    const userStore = useUserStore();
    const db = getFirestore();
    const errors = ref({});

    const buyerInfo = reactive({
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Lithuania",
    });

    const handleBlur = (field) => {
      const result = validateField(field, buyerInfo[field]);
      if (!result.isValid) {
        errors.value[field] = result.message;
      } else {
        delete errors.value[field];
      }
    };

    const validateAllFields = () => {
      const fields = ['name', 'surname', 'email', 'phone', 'address', 'city', 'postalCode'];
      const { isValid, errors: validationErrors } = validateForm(buyerInfo, fields);
      errors.value = validationErrors;
      return isValid;
    };

    const redirectToPaysera = async () => {
      try {
        await runTransaction(db, async (transaction) => {
          const productRefs = cart.value.map(item => ({
            ref: doc(db, "products", item.id),
            item: item
          }));

          const productDocs = await Promise.all(
            productRefs.map(async ({ ref }) => ({
              ref,
              snap: await transaction.get(ref)
            }))
          );

          // Validate stock
          for (const { snap, ref } of productDocs) {
            const relatedItems = cart.value.filter(item => item.id === ref.id);
            const productData = snap.data();

            for (const item of relatedItems) {
              const sizeData = productData.sizes[item.size];
              if (!sizeData || sizeData.stock < item.quantity) {
                throw new Error(`Not enough stock for ${productData.name} in size ${item.size}`);
              }
            }
          }

          // Create order
          const order = {
            userId: userStore.userInfo?.uid || 'anonymous',
            buyerInfo: buyerInfo,
            items: cart.value.map(item => ({
              productId: item.id,
              size: item.size,
              quantity: item.quantity,
              price: item.price
            })),
            status: "waiting for payment",
            total: totalPrice.value,
            date: serverTimestamp(),
          };

          await addDoc(collection(db, "orders"), order);

          // Update stock
          productDocs.forEach(({ snap, ref }) => {
            const productData = snap.data();
            const relatedItems = cart.value.filter(item => item.id === ref.id);

            relatedItems.forEach(item => {
              const newStock = productData.sizes[item.size].stock - item.quantity;

              transaction.update(ref, {
                [`sizes.${item.size}.stock`]: newStock
              });
            });
          });

          cartStore.clearCart();
          alert("Order created successfully! Redirecting to payment...");
        });
      } catch (error) {
        console.error("Error processing order:", error);
        alert(error.message || "Failed to create order. Please try again.");
      }
    };

    return {
      cart,
      totalPrice,
      buyerInfo,
      redirectToPaysera,
      handleBlur,
      errors,
      validateAllFields
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

</style>
