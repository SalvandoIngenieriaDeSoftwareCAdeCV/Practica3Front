<template>
  <div class="page-container">
      <h1 v-if="userData" class="welcome-message">Bienvenido {{ userData.nombre }}</h1>
      <div class="table-container">
          <table v-if="userData" class="styled-table">
              <thead>
                  <tr>
                      <th>Nombre</th>
                      <th>Apellido Paterno</th>
                      <th>Apellido Materno</th>
                      <th>Correo</th>
                      <th>Imagen</th>
                      <th>Modificar</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ userData.nombre }}</td>
                      <td>{{ userData.apellidoPaterno }}</td>
                      <td>{{ userData.apellidoMaterno }}</td>
                      <td>{{ userData.correo }}</td>
                      <td>
                          <img :src="`data:image/jpeg;base64,${userData.imagen}`" alt="Imagen de usuario" v-if="userData.imagen" class="user-image"/>
                          <img src="@/assets/usuario.jpg" alt="Imagen predeterminada"  v-else class="user-image"/>
                      </td>
                      <td>
                        <input type="file" @change="onFileChange" accept="image/*" ref="fileInput" style="display: none" /> 
                        <button @click="openEditModal(user)" class="upload-button">Modificar</button>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p v-else>Cargando datos...</p>
          <button @click="logout" class="logout-button">Cerrar Sesión</button>
      </div>
      <div v-if="showModal" class="modal-overlay">
              <div class="modal-content">
                  <h2 class="form-title">Modificar Usuario</h2>
                  <form @submit.prevent="updateUser">
                      <div v-for="field in fields" :key="field.model" class="form-group">
                          <input 
                              :type="field.type" 
                              v-model="editUser[field.model]" 
                              :placeholder="field.placeholder" 
                              :required="field.required" 
                          />
                      </div>
                      <input type="file" @change="onFileChange" accept="image/*" class="form-control" />
                      <button type="submit" class="button button-primary">Modificar Permanentemente</button>
                  </form>
                  <button @click="closeEditModal" class="button button-secondary">Cancelar</button>
                  <p v-if="error" class="text-danger">{{ error }}</p>
                  <p v-if="success" class="text-success">{{ success }}</p>
              </div>
          </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
          userData: null,
          nimagen: '',
          showModal: false,
          error: '',
          success: ''
      };
  },
  async created() {
      const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage
      try {
          const response = await axios.get(`http://localhost:8080/cliente/getUserData/${userId}`);
          this.userData = response.data;
      } catch (error) {
          this.error = 'Error al obtener los datos del usuario:';
          this.success = '';
      }
  },
  methods: {
    onFileChange(event){
      const file = event.target.files[0];
      if(file){
        this.nimagen = file;
      }
    },
    async updateUser() {
          if (!this.nimagen) {
            this.error = 'Por favor, seleccione una imagen';
            this.success = '';
            return;
          }

          const dataN = new FormData();
          dataN.append('correo', this.userData.correo);
          dataN.append('nombre', this.userData.nombre);
          dataN.append('apellidoPaterno', this.userData.apellidoPaterno);
          dataN.append('apellidoMaterno', this.userData.apellidoMaterno);
          dataN.append('imagen', this.nimagen);
          try {
              // Utiliza el correo del usuario para hacer la solicitud de actualización
              await axios.put(`http://localhost:8080/cliente/updateUserByEmail`, dataN, {
                headers: {
                  'modo': 0,
                  'mod': 0
                }
              });
              
              this.success = 'Usuario modificado exitosamente';
              this.error = '';
              await new Promise(resolve => setTimeout(resolve, 2000));
              this.showModal = false;
              this.success = '';
              const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde localStorage
              const response = await axios.get(`http://localhost:8080/cliente/getUserData/${userId}`);
              this.userData = response.data;
          } catch (error) {
              this.error = 'Debe elegir una imagen:';
              this.success = '';
          }
      },
     closeEditModal(){
      this.showModal = false;
     },
     openEditModal(user) {
          this.editUser = { ...user }; // Copia los datos del usuario a editar
          this.showModal = true;
      },
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

.user-image{
width: 100px;
height: auto;
border-radius: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #f3f4fc;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 14px;
}
.text-danger {
  color: red;
}

.text-success {
color: green;
}
</style>