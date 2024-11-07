<template>
  <div class="container">
    <div class="wrapper">
      <form class="form-signin" @submit.prevent="signup">       
        <h2 class="form-signin-heading text-center">Ingrese sus datos</h2>
        <br><h6>Nombre*</h6>
        <input type="text" class="form-control" v-model="nombre" placeholder="Nombre" required autofocus />
        <br><h6>Apellido Paterno</h6>
        <input type="text" class="form-control" v-model="aPaterno" placeholder="Apellido Paterno" />
        <br><h6>Apellido Materno</h6>
        <input type="text" class="form-control" v-model="aMaterno" placeholder="Apellido Materno" />
        <br><h6>Correo Electrónico*</h6>
        <input type="text" class="form-control" v-model="email" placeholder="Correo Electrónico" required />
        <br><h6>Contraseña*</h6>
        <input type="password" class="form-control" v-model="password" placeholder="Contraseña" required />
        <button class="btn btn-lg btn-primary btn-block" type="submit">Registrarse</button>
        <p v-if="error" class="text-danger">{{ error }}</p>
        <p v-if="success" class="text-success">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importar axios

export default {
  data() {
    return {
      nombre: '',
      aPaterno: '',
      aMaterno: '',
      email: '',
      password: '',
      error: '', // Para mostrar errores
      success: '' // Para mostrar éxito
    }
  },
  methods: {
    async signup() {
      // Validar que los campos obligatorios estén completos
      if (!this.nombre || !this.email || !this.password) {
        this.error = 'Por favor, complete los campos obligatorios.';
        return;
      }

      // Crear el objeto con los datos a enviar
      const data = {
        nombre: this.nombre,
        apellidoPaterno: this.aPaterno || null, // No es obligatorio
        apellidoMaterno: this.aMaterno || null, // No es obligatorio
        correo: this.email,
        contrasena: this.password
      };

      try {
        // Enviar los datos al backend usando axios
        const response = await axios.post('http://localhost:8080/cliente/saveUser', data);
        
        // Verificar si la respuesta es un 200 (OK)
        if (response.status === 200) {
          this.success = 'Registro exitoso, redirigiendo...';
          this.error = '';
          setTimeout(() => this.$router.push('/'), 2000); // Redirigir después de un breve tiempo
        } else {
          this.error = 'Ocurrió un error durante el registro.';
        }
      } catch (error) {
        this.error = 'Error al conectar con el servidor.';
      }
    }
  }
}
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
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 10px;
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
    width: 100%;
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Mensaje de error */
  .text-danger {
    color: red;
  }

  .text-center {
    text-align: center;
  }
</style>