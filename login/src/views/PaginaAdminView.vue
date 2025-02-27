<template>
    <div class="page-container">
        <h1 class="welcome-message">Bienvenido Admin</h1>

        <div class="table-container">
            <table v-if="users.length" class="styled-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Correo</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id_cliente">
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.apellidoPaterno }}</td>
                        <td>{{ user.apellidoMaterno }}</td>
                        <td>{{ user.correo }}</td>
                        <td>
                            <img :src="`data:image/jpeg;base64,${user.imagen}`" alt="Imagen de usuario" v-if="user.imagen" class="user-image"/>
                            <img src="@/assets/usuario.jpg" alt="Imagen predeterminada"  v-else class="user-image"/>
                        </td>
                        <td>
                            <button @click="confirmDelete(user.correo)" class="button button-primary">Eliminar</button>
                            <button @click="openEditModal(user)" class="button button-secondary">Modificar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Cargando datos...</p>
        
            <!-- Botón para abrir el modal -->
            <button @click="toggleModal(true)" class="button button-primary">Registrar Usuario</button>

            <!-- Modal de confirmación de eliminación -->
            <div v-if="showDeleteModal" class="modal-overlay">
                <div class="modal-content">
                    <p>¿Estás seguro de que deseas eliminar al usuario con correo {{ userToDeleteEmail }}?</p>
                    <button @click="deleteUser" class="button button-delete">Eliminar Permanentemente</button>
                    <button @click="closeDeleteModal" class="button button-secondary">Cancelar</button>
                </div>
            </div>

            <!-- Modal de registro de usuario -->
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-content">
                    <h2 class="form-title">Registrar Usuario</h2>
                    <form @submit.prevent="registerUser">
                        <div v-for="field in fields" :key="field.model" class="form-group">
                            <input 
                                :type="field.type" 
                                v-model="newUser[field.model]" 
                                :placeholder="field.placeholder" 
                                :required="field.required" 
                            />
                        </div>
                        <input type="file" @change="onFileChange" accept="image/*" class="form-control" />
                        <div class="form-group">
                            <select v-model="newUser.rol" required>
                                <option value="1">Usuario</option>
                                <option value="2">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" class="button button-primary">Registrar</button>
                    </form>
                    <button @click="toggleModal(false)" class="button button-secondary">Cancelar</button>
                </div>
            </div>

            <!-- Modal de modificación de usuario -->
            <div v-if="showEditModal" class="modal-overlay">
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
                        <div class="form-group">
                            <select v-model="editUser.rol" required>
                                <option value="1">Usuario</option>
                                <option value="2">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" class="button button-primary">Modificar Permanentemente</button>
                    </form>
                    <button @click="closeEditModal" class="button button-secondary">Cancelar</button>
                </div>
            </div>

            <button @click="logout" class="button button-primary logout-button">Cerrar Sesión</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: [],
            newUser: this.getNewUserTemplate(),
            editUser: {}, // Objeto para almacenar datos del usuario en edición
            nimagen: '',
            vcorreo: '',
            vcontra: '',
            userData: '',
            mod: 0,
            showModal: false,
            showDeleteModal: false,
            showEditModal: false, // Controla la visibilidad del modal de edición
            userToDeleteEmail: null,
            fields: [
                { name: 'nombre', model: 'nombre', placeholder: 'Nombre', type: 'text', required: true },
                { name: 'apellidoPaterno', model: 'apellidoPaterno', placeholder: 'Apellido Paterno', type: 'text', required: false },
                { name: 'apellidoMaterno', model: 'apellidoMaterno', placeholder: 'Apellido Materno', type: 'text', required: false },
                { name: 'correo', model: 'correo', placeholder: 'Correo', type: 'email', required: true },
                { name: 'contrasena', model: 'contrasena', placeholder: 'Contraseña', type: 'password', required: true }
            ]
        };
    },
    watch: { 
        'editUser.contrasena'(newVal, oldVal) { 
            if (newVal !== this.originalContrasena) { 
                console.log('La contraseña ha sido modificada'); 
                this.mod = 1; 
            }
        }
    },
    async created() {
        this.fetchUsers();
    },
    methods: {
        onFileChange(event){
        const file = event.target.files[0];
        if(file){
          this.nimagen = file;
        }
      },
        getNewUserTemplate() {
            return {
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                correo: '',
                contrasena: '',
                rol: '1',
            };
        },
        async fetchUsers() {
            try {
                const response = await axios.get('http://localhost:8080/cliente/getAllUsers');
                this.users = response.data;
            } catch (error) {
                console.error('Error al obtener los datos de los usuarios:', error);
            }
        },
        async registerUser() {
            const dataN = new FormData();
            
            try {

                dataN.append('nombre', this.newUser.nombre);
                dataN.append('apellidoPaterno', this.newUser.apellidoPaterno);
                dataN.append('apellidoMaterno', this.newUser.apellidoMaterno);
                dataN.append('correo', this.newUser.correo);
                dataN.append('contrasena', this.newUser.contrasena);
                if(this.nimagen != null){
                    dataN.append('imagen', this.nimagen);
                }
                await axios.post('http://localhost:8080/cliente/saveUser', dataN);
                alert('Usuario registrado exitosamente');
                this.newUser = this.getNewUserTemplate();
                this.fetchUsers();
                this.toggleModal(false);
            } catch (error) {
                console.error('Error al registrar el usuario:', error);
            }
        },
        toggleModal(show) {
            this.showModal = show;
        },
        confirmDelete(userEmail) {
            this.userToDeleteEmail = userEmail;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.userToDeleteEmail = null;
        },
        async deleteUser() {
            try {
                await axios.delete(`http://localhost:8080/cliente/deleteUserByEmail`, { data: { correo: this.userToDeleteEmail } });
                alert('Usuario eliminado exitosamente');
                this.fetchUsers();
                this.closeDeleteModal();
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
            }
        },
        openEditModal(user) {
            this.editUser = { ...user }; // Copia los datos del usuario a editar
            this.vcorreo = this.editUser.correo;
            this.vcontra = this.editUser.contrasena;
            this.showEditModal = true;

        },
        async updateUser() {
            const dataN = new FormData();
            dataN.append('correon', this.editUser.correo);
            try {
                
                dataN.append('correo', this.vcorreo);
                dataN.append('nombre', this.editUser.nombre);
                dataN.append('apellidoPaterno', this.editUser.apellidoPaterno);
                dataN.append('apellidoMaterno', this.editUser.apellidoMaterno);
                dataN.append('contrasena', this.editUser.contrasena);
                dataN.append('rol', this.editUser.rol);
                if(this.nimagen){
                    dataN.append('imagen', this.nimagen);
                }else{
                    dataN.append('imagen', this.editUser.imagen);
                }

                if(this.vcontra != this.editUser.contrasena){
                    this.mod = 1;
                }else{
                    this.mod = 0;
                }
                // Utiliza el correo del usuario para hacer la solicitud de actualización
                await axios.put(`http://localhost:8080/cliente/updateUserByEmail`, dataN, {
                    headers:{
                        "modo": 1,
                        "mod": this.mod
                    }
                });
                /*alert('Usuario modificado exitosamente');
                this.fetchUsers();*/
                this.mod = 0;
                this.nimagen = '';
                this.closeEditModal();
            } catch (error) {
                console.error('Error al modificar el usuario:', error);
            }
        },
        closeEditModal() {
            this.showEditModal = false;
            this.editUser = {}; // Limpia el objeto editUser
        },
        logout() {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            this.$router.push('/');
        },
    },
};
</script>

<style scoped>
/* Fondo de la página */
.page-container {
    background-color: #d1e0f3;
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

.styled-table th, .styled-table td {
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

/* Botones */
.button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.button-primary {
    background-color: #5e79e8;
    color: #ffffff;
}

.button-primary:hover {
    background-color: #4c68c9;
}

.button-secondary {
    background-color: #95a5a6;
    color: #ffffff;
}

.button-secondary:hover {
    background-color: #7f8c8d;
}

.button-delete {
    background-color: #e74c3c;
    color: #ffffff;
}

.button-delete:hover {
    background-color: #c0392b;
}

/* Modal */
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

/* Estilo del formulario en el modal */
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
.user-image{
  width: 100px;
  height: auto;
  border-radius: 10px;
}
</style>