import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const APP_ID = process.env.REACT_APP_APP_ID;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

function App() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ Clientes: '' });
  const [cargando, setCargando] = useState(false);

  const fetchClientes = async () => {
    setCargando(true);
    try {
      const response = await fetch('/api/clientes');
      const data = await response.json();
      setClientes(data || []);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    } finally {
      setCargando(false);
    }
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.Clientes.trim()) return;

    setCargando(true);
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al agregar cliente:", errorText);
        return;
      }

      setNuevoCliente({ Clientes: '' });
      fetchClientes();
    } catch (err) {
      console.error("Error inesperado al agregar cliente:", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <h1>TW • Lista de Clientes</h1>
        <button className="cta" onClick={fetchClientes}>Actualizar</button>
      </header>

      {cargando ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <main className="content">
          <ul className="card-list">
            {clientes.map((c, i) => (
              <li key={i} className="card">
                📁 {c.Clientes}
              </li>
            ))}
          </ul>

          <div className="form">
            <input
              type="text"
              placeholder="Nombre del Cliente"
              value={nuevoCliente.Clientes}
              onChange={e => setNuevoCliente({ Clientes: e.target.value })} />
            <button onClick={agregarCliente}>Guardar</button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
