<template>
    <div class="about-page">
        <h1>About Us</h1>
        <p>
            Welcome to our ecommerce site! We are dedicated to providing the best products and services to our customers.
        </p>
        <section class="team">
            <h2>Our Team</h2>
            <p>Meet the amazing people behind our success.</p>
        </section>
        <section class="mission">
            <h2>Our Mission</h2>
            <p>To deliver quality and value to our customers every day.</p>
        </section>
    </div>
</template>

<script>
export default {
    name: "AboutPage",
};
</script>

<style scoped>
.about-page {
    padding: 20px;
    font-family: Arial, sans-serif;
}

.about-page h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.about-page section {
    margin-top: 20px;
}

.about-page h2 {
    font-size: 1.5rem;
    margin-bottom: 5px;
}

.about-page p {
    font-size: 1rem;
    line-height: 1.5;
}
</style>