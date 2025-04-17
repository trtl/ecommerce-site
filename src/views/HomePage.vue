<template>
  <div>
    <!-- Full-Screen Background Image -->
    <div class="hero-image">
      <div class="hero-text">
        <h1>Welcome to the</h1>
        <p>Biggest assortment of metal joint supplies in town</p>
      </div>
    </div>

    <!-- Latest Projects Section -->
    <div class="container mt-5">
      <h2 class="text-center mb-4">Latest Projects</h2>
      <div class="row">
        <div class="col-md-4" v-for="project in latestProjects" :key="project.id">
          <div class="card mb-4">
            <img 
              :src="getImageUrl(project.assets?.[0])"
              class="card-img-top" 
              :alt="project.title"
              @error="(e) => handleImageError(e)"
            />
            <div class="card-body">
              <h5 class="card-title">{{ project.title }}</h5>
              <p class="card-text">{{ project.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default {
  name: "HomePage",
  setup() {
    const latestProjects = ref([]);
    const db = getFirestore();

    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('title', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        
        latestProjects.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const getImageUrl = (imagePath) => {
      if (!imagePath) return '/images/pr1.png';
      return `/images/${imagePath}`;
    };

    const handleImageError = (e) => {
      e.target.src = '/images/pr1.png';
    };

    onMounted(() => {
      fetchProjects();
    });

    return {
      latestProjects,
      handleImageError,
      getImageUrl
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

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-title {
  color: #333;
  font-weight: 500;
}

.card-text {
  color: #666;
}
</style>