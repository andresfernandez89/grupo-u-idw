export function obraSocialCreate(body) {
  return {
    nombre: body?.nombre?.trim(),
    descripcion: body?.descripcion?.trim() || null,
    porcentaje_descuento: parseFloat(body?.porcentaje_descuento),
    es_particular: body?.es_particular ? 1 : 0,
  };
}

export function obraSocialResponse(os) {
  if (!os) return null;

  return {
    id: os.id_obra_social,
    nombre: os.nombre,
    descripcion: os.descripcion,
    porcentaje_descuento: parseFloat(os.porcentaje_descuento),
    es_particular: Boolean(os.es_particular),
  };
}
