import React, { useEffect, useState } from 'react';
import { obtenerTorneos } from '../../services/torneoServices';
import { obtenerCategorias } from '../../services/categoriaServices';
import { obtenerDisciplinas } from '../../services/disciplinasServices';
import { obtenerEquipos } from '../../services/equipoServices';
import { obtenerCompetenciasIndividuales, obtenerResultadosEquipos } from '../../services/competicionServices';
import { obtenerPuntuacion } from '../../services/estadisticaServices';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import puntajesService from '../../services/puntajeServices';

const TablaGeneral = () => {
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [competencias, setCompetencias] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState([]);
  const [decrementosPorPosicion, setDecrementosPorPosicion] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          torneosData,
          categoriasData,
          disciplinasData,
          equiposData,
          resultadosData,
          competenciasData,
          puntuacionesData,
          puntajesConfigData
        ] = await Promise.all([
          obtenerTorneos(),
          obtenerCategorias(),
          obtenerDisciplinas(),
          obtenerEquipos(),
          obtenerResultadosEquipos(),
          obtenerCompetenciasIndividuales(),
          obtenerPuntuacion(),
          puntajesService.obtenerPuntajes()
        ]);

        setTorneos(torneosData || []);
        setCategorias(categoriasData || []);
        setDisciplinas(disciplinasData || []);
        setEquipos(equiposData.data || []);
        setResultados(resultadosData.data[0] || []);
        setCompetencias(competenciasData.data || []);
        setPuntuaciones(puntuacionesData || []);

        const decrementos = {
          [puntajesConfigData[0].puntaje_primer_puesto]: [0, 2, 4, 5, 6, 7, 8, 9],
          [puntajesConfigData[1].puntaje_primer_puesto]: [0, 4, 8, 10, 12, 14, 16, 18],
          [puntajesConfigData[2].puntaje_primer_puesto]: [0, 6, 12, 15, 18, 21, 24, 27],
          [puntajesConfigData[3].puntaje_primer_puesto]: [0, 3, 6, 7, 9, 10, 11, 13]
        };

        setDecrementosPorPosicion(decrementos);

      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  const esFutbolOBasquet = (disciplinaId) => {
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    return disciplina?.tipo === 'colectiva';
  };

  const getPuntajePorDisciplina = (equipoId, disciplinaId) => {

    // Verifica si es fútbol o básquet
    if (esFutbolOBasquet(disciplinaId)) {
      // Busca en la tabla de puntuacion
      const puntajesEquipo = puntuaciones.filter(p => 
        p.equipo_id === equipoId && 
        p.disciplina_id === disciplinaId
      );
      
      if (puntajesEquipo.length === 0) {
        return 'NP';
      }
  
      const sumaPuntajes = puntajesEquipo.reduce((sum, p) => sum + (p.puntaje_por_equipo || 0), 0);
      return sumaPuntajes === 9999 ? 'NP' : sumaPuntajes;
    } else {
      // Para otras disciplinas, busca en competencia_equipos
      const competencia = competencias.find(c => c.disciplina_id === disciplinaId);
  
      if (!competencia) {
        return 'NP';
      }
  
      const resultado = resultados.find(res => 
        res.equipo_id === equipoId && 
        res.competencia_id === competencia.id
      );
      
      if (!resultado) {
        return 'NP';
      }

      return resultado.resultado_equipo === 9999 ? 'NP' : (resultado.resultado_equipo || 0);
    }
  };

  const getPuntajeAdicionalPorPosicion = (valorPuntos, posicion) => {
    const decrementos = decrementosPorPosicion[valorPuntos];
    
    if (!decrementos || posicion < 1 || posicion > decrementos.length) {
      return 0;
    }
    
    const puntajeAdicional = valorPuntos - decrementos[posicion - 1];
    return puntajeAdicional;
  };

  const getPuntajeTotalConAdicional = (equipo, categoriaId) => {
    let puntajeBase = 0;
    let puntajeAdicionalTotal = 0;
  
    // Obtener equipos de la misma categoría
    const equiposCategoria = equipos.filter(e => e.categoria_id === categoriaId);
  
    disciplinas.forEach(disciplina => {
      
      // Calcula el puntaje base para esta disciplina
      const puntajeDisciplina = getPuntajePorDisciplina(equipo.id, disciplina.id);
      if (puntajeDisciplina !== 'NP') {
        puntajeBase += Number(puntajeDisciplina);
      }
  
      // Obtiene solo los equipos de la misma categoría que participaron en esta disciplina
      const equiposParticipantes = equiposCategoria.filter(e => {
        const puntaje = getPuntajePorDisciplina(e.id, disciplina.id);
        const participa = puntaje !== 'NP';
        return participa;
      });
    
      // Ordena los equipos por puntaje en esta disciplina (solo de la categoría)
      const equiposOrdenados = equiposParticipantes.sort((a, b) => {
        const puntajeA = Number(getPuntajePorDisciplina(a.id, disciplina.id));
        const puntajeB = Number(getPuntajePorDisciplina(b.id, disciplina.id));
        return puntajeB - puntajeA;
      });
  
      equiposOrdenados.forEach((e, idx) => {
        const puntaje = getPuntajePorDisciplina(e.id, disciplina.id);
      });
  
      // Encuentra la posición del equipo actual dentro de su categoría
      const posicion = equiposOrdenados.findIndex(e => e.id === equipo.id) + 1;
      
      // Solo calcula puntaje adicional si el equipo participó
      if (posicion > 0) {
        const puntajeAdicional = getPuntajeAdicionalPorPosicion(
          disciplina.valor_puntos,
          posicion
        );
        puntajeAdicionalTotal += puntajeAdicional;
        console.log(`Puntaje adicional en esta disciplina: ${puntajeAdicional}`);
      } else {
        console.log('El equipo no participó - sin puntaje adicional');
      }
    });

    const puntajeTotal = puntajeBase + puntajeAdicionalTotal;

    return {
      puntajeBase,
      puntajeAdicionalTotal,
      puntajeTotal
    };
  };

  const getEquiposOrdenados = (categoriaId) => {
    
    // Filtrar solo equipos de esta categoría
    const equiposCategoria = equipos.filter(equipo => 
      equipo.categoria_id === categoriaId
    );
    
    const equiposOrdenados = equiposCategoria.sort((a, b) => {
      const { puntajeTotal: puntajeA } = getPuntajeTotalConAdicional(a, categoriaId);
      const { puntajeTotal: puntajeB } = getPuntajeTotalConAdicional(b, categoriaId);
      return puntajeB - puntajeA;
    });
  
    equiposOrdenados.forEach((equipo, idx) => {
      const { puntajeTotal } = getPuntajeTotalConAdicional(equipo, categoriaId);
    });
  
    return equiposOrdenados;
  };
  
  const renderTableData = () => {
    if (!categorias.length || !equipos.length || !disciplinas.length) {
      return (
        <TableRow>
          <TableCell colSpan={disciplinas.length + 3}>
            No hay datos disponibles
          </TableCell>
        </TableRow>
      );
    }

    return categorias.map((categoria) => {
      const equiposOrdenados = getEquiposOrdenados(categoria.id);
  
      return (
        <React.Fragment key={categoria.id}>
          <TableRow>
            <TableCell 
              rowSpan={equiposOrdenados.length + 1} 
              style={{ 
                fontWeight: 'bold', 
                backgroundColor: '#f5f5f5',
                verticalAlign: 'top'
              }}
            >
              {categoria.nombre}
            </TableCell>
          </TableRow>
          {equiposOrdenados.map((equipo, idx) => {
            const { puntajeBase, puntajeAdicionalTotal, puntajeTotal } = 
              getPuntajeTotalConAdicional(equipo, categoria.id);
  
            return (
              <TableRow key={equipo.id}>
                <TableCell>{equipo.nombre}</TableCell>
                {disciplinas.map(disciplina => (
                  <TableCell key={disciplina.id} align="center">
                    {getPuntajePorDisciplina(equipo.id, disciplina.id)}
                  </TableCell>
                ))}
                <TableCell style={{ fontWeight: 'bold' }}>
                  {puntajeTotal.toFixed()} 
                  {puntajeAdicionalTotal > 0 && (
                    <span style={{ color: 'green' }}>
                      {` (+${puntajeAdicionalTotal.toFixed()})`}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </React.Fragment>
      );
    });



  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button 
        variant="contained" 
        startIcon={<ArrowBackIcon />} 
        onClick={() => window.history.back()} 
        sx={{ mb: 3 }}
      >
        Retroceder
      </Button>
      
      {torneos.length > 0 && (
        <Typography variant="h4" align="center" gutterBottom>
          {torneos[0].nombre}
        </Typography>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Categoría</TableCell>
              <TableCell>Equipo</TableCell>
              {disciplinas.map(disciplina => (
                <TableCell key={disciplina.id} align="center">
                  {disciplina.nombre}
                </TableCell>
              ))}
              <TableCell>Puntaje Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableData()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TablaGeneral;