import express from 'express'
import router from './src/routes/index.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())

// Routes
app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app
