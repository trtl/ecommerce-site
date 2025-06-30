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
              @error="handleImageError"
            />
            <div class="card-body">
              <h5 class="card-title">{{ project.title }}</h5>
              <p class="card-text">{{ truncateDescription(project.description) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query, orderBy, limit } from '@firebase/firestore';

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

    const truncateDescription = (text) => {
      if (!text) return '';
      const words = text.split(' ');
      const truncated = words.slice(0, 30).join(' ');
      return truncated + (words.length > 30 ? '...' : '');
    };

    const getImageUrl = (imagePath) => {
      if (!imagePath) return '/images/pr1.png';
      try {
        return new URL(`/images/${imagePath}`, window.location.origin).href;
      } catch {
        return '/images/pr1.png';
      }
    };

    const handleImageError = (e) => {
      const fallbackImage = '/images/pr1.png';
      if (e.target.src !== fallbackImage) {
        e.target.src = fallbackImage;
      }
    };

    onMounted(() => {
      fetchProjects();
    });

    return {
      latestProjects,
      getImageUrl,
      handleImageError,
       truncateDescription,
    };
  }
};
</script>

<style scoped>
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

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  height: 400px;
  overflow: hidden;
}

.card-body {
  display: flex;
  flex-direction: column;
  height: 200px;
  padding: 1.25rem;
}

.card-text {
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  width: 100%;
}
</style>