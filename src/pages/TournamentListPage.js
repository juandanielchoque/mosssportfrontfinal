import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TournamentListPage = () => {
  const [torneos, setTorneos] = useState([]);
  const [error, setError] = useState('');

  

  // Obtener torneos desde el backend
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/torneos');
        setTorneos(response.data); // Guardar los torneos en el estado
      } catch (err) {
        setError('Error al obtener los torneos.');
      }
    };

    fetchTorneos();
  }, []);

  const totalTorneos = torneos.length;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Torneos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {torneos.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {torneos.map((torneo) => (
            <li
              key={torneo.id}
              style={{
                margin: '10px 0',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h2>{torneo.nombre}</h2>
              <p><strong>Tipo:</strong> {torneo.tipo}</p>
              <p><strong>Fechas:</strong> {torneo.fecha_inicio} - {torneo.fecha_fin}</p>
              <p><strong>Lugar:</strong> {torneo.lugar}</p>
              <p><strong>Estado:</strong> {torneo.estado}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay torneos disponibles.</p>
      )}
    </div>
  );
};


export default TournamentListPage;
