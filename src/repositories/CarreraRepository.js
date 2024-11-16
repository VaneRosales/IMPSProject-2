const pool = require('../config/databaseController');

module.exports = {
    obtenerTodasLasCarreras: async () => {
        try {
            const result = await pool.query('SELECT * FROM carreras');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de carreras: ', error);
            throw error;
        }
    },
    obtenerCarreraPorId: async (idcarrera) => {
    try {
        const [result] = await pool.query('SELECT * FROM carreras WHERE idcarrera = ?', [idcarrera]);
        console.log('Resultado de la consulta:', result); // Verifica los datos aquí
        return result[0]; // Asegúrate de devolver el primer elemento del array
    } catch (error) {
        console.error('Ocurrió un problema al consultar la carrera: ', error);
        throw error;
    }
},
    eliminarCarrera: async (idcarrera) => {
    try {
        console.log(`Intentando eliminar carrera con id: ${idcarrera}`);
        const result = await pool.query('DELETE FROM carreras WHERE idcarrera = ?', [idcarrera]);
        console.log(`Resultado de la eliminación:`, result);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar la carrera', error);
        throw error;
    }
},
    insertarCarrera: async (carrera) => {
        try {
            const result = await pool.query('INSERT INTO carreras SET ?', [carrera]);
            return result.affectedRows > 0; // Asegúrate de devolver un valor booleano
        } catch (error) {
            console.error('Error al insertar la carrera', error);
            throw error;
        }
    },

    actualizarCarrera: async (idcarrera, carrera) => {
        try {
            const result = await pool.query('UPDATE carreras SET ? WHERE idcarrera = ?', [carrera, idcarrera]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar el carrera', error);
            throw error;
        }
    }
};
