import React, { useEffect, useState } from 'react';
import './App.css';

const APP_ID = '20abf7df-d6a5-4541-84c6-8de3d222048c';
const TABLE_NAME = 'Clientes';
const API_KEY = 'V2-hdaEj-Dbgh2-Duitu-zclj7-tAcKg-7hLWX-LoitX-MoCLL';

function App() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ Clientes: '' });
  const [cargando, setCargando] = useState(false);

  const fetchClientes = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${TABLE_NAME}/records`,
        {
          headers: {
            'ApplicationAccessKey': API_KEY,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al obtener clientes:", errorText);
        return;
      }

      const data = await response.json();
      setClientes(data.value || []);
    } catch (err) {
      console.error("Error inesperado al obtener clientes:", err);
    } finally {
      setCargando(false);
    }
  };

  const agregarCliente = async () => {
    if (!nuevoCliente.Clientes.trim()) return;

    setCargando(true);
    try {
      const response = await fetch(
        `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${TABLE_NAME}/records`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ApplicationAccessKey': API_KEY,
          },
          body: JSON.stringify({
            Action: 'Add',
            Properties: {},
            Rows: [nuevoCliente],
          }),
        }
      );

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
