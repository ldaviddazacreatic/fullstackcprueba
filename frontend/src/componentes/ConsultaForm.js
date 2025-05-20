import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsultaForm = ({ onConsultaCreada, consultaToEdit, setConsultaToEdit, setIsLoading, setError }) => {
  const [consulta, setConsulta] = useState({
    fecha: '',
    hora: '',
    motivo: '',
    diagnostico: '',
    tratamiento: '',
    pacienteId: '',
    medicoId: ''
  });

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

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

  useEffect(() => {
    if (consultaToEdit) {
      setConsulta({
        fecha: consultaToEdit.fecha,
        hora: consultaToEdit.hora || '',
        motivo: consultaToEdit.motivo,
        diagnostico: consultaToEdit.diagnostico || '',
        tratamiento: consultaToEdit.tratamiento || '',
        pacienteId: consultaToEdit.paciente?.id || '',
        medicoId: consultaToEdit.medico?.id || ''
      });
    } else {
      setConsulta({
        fecha: '',
        hora: '',
        motivo: '',
        diagnostico: '',
        tratamiento: '',
        pacienteId: '',
        medicoId: ''
      });
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
        hora: consulta.hora,
        motivo: consulta.motivo,
        diagnostico: consulta.diagnostico,
        tratamiento: consulta.tratamiento,
        paciente: { id: consulta.pacienteId },
        medico: { id: consulta.medicoId }
      };

      if (consultaToEdit) {
        await axios.put(`http://localhost:8080/consultas/${consultaToEdit.id}`, consultaData);
        alert('Consulta actualizada correctamente');
      } else {
        await axios.post('http://localhost:8080/consultas', consultaData);
        alert('Consulta creada correctamente');
      }

      setConsulta({
        fecha: '',
        hora: '',
        motivo: '',
        diagnostico: '',
        tratamiento: '',
        pacienteId: '',
        medicoId: ''
      });
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
    setConsulta({
      fecha: '',
      hora: '',
      motivo: '',
      diagnostico: '',
      tratamiento: '',
      pacienteId: '',
      medicoId: ''
    });
    setConsultaToEdit(null);
    setError(null);
  };

  return (
    <div className="form-container">
      <h2>{consultaToEdit ? 'Editar Consulta' : 'Agregar Nueva Consulta'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha:</label>
          <input type="date" name="fecha" value={consulta.fecha} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Hora:</label>
          <input type="time" name="hora" value={consulta.hora} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Motivo:</label>
          <input type="text" name="motivo" value={consulta.motivo} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Diagnóstico:</label>
          <textarea name="diagnostico" value={consulta.diagnostico} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Tratamiento:</label>
          <textarea name="tratamiento" value={consulta.tratamiento} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Paciente:</label>
          <select name="pacienteId" value={consulta.pacienteId} onChange={handleChange} required>
            <option value="">Seleccione un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Médico:</label>
          <select name="medicoId" value={consulta.medicoId} onChange={handleChange} required>
            <option value="">Seleccione un médico</option>
            {medicos.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.especialidad})</option>
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
