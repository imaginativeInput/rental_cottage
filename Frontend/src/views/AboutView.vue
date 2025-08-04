<script>
export default {
  name: "StickyNavbar",
  data() {
    return {
      lastScrollY: 0,
      hideNavbar: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (window.scrollY > this.lastScrollY) {
        this.hideNavbar = true;
      } else {
        this.hideNavbar = false;
      }
      this.lastScrollY = window.scrollY;
    },
  },
};
</script>

<template>
  <div>
    <nav :class="['navbar', { 'hidden-nav': hideNavbar }]">
      <h1 class="logo">My Website</h1>
      <ul class="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <div class="content">
      <p>Scroll down to see the sticky effect...</p>
      <div class="spacer">More content here...</div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #000;
  /* color: white; */
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
}

.hidden-nav {
  transform: translateY(-100%);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #bbb;
}

.content {
  margin-top: 60px;
  padding: 20px;
}

.spacer {
  height: 200vh;
  background: #f4f4f4;
  padding: 20px;
}
</style>