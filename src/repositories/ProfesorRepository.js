const pool = require('../config/databaseController');

module.exports = {
    obtenerTodosLosProfesores: async () => {
        try {
            const result = await pool.query('SELECT * FROM profesores');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de profesores: ', error);
            throw error;
        }
    },

    obtenerProfesorPorId: async (idprofesor) => {
        try {
            const [result] = await pool.query('SELECT * FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result[0]; // Asegúrate de devolver el primer elemento del array
        } catch (error) {
            console.error('Ocurrió un problema al consultar el profesor: ', error);
            throw error;
        }
    },

    eliminarProfesor: async (idprofesor) => {
        try {
            const result = await pool.query('DELETE FROM profesores WHERE idprofesor = ?', [idprofesor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el profesor', error);
            throw error;
        }
    },

    insertarProfesor: async (profesor) => {
        try {
            const result = await pool.query('INSERT INTO profesores SET ?', [profesor]);
            return result.affectedRows > 0; // Asegúrate de devolver un valor booleano
        } catch (error) {
            console.error('Error al insertar el profesor', error);
            throw error;
        }
    },

    actualizarProfesor: async (idprofesor, profesor) => {
        try {
            const result = await pool.query('UPDATE profesores SET ? WHERE idprofesor = ?', [profesor, idprofesor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el profesor', error);
            throw error;
        }
    }
};
