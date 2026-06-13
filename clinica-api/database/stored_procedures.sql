DELIMITER $$

DROP PROCEDURE IF EXISTS sp_estadisticas_por_obra_social$$
CREATE PROCEDURE sp_estadisticas_por_obra_social(
    IN p_fecha_desde DATETIME,
    IN p_fecha_hasta DATETIME
)
BEGIN
    SELECT
        os.id_obra_social,
        os.nombre                                                               AS obra_social,
        os.es_particular,
        COUNT(tr.id_turno_reserva)                                              AS total_turnos,
        COALESCE(SUM(tr.atentido), 0)                                           AS turnos_atendidos,
        COUNT(tr.id_turno_reserva) - COALESCE(SUM(tr.atentido), 0)             AS turnos_pendientes,
        ROUND(SUM(CASE WHEN tr.atentido = 1 THEN tr.valor_total ELSE 0 END), 2) AS ingresos_realizados,
        ROUND(
            IF(COUNT(tr.id_turno_reserva) > 0,
               (COALESCE(SUM(tr.atentido), 0) / COUNT(tr.id_turno_reserva)) * 100,
               0),
            2
        )                                                                       AS porcentaje_atencion
    FROM obras_sociales os
    LEFT JOIN turnos_reservas tr ON os.id_obra_social = tr.id_obra_social
                                AND tr.activo = 1
                                AND (p_fecha_desde IS NULL OR tr.fecha_hora >= p_fecha_desde)
                                AND (p_fecha_hasta IS NULL OR tr.fecha_hora <= p_fecha_hasta)
    WHERE os.activo = 1
    GROUP BY os.id_obra_social, os.nombre, os.es_particular
    ORDER BY total_turnos DESC;
END$$


DROP PROCEDURE IF EXISTS sp_estadisticas_por_medico$$
CREATE PROCEDURE sp_estadisticas_por_medico(
    IN p_fecha_desde DATETIME,
    IN p_fecha_hasta DATETIME
)
BEGIN
    SELECT
        m.id_medico,
        CONCAT(u.apellido, ', ', u.nombres)                                       AS medico,
        e.nombre                                                                   AS especialidad,
        COUNT(tr.id_turno_reserva)                                                AS total_turnos,
        COALESCE(SUM(tr.atentido), 0)                                             AS turnos_atendidos,
        COUNT(tr.id_turno_reserva) - COALESCE(SUM(tr.atentido), 0)               AS turnos_pendientes,
        ROUND(SUM(CASE WHEN tr.atentido = 1 THEN tr.valor_total ELSE 0 END), 2)  AS ingresos_realizados,
        ROUND(
            IF(COUNT(tr.id_turno_reserva) > 0,
               (COALESCE(SUM(tr.atentido), 0) / COUNT(tr.id_turno_reserva)) * 100,
               0),
            2
        )                                                                          AS porcentaje_atencion
    FROM medicos m
    JOIN usuarios u ON m.id_usuario = u.id_usuario AND u.activo = 1
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad AND e.activo = 1
    LEFT JOIN turnos_reservas tr ON m.id_medico = tr.id_medico
                                AND tr.activo = 1
                                AND (p_fecha_desde IS NULL OR tr.fecha_hora >= p_fecha_desde)
                                AND (p_fecha_hasta IS NULL OR tr.fecha_hora <= p_fecha_hasta)
    GROUP BY m.id_medico, medico, especialidad
    ORDER BY total_turnos DESC;
END$$

DROP PROCEDURE IF EXISTS sp_estadisticas_por_especialidad$$
CREATE PROCEDURE sp_estadisticas_por_especialidad(
    IN p_fecha_desde DATETIME,
    IN p_fecha_hasta DATETIME
)
BEGIN
    SELECT
        e.id_especialidad,
        e.nombre                                                                   AS especialidad,
        COUNT(DISTINCT m.id_medico)                                               AS total_medicos,
        COUNT(tr.id_turno_reserva)                                                AS total_turnos,
        COALESCE(SUM(tr.atentido), 0)                                             AS turnos_atendidos,
        COUNT(tr.id_turno_reserva) - COALESCE(SUM(tr.atentido), 0)               AS turnos_pendientes,
        ROUND(SUM(CASE WHEN tr.atentido = 1 THEN tr.valor_total ELSE 0 END), 2)  AS ingresos_realizados,
        ROUND(
            IF(COUNT(tr.id_turno_reserva) > 0,
               (COALESCE(SUM(tr.atentido), 0) / COUNT(tr.id_turno_reserva)) * 100,
               0),
            2
        )                                                                          AS porcentaje_atencion
    FROM especialidades e
    LEFT JOIN medicos m ON e.id_especialidad = m.id_especialidad
    LEFT JOIN turnos_reservas tr ON m.id_medico = tr.id_medico
                                AND tr.activo = 1
                                AND (p_fecha_desde IS NULL OR tr.fecha_hora >= p_fecha_desde)
                                AND (p_fecha_hasta IS NULL OR tr.fecha_hora <= p_fecha_hasta)
    WHERE e.activo = 1
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY total_turnos DESC;
END$$

DROP PROCEDURE IF EXISTS sp_resumen_general_turnos$$
CREATE PROCEDURE sp_resumen_general_turnos(
    IN p_fecha_desde DATETIME,
    IN p_fecha_hasta DATETIME
)
BEGIN
    SELECT
        COUNT(tr.id_turno_reserva)                                                AS total_turnos,
        COALESCE(SUM(tr.atentido), 0)                                             AS turnos_atendidos,
        COUNT(tr.id_turno_reserva) - COALESCE(SUM(tr.atentido), 0)               AS turnos_pendientes,
        ROUND(SUM(CASE WHEN tr.atentido = 1 THEN tr.valor_total ELSE 0 END), 2)  AS ingresos_realizados,
        ROUND(
            IF(COUNT(tr.id_turno_reserva) > 0,
               (COALESCE(SUM(tr.atentido), 0) / COUNT(tr.id_turno_reserva)) * 100,
               0),
            2
        )                                                                          AS porcentaje_atencion,
        COUNT(DISTINCT tr.id_paciente)                                            AS total_pacientes,
        COUNT(DISTINCT tr.id_medico)                                              AS total_medicos,
        COUNT(DISTINCT tr.id_obra_social)                                         AS total_obras_sociales
    FROM turnos_reservas tr
    WHERE tr.activo = 1
      AND (p_fecha_desde IS NULL OR tr.fecha_hora >= p_fecha_desde)
      AND (p_fecha_hasta IS NULL OR tr.fecha_hora <= p_fecha_hasta);
END$$

DELIMITER ;
