import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicoList = ({ actualizar, setMedicoToEdit, setIsLoading, setError }) => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        setIsLoading(true);
        setLoading(true);
        const response = await axios.get('http://localhost:8080/medicos');
        setMedicos(response.data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar la lista de médicos');
        setMedicos([]);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchMedicos();
  }, [actualizar, setIsLoading, setError]);

  const eliminarMedico = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este médico?')) return;
    
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:8080/medicos/${id}`);
      setMedicos(prev => prev.filter(m => m.id !== id));
      setError(null);
      alert('Médico eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al eliminar el médico');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando médicos...</div>;

  return (
    <div className="list-container">
      <h2>Listado de Médicos</h2>
      {medicos.length === 0 ? (
        <p className="no-data">No hay médicos registrados</p>
      ) : (
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id}>
                  <td>{medico.nombre}</td>
                  <td>{medico.especialidad}</td>
                  <td>
                    <div>📧 {medico.correo}</div>
                    <div>📞 {medico.telefono}</div>
                  </td>
                  <td className="actions">
                    <button 
                      onClick={() => setMedicoToEdit(medico)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarMedico(medico.id)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
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

export default MedicoList;