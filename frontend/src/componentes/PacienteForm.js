import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PacienteForm = ({ onPacienteCreado, pacienteToEdit, setPacienteToEdit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: ''
  });

  // Load data for editing
  useEffect(() => {
    if (pacienteToEdit) {
      setFormData({
        nombre: pacienteToEdit.nombre,
        documento: pacienteToEdit.documento,
        telefono: pacienteToEdit.telefono
      });
    }
  }, [pacienteToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (pacienteToEdit) {
        // Update existing patient
        await axios.put(`http://localhost:8080/pacientes/${pacienteToEdit.id}`, formData);
        alert('Paciente actualizado');
      } else {
        // Create new patient
        await axios.post('http://localhost:8080/pacientes', formData);
        alert('Paciente creado');
      }
      
      // Reset form and trigger update
      setFormData({ nombre: '', documento: '', telefono: '' });
      setPacienteToEdit(null);
      onPacienteCreado();
    } catch (err) {
      console.error(err);
      alert(`Error al ${pacienteToEdit ? 'actualizar' : 'guardar'} paciente`);
    }
  };

  return (
    <div className="form-container">
      <h2>{pacienteToEdit ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej: Luis Ortiz"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Documento:</label>
          <input
            type="text"
            name="documento"
            placeholder="Ej: 1987152738"
            value={formData.documento}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            placeholder="Ej: +57 3210000000"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {pacienteToEdit ? 'Actualizar' : 'Guardar'}
          </button>
          {pacienteToEdit && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => {
                setPacienteToEdit(null);
                setFormData({ nombre: '', documento: '', telefono: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PacienteForm;