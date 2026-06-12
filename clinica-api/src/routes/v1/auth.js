import { Router } from "express";
import passport from "passport";
import authController from "../../controllers/auth.js";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasenia]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               contrasenia:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno
 */
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  authController.login.bind(authController),
);

export default router;
