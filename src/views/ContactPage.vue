<template>
  <div class="container mt-5">
    <h1>Contact Page</h1>
    <p>Get in touch with us!</p>

    <div class="card p-4 mt-4">
      <h3>Contact Form</h3>
      <form @submit.prevent="sendMessage">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" v-model="contactInfo.name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" v-model="contactInfo.email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input type="tel" id="phone" v-model="contactInfo.phone" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="topic" class="form-label">Topic</label>
          <input type="text" id="topic" v-model="contactInfo.topic" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">Message</label>
          <textarea id="message" v-model="contactInfo.message" class="form-control" rows="5" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Send Message</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ContactPage",
  data() {
    return {
      contactInfo: {
        name: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
      },
    };
  },
  methods: {
    async sendMessage() {
      try {
        // Replace '/api/send-email' with your backend email endpoint
        const response = await axios.post("/api/send-email", this.contactInfo);
        if (response.status === 200) {
          alert("Your message has been sent successfully!");
          this.contactInfo = {
            name: "",
            email: "",
            phone: "",
            topic: "",
            message: "",
          };
        } else {
          alert("Failed to send your message. Please try again.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert("An error occurred while sending your message. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>