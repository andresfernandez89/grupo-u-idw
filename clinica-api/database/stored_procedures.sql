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

DELIMITER ;
