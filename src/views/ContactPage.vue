<template>
  <div class="contact-page-container">
    <div class="background-overlay"></div>
    <div class="container mt-5">
      <div class="card p-4 mt-4 contact-card">
        <h3 class="mb-4 text-center">Contact Us</h3>
        <form @submit.prevent="sendMessage">
          <div class="row">
            <!-- Left Column -->
            <div class="col-md-6">
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
            </div>
            <!-- Right Column -->
            <div class="col-md-6">
              <div class="mb-3">
                <label for="topic" class="form-label">Topic</label>
                <input type="text" id="topic" v-model="contactInfo.topic" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea id="message" v-model="contactInfo.message" class="form-control" rows="5" required></textarea>
              </div>
            </div>
          </div>
          <button type="submit" class="btn custom-btn w-100">Send Message</button>
        </form>
      </div>

      <!-- Contact Information Section -->
      <div class="row mt-5 contact-info">
        <div class="col-md-4 text-center">
          <div class="info-card">
            <i class="bi bi-telephone-fill mb-3"></i>
            <h5>Phone</h5>
            <p>+370 000 00000</p>
            <p class="hours">Mon-Fri: 9:00 - 17:00</p>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="info-card">
            <i class="bi bi-envelope-fill mb-3"></i>
            <h5>Email</h5>
            <p>info@info.lt</p>
            <p class="hours">We reply within 24h</p>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="info-card">
            <i class="bi bi-geo-alt-fill mb-3"></i>
            <h5>Address</h5>
            <p>H.Manto g 00</p>
            <p>Klaipėda, Lithuania</p>
          </div>
        </div>
      </div>
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
.contact-page-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/fitingiai.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  opacity: 1;
  z-index: -1;
}

.contact-card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.custom-btn {
  background-color: #40E0D0;
  border: none;
  color: white;
  transition: opacity 0.2s ease;
}

.custom-btn:hover {
  background-color: #40E0D0;
  opacity: 0.9;
}

.contact-info {
  margin-bottom: 2rem;
}

.info-card {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 8px;
  height: 100%;
}

.info-card i {
  font-size: 2rem;
  color: #40E0D0;
}

.info-card h5 {
  color: #333;
  margin-bottom: 1rem;
}

.info-card p {
  margin-bottom: 0.5rem;
  color: #666;
}

.hours {
  font-size: 0.9rem;
  color: #888;
}

@media (max-width: 768px) {
  .contact-info > div {
    margin-bottom: 1rem;
  }
}
</style>