<template>
    <div>
      <h2>Si jaló</h2>
      <button @click="logout">Cerrar Sesión</button>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.removeItem("isAuthenticated"); // Elimina el estado de autenticación
            localStorage.removeItem("userId");
            this.$router.push('/'); // Redirige al inicio de sesión
        }
    }
}
</script>