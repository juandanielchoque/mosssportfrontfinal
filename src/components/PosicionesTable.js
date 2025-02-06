import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PosicionesTable = ({ categoriaId }) => {
  const [posiciones, setPosiciones] = useState([]);

  useEffect(() => {
    // Obtener las posiciones de los equipos en la categoría
    axios.get(`http://localhost:5000/api/categorias/${categoriaId}/posiciones`)
      .then(response => {
        setPosiciones(response.data);
      })
      .catch(error => {
        console.error('Error al cargar la tabla de posiciones:', error);
      });
  }, [categoriaId]);

  return (
    <div>
      <h4>Tabla de Posiciones</h4>
      <table>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Equipo</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {posiciones.map((equipo, index) => (
            <tr key={equipo.id}>
              <td>{index + 1}</td>
              <td>{equipo.nombre}</td>
              <td>{equipo.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PosicionesTable;
