import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConsultaList = ({ actualizar, setConsultaToEdit, setIsLoading, setError }) => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/consultas');
        setConsultas(response.data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar la lista de consultas');
        setConsultas([]);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchConsultas();
  }, [actualizar, setIsLoading, setError]);

  const eliminarConsulta = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta consulta?')) return;

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8080/consultas/${id}`);
      setConsultas(prev => prev.filter(c => c.id !== id));
      setError(null);
      alert('Consulta eliminada correctamente');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar la consulta');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando consultas...</div>;

  return (
    <div className="list-container">
      <h2>Listado de Consultas</h2>
      {consultas.length === 0 ? (
        <p className="no-data">No hay consultas registradas</p>
      ) : (
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Diagnóstico</th>
                <th>Tratamiento</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((consulta) => (
                <tr key={consulta.id}>
                  <td>{new Date(consulta.fecha).toLocaleDateString()}</td>
                  <td>{consulta.hora}</td>
                  <td>{consulta.motivo}</td>
                  <td>{consulta.diagnostico}</td>
                  <td>{consulta.tratamiento}</td>
                  <td>{consulta.paciente?.nombre || 'No especificado'}</td>
                  <td>
                    {consulta.medico?.nombre || 'No asignado'}
                    {consulta.medico?.especialidad && ` (${consulta.medico.especialidad})`}
                  </td>
                  <td className="actions">
                    <button onClick={() => setConsultaToEdit(consulta)} className="btn-edit">Editar</button>
                    <button onClick={() => eliminarConsulta(consulta.id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultaList;
