import { Router } from 'express'
import authRoutes from './auth.routes.js'
import especialidadesRoutes from './especialidades.routes.js'
import estadisticasRoutes from './estadisticas.routes.js'
import medicosRoutes from './medicos.routes.js'
import obrasSocialesRoutes from './obras_sociales.routes.js'
import pacientesRoutes from './pacientes.routes.js'
import turnosRoutes from './turnos.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/especialidades', especialidadesRoutes)
router.use('/obras-sociales', obrasSocialesRoutes)
router.use('/medicos', medicosRoutes)
router.use('/pacientes', pacientesRoutes)
router.use('/turnos', turnosRoutes)
router.use('/estadisticas', estadisticasRoutes)

export default router
