<template>
  <div class="container">
    <div class="wrapper">
      <form class="form-signin" @submit.prevent="login">       
        <h2 class="form-signin-heading text-center">Ingrese sus datos</h2>
        <input type="text" class="form-control" v-model="email" placeholder="Correo electrónico" required autofocus />
        <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required />
        <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button><br><br>
        <h5 class="text-center">¿No tienes una cuenta?</h5>
        <button class="btn btn-lg btn-primary btn-block" @click="signup">¡Regístrate!</button>
        <p v-if="error" class="text-danger text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '' // Mensaje de error si la autenticación falla
    };
  },
  methods: {
    async login() {
      // Validar si los campos están vacíos
      if (!this.email || !this.password) {
        this.error = 'Por favor llena todos los campos'; // Mostrar error si están vacíos
        return;
      }

      try {
        // Crear el objeto con los datos de autenticación
        const data = {
          correo: this.email,
          contrasena: this.password
        };

        // Enviar solicitud de autenticación al backend
        const response = await axios.post('http://localhost:8080/cliente/login', data);

        // Verificar si la autenticación fue exitosa
        if (response.status === 200 && response.data.success) {
          this.error = '';
          localStorage.setItem("isAuthenticated", "true"); // Guarda el estado de autenticación
          localStorage.setItem("userId", response.data.userId); // Guarda el userId en localStorage
          
          // Guarda el rol en localStorage y redirige a la página correspondiente
          const rol = response.data.rol;
          if (rol === 2) {
            localStorage.setItem("userRole", "admin");
            this.$router.push({ name: 'PaginaAdminView' }); // Redirigir a la vista de administrador
          } else if (rol === 1) {
            localStorage.setItem("userRole", "user");
            this.$router.push({ name: 'PaginaUsuarioView' }); // Redirigir a la vista de usuario
          }
        } else {
          this.error = 'Correo o contraseña incorrectos';
        }
      } catch (error) {
        this.error = 'Error al conectar con el servidor.';
      }
    },

    signup() {
      this.$router.push('/signup');
    }
  }
};
</script>

<style>
  body {
    background: #eee !important;	
  }

  .wrapper {	
    margin-top: 80px;
    margin-bottom: 80px;
  }

  .form-signin {
    max-width: 380px;
    padding: 15px 35px 45px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.1); 
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1); /* Añadir sombra */
    border-radius: 10px; /* Bordes redondeados */
  }

  .form-signin-heading,
  .checkbox {
    margin-bottom: 30px;
  }

  .checkbox {
    font-weight: normal;
  }

  .form-control {
    position: relative;
    font-size: 16px;
    height: auto;
    padding: 10px;
    box-sizing: border-box; /* Usar directamente box-sizing */
    width: 100%; /* Asegurar que el input ocupe todo el ancho */
    margin-bottom: 10px; /* Añadir espacio entre los inputs */
  }

  input[type="text"],
  input[type="password"] {
    margin-bottom: -1px;
    border-radius: 4px;
  }

  input[type="password"] {
    margin-bottom: 20px;
  }

  button {
    width: 100%; /* Asegurar que el botón ocupe todo el ancho */
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background-color: #007bff; /* Color azul */
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3; /* Efecto hover */
  }

  /* Clase para centrar texto */
  .text-center {
    text-align: center;
  }
</style>