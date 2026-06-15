export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado. Debes iniciar sesión.",
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. No tenés permisos para esta operación.",
      });
    }

    next();
  };
}
