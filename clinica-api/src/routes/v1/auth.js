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
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Usuario o contraseña incorrectos",
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  authController.login.bind(authController),
);

export default router;
