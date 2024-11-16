const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarreraRepository');
const { isLoggedIn } = require('../lib/auth');
// Endpoint para mostrar todas las carreras
router.get('/',  isLoggedIn, async (request, response) => {
    try {
        const carreras = await queries.obtenerTodasLasCarreras();
        response.render('carreras/listado', { carreras }); // Mostramos el listado de carreras
    } catch (error) {
        console.error('Error al obtener las carreras:', error);
        response.status(500).send('Error al obtener las carreras');
    }
});

// Endpoint que permite mostrar el formulario para agregar una nueva carrera
router.get('/agregar', isLoggedIn, (request, response) => {
    response.render('carreras/agregar');
});

// Endpoint para agregar una carrera
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { idcarrera, carrera } = request.body;
    const nuevaCarrera = { idcarrera, carrera };
    try {
        const resultado = await queries.insertarCarrera(nuevaCarrera);
        if (resultado) {
            request.flash('success', 'Registro insertado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al guardar el registro');
        }
    } catch (error) {
        console.error('Error al insertar la carrera:', error);
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/carreras');
});

// Endpoint que permite mostrar el formulario para editar una carrera
router.get('/editar/:idcarrera', isLoggedIn, async (request, response) => {
    const { idcarrera } = request.params;
    try {
        const carrera = await queries.obtenerCarreraPorId(idcarrera);
        console.log('Datos de la carrera:', carrera); // Verifica los datos aquí
        response.render('carreras/editar', { carrera });
    } catch (error) {
        console.error('Error al obtener la carrera:', error);
        response.status(500).send('Error al obtener la carrera');
    }
});

// Endpoint para actualizar una carrera
router.post("/editar/:idcarrera", isLoggedIn, async (request, response) => {
    const { idcarrera } = request.params;
    const { carrera } = request.body;
    try {
      await queries.actualizarCarrera(idcarrera, carrera);
      request.flash('success', 'Carrera actualizada con éxito');
      response.redirect("/carreras");
    } catch (error) {
      console.error("Error al actualizar la carrera:", error);
      request.flash('error', 'Ocurrió un problema al actualizar la carrera');
      response.status(500).redirect("/carreras");
    }
  });

// Endpoint para eliminar una carrera
router.get('/eliminar/:idcarrera', isLoggedIn, async (request, response) => {
    const { idcarrera } = request.params;
    try {
        console.log(`Recibido idcarrera para eliminar: ${idcarrera}`);
        const resultado = await queries.eliminarCarrera(idcarrera);
        console.log(`Resultado de eliminación para id: ${idcarrera}`, resultado);
        if (resultado) {
            request.flash('success', 'Eliminación correcta');
        } else {
            request.flash('error', 'Error al eliminar');
        }
        response.redirect('/carreras');
    } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        request.flash('error', 'Ocurrió un problema al eliminar la carrera');
        response.redirect('/carreras');
    }
});
module.exports = router;
