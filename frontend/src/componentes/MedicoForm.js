import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicoForm = ({ onMedicoCreado, medicoToEdit, setMedicoToEdit, setIsLoading, setError }) => {
  const [medico, setMedico] = useState({
    nombre: '',
    especialidad: '',
    correo: '',
    telefono: ''
  });

  // Load data for editing
  useEffect(() => {
    if (medicoToEdit) {
      setMedico({
        nombre: medicoToEdit.nombre,
        especialidad: medicoToEdit.especialidad,
        correo: medicoToEdit.correo,
        telefono: medicoToEdit.telefono
      });
    } else {
      setMedico({ nombre: '', especialidad: '', correo: '', telefono: '' });
    }
  }, [medicoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedico(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (medicoToEdit) {
        // Update existing doctor
        await axios.put(`http://localhost:8080/medicos/${medicoToEdit.id}`, medico);
        alert('Médico actualizado correctamente');
      } else {
        // Create new doctor
        await axios.post('http://localhost:8080/medicos', medico);
        alert('Médico creado correctamente');
      }
      
      // Reset form and trigger update
      setMedico({ nombre: '', especialidad: '', correo: '', telefono: '' });
      setMedicoToEdit(null);
      onMedicoCreado(); // Esto disparará la actualización de la lista
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setMedico({ nombre: '', especialidad: '', correo: '', telefono: '' });
    setMedicoToEdit(null);
    setError(null);
  };

  return (
    <div className="form-container">
      <h2>{medicoToEdit ? 'Editar Médico' : 'Agregar Nuevo Médico'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej: Dr. Juan Pérez"
            value={medico.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Especialidad:</label>
          <input
            type="text"
            name="especialidad"
            placeholder="Ej: Cardiología"
            value={medico.especialidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="correo"
            placeholder="Ej: jperez@clinica.com"
            value={medico.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            placeholder="Ej: +51 987654321"
            value={medico.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {medicoToEdit ? 'Actualizar Médico' : 'Registrar Médico'}
          </button>
          {medicoToEdit && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MedicoForm;