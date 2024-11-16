const mysql = require('mysql2');
const { database } = require('./keys');
const { promisify } = require('util');

// Crear un pool de conexiones
const pool = mysql.createPool(database);

// Verificar la conexión a la base de datos
pool.getConnection((err, conexion) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión con la base de datos fue cerrada.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene muchas conexiones.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión con la base de datos fue rechazada.');
        }
        return;
    }

    if (conexion) {
        console.log('Conexión establecida con la base de datos');
        conexion.release();
    }
    return;
});

// Configurando promisify para permitir en cada consulta un async/await (promesas)
pool.query = promisify(pool.query);

module.exports = pool;