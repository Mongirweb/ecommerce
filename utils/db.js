// import mongoose from "mongoose";

// const MONGODB_URI = process.env.DATABASE_URL;

// if (!MONGODB_URI) {
//   throw new Error(
//     'Por favor, define la variable de entorno "DATABASE_URL" en tu entorno de ejecución.'
//   );
// }

// // Puedes agregar parámetros de timeout si tu URI no los tiene ya
// // Ejemplo (si tu URI no tiene estos parámetros, añádelos):
// // mongodb+srv://usuario:pass@cluster.mongodb.net/mydb?retryWrites=true&w=majority&connectTimeoutMS=20000&socketTimeoutMS=20000
// //
// // Si tu MONGODB_URI ya está definida sin estos parámetros, puedes agregarlos manualmente:
// const uriWithTimeouts = MONGODB_URI.includes("connectTimeoutMS")
//   ? MONGODB_URI
//   : `${MONGODB_URI}${
//       MONGODB_URI.includes("?") ? "&" : "?"
//     }connectTimeoutMS=20000&socketTimeoutMS=20000`;

// // Caché global para evitar múltiples conexiones en desarrollo
// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDb() {
//   if (cached.conn) {
//     // Conexión ya establecida previamente
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     console.log("Conectando a la base de datos..");

//     cached.promise = mongoose
//       .connect(uriWithTimeouts, opts)
//       .then((mongoose) => {
//         console.log("Base de datos conectada correctamente.");
//         return mongoose;
//       })
//       .catch((err) => {
//         console.error("Error al conectar con la base de datos:", err);
//         throw err;
//       });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     console.error("Error de conexión (reintentando en futuros requests):", e);
//     throw e;
//   }

//   return cached.conn;
// }

// // Función opcional para desconectar la DB
// async function disconnectDb() {
//   if (mongoose.connection.readyState === 1) {
//     // En producción normalmente no querrás desconectar
//     if (process.env.NODE_ENV === "production") {
//       console.log("No se desconecta en producción.");
//     } else {
//       console.log("No se desconecta en desarrollo.");
//     }
//   }
// }

// const db = { connectDb, disconnectDb };
// export default db;

import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable not defined.");
  throw new Error("Please define the MONGODB_URI environment variable.");
}

// Global cache to prevent multiple connections in development mode
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Configuration to manage connection pooling and timeouts
const options = {
  bufferCommands: false,
  maxPoolSize: 1,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000, // Fail fast if no server is found
  socketTimeoutMS: 30000, // Socket idle timeout
  heartbeatFrequencyMS: 10000, // Ping server every 10 seconds
  maxIdleTimeMS: 10000, // Reap idle connections after 10 seconds
  waitQueueTimeoutMS: 5000, // Timeout for connection queue
};

async function connectDb() {
  // Use existing connection if it's already established
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  // Wait for an in-progress connection if one exists
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // Create a new connection if none exist
  console.info("MongoDB: Initiating a new connection...");

  cached.promise = mongoose
    .connect(MONGODB_URI, options)
    .then((mongooseInstance) => {
      console.info("MongoDB: Successfully connected.");
      return mongooseInstance;
    })
    .catch((err) => {
      console.error(`MongoDB: Connection error - ${err.message}`);
      cached.promise = null;
      throw err;
    });

  cached.conn = await cached.promise;
  return cached.conn;
}

async function disconnectDb() {
  if (mongoose.connection.readyState === 1) {
    // En producción normalmente no querrás desconectar
    if (process.env.NODE_ENV === "production") {
      console.log("No se desconecta en producción.");
    } else {
      console.log("No se desconecta en desarrollo.");
    }
  }
}

const db = { connectDb, disconnectDb };
export default db;
