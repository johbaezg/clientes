// File: /api/clientes.js

export default async function handler(req, res) {
  const APP_ID = process.env.APP_ID;
  const API_KEY = process.env.API_KEY;
  const AUTH_TOKEN = process.env.AUTH_TOKEN;
  const TABLE_NAME = 'Clientes';

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (!APP_ID || !API_KEY) {
    return res.status(500).json({ error: 'Faltan variables de entorno' });
  }

  const endpoint = `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${TABLE_NAME}/records`;
  const headers = {
    'ApplicationAccessKey': API_KEY,
    'Content-Type': 'application/json'
  };

  if (req.method === 'GET') {
    try {
      const response = await fetch(endpoint, { headers });
      const data = await response.json();
      return res.status(200).json(data.value || []);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener clientes', detail: error.message });
    }
  }

  if (req.method === 'POST') {
    const { Clientes } = req.body;

    if (!Clientes || typeof Clientes !== 'string') {
      return res.status(400).json({ error: 'El campo "Clientes" es requerido y debe ser texto' });
    }

    const body = JSON.stringify({
      Action: 'Add',
      Properties: {},
      Rows: [{ Clientes }]
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        const text = await response.text();
        return res.status(500).json({ error: 'Error al guardar en AppSheet', detail: text });
      }

      return res.status(201).json({ message: 'Cliente agregado correctamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error inesperado', detail: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
