<template>
  <section>
    <h1>Swap. Style. Sustain.</h1>
    <p>
      Welcome to ClosetSwap – a platform where you can list your clothes, discover new styles, and swap fashion with others in the community. It’s sustainable, social, and stylish.
    </p>
    <div>
      <RouterLink to="/signup">
        <button>Sign Up</button>
      </RouterLink>
      <RouterLink to="/login">
        <button>Log In</button>
      </RouterLink>
    </div>

    <div>
      <div>
        <h3>👚 List Your Clothes</h3>
        <p>Upload items from your closet that you’re ready to let go of.</p>
      </div>
      <div>
        <h3>🔄 Browse & Swap</h3>
        <p>Find clothes listed by others and request swaps easily.</p>
      </div>
      <div>
        <h3>🌱 Stay Sustainable</h3>
        <p>Help reduce waste and refresh your wardrobe the eco-friendly way.</p>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
