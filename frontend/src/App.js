import React, { useState, useEffect } from 'react';
import PacienteForm from './componentes/PacienteForm';
import PacienteList from './componentes/PacienteList';
import MedicoForm from './componentes/MedicoForm';
import MedicoList from './componentes/MedicoList';
import ConsultaForm from './componentes/ConsultaForm';
import ConsultaList from './componentes/ConsultaList';
import './App.css';

function App() {
  const [recargarPacientes, setRecargarPacientes] = useState(false);
  const [recargarMedicos, setRecargarMedicos] = useState(false);
  const [recargarConsultas, setRecargarConsultas] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('pacientes');
  const [pacienteToEdit, setPacienteToEdit] = useState(null);
  const [medicoToEdit, setMedicoToEdit] = useState(null);
  const [consultaToEdit, setConsultaToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset edit states when changing sections
  useEffect(() => {
    setPacienteToEdit(null);
    setMedicoToEdit(null);
    setConsultaToEdit(null);
    setError(null);
  }, [seccionActiva]);

  const actualizarPacientes = () => {
    setRecargarPacientes(prev => !prev);
  };

  const actualizarMedicos = () => {
    setRecargarMedicos(prev => !prev);
  };

  const actualizarConsultas = () => {
    setRecargarConsultas(prev => !prev);
  };

  const handleSectionChange = (section) => {
    setError(null);
    setSeccionActiva(section);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sistema de Gestión Médica</h1>
        <nav className="app-nav">
          <button 
            className={`nav-btn ${seccionActiva === 'pacientes' ? 'active' : ''}`}
            onClick={() => handleSectionChange('pacientes')}
          >
            <i className="fas fa-user-injured"></i> Pacientes
          </button>
          <button 
            className={`nav-btn ${seccionActiva === 'medicos' ? 'active' : ''}`}
            onClick={() => handleSectionChange('medicos')}
          >
            <i className="fas fa-user-md"></i> Médicos
          </button>
          <button 
            className={`nav-btn ${seccionActiva === 'consultas' ? 'active' : ''}`}
            onClick={() => handleSectionChange('consultas')}
          >
            <i className="fas fa-calendar-check"></i> Consultas
          </button>
        </nav>
      </header>

      <main className="app-main">
        {isLoading && (
          <div className="alert alert-loading">
            <i className="fas fa-spinner fa-spin"></i> Cargando...
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {seccionActiva === 'pacientes' && (
          <section className="seccion fade-in">
            <h2>
              <i className="fas fa-user-injured"></i> Gestión de Pacientes
              {pacienteToEdit && <span> - Editar Paciente</span>}
            </h2>
            <div className="formulario-lista">
              <PacienteForm 
                onPacienteCreado={actualizarPacientes}
                pacienteToEdit={pacienteToEdit}
                setPacienteToEdit={setPacienteToEdit}
                setIsLoading={setIsLoading}
                setError={setError}
              />
              <PacienteList 
                actualizar={recargarPacientes}
                setPacienteToEdit={setPacienteToEdit}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            </div>
          </section>
        )}

        {seccionActiva === 'medicos' && (
          <section className="seccion fade-in">
            <h2>
              <i className="fas fa-user-md"></i> Gestión de Médicos
              {medicoToEdit && <span> - Editar Médico</span>}
            </h2>
            <div className="formulario-lista">
              <MedicoForm 
                onMedicoCreado={actualizarMedicos}
                medicoToEdit={medicoToEdit}
                setMedicoToEdit={setMedicoToEdit}
                setIsLoading={setIsLoading}
                setError={setError}
              />
              <MedicoList 
                actualizar={recargarMedicos}
                setMedicoToEdit={setMedicoToEdit}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            </div>
          </section>
        )}

        {seccionActiva === 'consultas' && (
          <section className="seccion fade-in">
            <h2>
              <i className="fas fa-calendar-check"></i> Gestión de Consultas
              {consultaToEdit && <span> - Editar Consulta</span>}
            </h2>
            <div className="formulario-lista">
              <ConsultaForm 
                onConsultaCreada={actualizarConsultas}
                consultaToEdit={consultaToEdit}
                setConsultaToEdit={setConsultaToEdit}
                setIsLoading={setIsLoading}
                setError={setError}
              />
              <ConsultaList 
                actualizar={recargarConsultas}
                setConsultaToEdit={setConsultaToEdit}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Sistema de Gestión Médica &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;