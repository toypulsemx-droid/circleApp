require('dotenv').config()
const app = require('./app')
const connectDB = require('./Config/connectDB')

const PORT = process.env.PORT || 5000

// Conectar a MongoDB
connectDB()


app.listen(PORT, '0.0.0.0',() => {
  console.log(`🚀 Servidor corriendo en ${PORT}`)
})