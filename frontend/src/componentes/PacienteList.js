import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PacienteList = ({ actualizar, setPacienteToEdit }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/pacientes');
        setPacientes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar pacientes');
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [actualizar]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este paciente?')) {
      try {
        await axios.delete(`http://localhost:8080/pacientes/${id}`);
        alert('Paciente eliminado');
        setPacientes(pacientes.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
        alert('Error al eliminar paciente');
      }
    }
  };

  if (loading) return <div className="loading">Cargando pacientes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-container">
      <h2>Pacientes Registrados</h2>
      {pacientes.length === 0 ? (
        <p>No hay pacientes registrados</p>
      ) : (
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.documento}</td>
                  <td>📞{p.telefono}</td>
                  <td className="actions">
                    <button 
                      onClick={() => setPacienteToEdit(p)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
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

export default PacienteList;