const pool = require('../config/databaseController');

module.exports = {
    obtenerTodosLosEstudiantes: async () => {
        try {
            const result = await pool.query('SELECT * FROM estudiantes');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de estudiantes: ', error);
            throw error;
        }
    },

    obtenerEstudiantePorId: async (idestudiante) => {
        try {
            const [result] = await pool.query('SELECT * FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar el estudiante: ', error);
            throw error;
        }
    },

    eliminarEstudiante: async (idestudiante) => {
        try {
            const result = await pool.query('DELETE FROM estudiantes WHERE idestudiante = ?', [idestudiante]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el estudiante', error);
            throw error;
        }
    },

    insertarEstudiante: async (estudiante) => {
        try {
            const result = await pool.query('INSERT INTO estudiantes SET ?', [estudiante]);
            return result.affectedRows > 0; // Asegúrate de devolver un valor booleano
        } catch (error) {
            console.error('Error al insertar el estudiante', error);
            throw error;
        }
    },

    actualizarEstudiante: async (idestudiante, estudiante) => {
        try {
            const result = await pool.query('UPDATE estudiantes SET ? WHERE idestudiante = ?', [estudiante, idestudiante]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el estudiante', error);
            throw error;
        }
    }
};