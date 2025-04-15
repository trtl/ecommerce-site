<template>
  <div>
    <!-- Full-Screen Background Image -->
    <div class="hero-image">
      <div class="hero-text">
        <h1>Welcome to Our Website</h1>
        <p>Discover our latest projects below</p>
      </div>
    </div>

    <!-- Latest Projects Section -->
    <div class="container mt-5">
      <h2 class="text-center mb-4">Latest Projects</h2>
      <div class="row">
        <div class="col-md-4" v-for="project in latestProjects" :key="project.id">
          <div class="card mb-4">
            <img :src="project.image" class="card-img-top" alt="Project Image" />
            <div class="card-body">
              <h5 class="card-title">{{ project.title }}</h5>
              <p class="card-text">{{ project.description }}</p>
              <p class="text-muted">Added on: {{ project.dateAdded }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      latestProjects: [
        {
          id: 1,
          title: "Project One",
          description: "This is a short description of project one.",
          image: "https://via.placeholder.com/300x200",
          dateAdded: "2025-04-01",
        },
        {
          id: 2,
          title: "Project Two",
          description: "This is a short description of project two.",
          image: "https://via.placeholder.com/300x200",
          dateAdded: "2025-03-28",
        },
        {
          id: 3,
          title: "Project Three",
          description: "This is a short description of project three.",
          image: "https://via.placeholder.com/300x200",
          dateAdded: "2025-03-25",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Full-Screen Background Image */
.hero-image {
  background-image: url("@/assets/fitingiai.jpg");
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.hero-text h1 {
  font-size: 3rem;
  font-weight: bold;
}

.hero-text p {
  font-size: 1.5rem;
}

/* Latest Projects Section */
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>