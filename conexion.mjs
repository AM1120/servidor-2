import pkg from 'pg'; // Importar todo el paquete 'pg'
import 'dotenv/config'; // Cargar variables de entorno

const { Pool } = pkg; // Extraer 'Pool' del paquete importado

// Configuración de la conexión a la base de datos
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Puerto por defecto de PostgreSQL
    max: 20, // Número máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    ssl: {
        rejectUnauthorized: false // Solo en desarrollo. En producción, configura esto correctamente.
    }
};

// Crear un nuevo pool de conexiones
const pool = new Pool(dbConfig);

pool.connect()
    .then(client => {
        console.log('Conectado a PostgreSQL');
        client.release(); // Liberar el cliente después de la conexión
    })
    .catch(err => console.error('Error al conectar a la base de datos:', err));

// Exportar el pool para usarlo en otros archivos
export { pool };
