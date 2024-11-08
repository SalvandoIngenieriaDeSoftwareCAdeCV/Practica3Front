<template>
    <div class="page-container">
        <br>
        <h1 class="welcome-message">Bienvenido Admin</h1>
        <div class="table-container">
            <table v-if="users.length" class="styled-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id_cliente">
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.apellidoPaterno }}</td>
                        <td>{{ user.apellidoMaterno }}</td>
                        <td>{{ user.correo }}</td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Cargando datos...</p>
            <button @click="logout" class="logout-button">Cerrar Sesión</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: []
        };
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:8080/cliente/getAllUsers');
            this.users = response.data;
        } catch (error) {
            console.error("Error al obtener los datos de los usuarios:", error);
        }
    },
    methods: {
        logout() {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
/* Fondo de la página */
.page-container {
  background-color: #d1e0f3; /* Color de fondo similar al de la imagen */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Estilo del mensaje de bienvenida */
.welcome-message {
  font-size: 24px;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

/* Contenedor de la tabla */
.table-container {
  background-color: #e6ecf7;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
}

/* Estilo de la tabla */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  margin-top: 20px;
}

.styled-table thead tr {
  background-color: #5e79e8;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f4fc;
}

.styled-table tbody tr:hover {
  background-color: #e1e5f9;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #5e79e8;
}

.styled-table th {
  font-weight: bold;
}

.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: #5e79e8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #4c68c9;
}
</style>