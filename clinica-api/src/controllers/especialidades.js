import { EspecialidadesService } from "../services/especialidades.js";

const service = new EspecialidadesService();

export class EspecialidadesController {
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, activo } = req.body;
      const actualizada = await service.update(id, { nombre, activo });
      if (!actualizada)
        return res.status(404).json({ mensaje: "Especialidad no encontrada" });
      res.json(actualizada);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async browse(req, res) {
        try {
          const respuestas = await service.browse()
          res.json(respuestas)
    }
    catch (err) {
      res.status(500).json({ message: err.message });
    }
   }
 async findById(req,res){
  try{
      const id = parseInt(req.params.id);
      const especialidadEncontrada = await service.readById(id)

      if(!especialidadEncontrada){
        return res.status(404).json({message: 'No se encontro especialidad con el id solicitado'})
        
      } 
      res.json(especialidadEncontrada)
      


  } catch(error){
    res.status(500).json({message: err.message})
  }
 }
}