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
          <button @click="mostrarRecomendacionesL" class="logout-button">Recomendaciones de Libros</button>
          <button @click="mostrarRecomendacionesP" class="logout-button">Recomendaciones de Peliculas</button>
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

      <div v-if="showModal2" class="modal-overlay">
              <div class="modal-content">
                  <h2 class="form-title">Recomendaciones</h2>
                  <div class = "table-container">
                    <table class="table2"> 
                    <thead> 
                      <tr> 
                        <th>Título</th> 
                        <th>Autor</th>
                        <th>Portada</th>
                      </tr> 
                    </thead> 
                    <tbody> 
                      <tr v-for="book in randomBooks" :key="book.key"> 
                        <td>{{ book.title }}</td> 
                        <td>{{ book.authors[0].name }}</td> 
                        <td>
                          <img :src="obtenerPortada(book)" :alt="book.title" v-if="obtenerPortada(book)"/>
                          <span v-else>No hay portada disponible</span>
                        </td>
                      </tr> 
                    </tbody> 
                  </table>
                  </div>
                  <button @click="closeRecomendacionModalL" class="button button-secondary">Cerrar</button>
                  <p v-if="error" class="text-danger">{{ error }}</p>
                  <p v-if="success" class="text-success">{{ success }}</p>
              </div>
      </div>
      <div v-if="showModal3" class="modal-overlay">
              <div class="modal-content">
                  <h2 class="form-title">Recomendaciones</h2>
                  <div class = "table-container">
                    <table class="table2"> 
                    <thead> 
                      <tr> 
                        <th>Nombre</th> 
                        <th>Generos</th>
                        <th>Portada</th>
                      </tr> 
                    </thead> 
                    <tbody> 
                      <tr v-for="programa in randomProgramas" :id="programa.id"> 
                        <td>{{ programa.show.name }}</td> 
                        <td>{{ programa.show.genres }}</td> 
                        <td>
                          <img :src="programa.show.image.medium" :alt="programa.name" v-if="programa.show.image"/>
                          <span v-else>No hay Imagen disponible</span>
                        </td>
                      </tr> 
                    </tbody> 
                  </table>
                  </div>
                  <button @click="closeRecomendacionModalP" class="button button-secondary">Cerrar</button>
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
          showModal2: false,
          showModal3: false,
          error: '',
          success: '',
          books: [],
          randomBooks: [],
          programas: [],
          randomProgramas: [],
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
                },
                timeout: 60000
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
      async presentarRecomendacionesL(){
        try{
          const response = await axios.get('https://openlibrary.org/subjects/science_fiction.json?limit=50');
          this.books = response.data.works;
          this.randomBooks = this.getRandomBooks();
        }catch(error){
          console.error('Error al obtener los libros', error);
        }
      },
      async presentarRecomendacionesP(){
        try{
          const response = await axios.get('https://api.tvmaze.com/schedule?date=2025-01-14');
          this.programas = response.data;
          this.randomProgramas = this.getRandomProgramas();
          console.log(this.programas);
        }catch(error){
          console.error('Error al obtener los programas', error);
        }
      },
      getRandomBooks(){
        const shuffled = this.books.sort(() => 0.5 - Math.random());
        console.log(this.books);
        return shuffled.slice(0, 10);
      }, 
      getRandomProgramas(){
        const shuffled = this.programas.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
      },  
     closeEditModal(){
      this.showModal = false;
     },
     closeRecomendacionModalL(){
      this.showModal2 = false;
     },
     closeRecomendacionModalP(){
      this.showModal3 = false;
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
      },
      mostrarRecomendacionesL(){
        this.showModal2 = true;
        this.presentarRecomendacionesL();
      },
      mostrarRecomendacionesP(){
        this.showModal3 = true;
        this.presentarRecomendacionesP();
      },
      obtenerPortada(book){
          return `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
      },
      obtenerImagen(programa){
        if(programa.show.image.medium != null){
          return "programa.show.image.medium";
        }else{
          return '';
        }
      },
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
  max-width: 1000px;
  text-align: center;
  align-items: center;
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
.table-container { 
  max-height: 400px; 
  /* Ajusta esta altura según tus necesidades */ 
  overflow-y: auto; 
}

.text-danger {
  color: red;
}

.text-success {
color: green;
}

.table2 { 
  width: 100%; 
  border-collapse: collapse; 
} 
th, td { 
  border: 1px solid #dddddd; 
  padding: 8px; 
} 
th { 
  text-align: center; 
}

</style>