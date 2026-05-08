import {
  especialidadesCreate,
  especialidadesResponse,
} from "../dtos/especialidades.dto.js";

import especialidadService from "../services/especialidades.js";

export class EspecialidadesController {
  async create(req, res) {
    try {
      const datos = especialidadesCreate(req.body);
      const nuevaEspecialidad = await especialidadService.create(datos.nombre);

      return res.status(201).json({
        success: true,
        message: "Especialidad creada exitosamente",
        data: especialidadesResponse(nuevaEspecialidad),
      });
    } catch (error) {
      if (error.message.includes("ya está registrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, activo } = req.body;
      const actualizada = await especialidadService.update(id, {
        nombre,
        activo,
      });
      if (!actualizada)
        return res.status(404).json({ mensaje: "Especialidad no encontrada" });
      res.json(actualizada);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async browse(req, res) {
        try {
          const respuestas = await especialidadService.browse()
          res.json(respuestas)
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
   }
 async findById(req,res){
  try{
      const id = parseInt(req.params.id);
      const especialidadEncontrada = await especialidadService.readById(id)

      if(!especialidadEncontrada){
        return res.status(404).json({message: 'No se encontro especialidad con el id solicitado'})
        
      } 
      res.json(especialidadEncontrada)     

  } catch(error){
    res.status(500).json({message: error.message})
  }
 }


  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await especialidadService.delete(id);

      if (deleted === null) {
        return res
          .status(404)
          .json({ success: false, message: "Especialidad no encontrada" });
      }

      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar la especialidad",
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new EspecialidadesController();
