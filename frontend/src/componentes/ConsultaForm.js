import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsultaForm = ({ onConsultaCreada, consultaToEdit, setConsultaToEdit, setIsLoading, setError }) => {
  const [consulta, setConsulta] = useState({
    fecha: '',
    motivo: '',
    pacienteId: '',
    medicoId: ''
  });

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  // Load patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pacientesRes, medicosRes] = await Promise.all([
          axios.get('http://localhost:8080/pacientes'),
          axios.get('http://localhost:8080/medicos')
        ]);
        setPacientes(pacientesRes.data);
        setMedicos(medicosRes.data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar datos iniciales');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading, setError]);

  // Load data for editing
  useEffect(() => {
    if (consultaToEdit) {
      setConsulta({
        fecha: consultaToEdit.fecha,
        motivo: consultaToEdit.motivo,
        pacienteId: consultaToEdit.paciente?.id || '',
        medicoId: consultaToEdit.medico?.id || ''
      });
    } else {
      setConsulta({ fecha: '', motivo: '', pacienteId: '', medicoId: '' });
    }
  }, [consultaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsulta(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const consultaData = {
        fecha: consulta.fecha,
        motivo: consulta.motivo,
        paciente: { id: consulta.pacienteId },
        medico: { id: consulta.medicoId }
      };

      if (consultaToEdit) {
        // Update existing consultation
        await axios.put(`http://localhost:8080/consultas/${consultaToEdit.id}`, consultaData);
        alert('Consulta actualizada correctamente');
      } else {
        // Create new consultation
        await axios.post('http://localhost:8080/consultas', consultaData);
        alert('Consulta creada correctamente');
      }
      
      // Reset form and trigger update
      setConsulta({ fecha: '', motivo: '', pacienteId: '', medicoId: '' });
      setConsultaToEdit(null);
      onConsultaCreada();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setConsulta({ fecha: '', motivo: '', pacienteId: '', medicoId: '' });
    setConsultaToEdit(null);
    setError(null);
  };

  return (
    <div className="form-container">
      <h2>{consultaToEdit ? 'Editar Consulta' : 'Agregar Nueva Consulta'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={consulta.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Motivo:</label>
          <input
            type="text"
            name="motivo"
            placeholder="Ej: Gripa"
            value={consulta.motivo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Paciente:</label>
          <select
            name="pacienteId"
            value={consulta.pacienteId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un paciente</option>
            {pacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Médico:</label>
          <select
            name="medicoId"
            value={consulta.medicoId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un médico</option>
            {medicos.map(medico => (
              <option key={medico.id} value={medico.id}>
                {medico.nombre} ({medico.especialidad})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {consultaToEdit ? 'Actualizar Consulta' : 'Registrar Consulta'}
          </button>
          {consultaToEdit && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ConsultaForm;