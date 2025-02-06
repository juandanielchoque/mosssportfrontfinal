import React from 'react';
import TablaFutbol from '../../components/TablasDisciplina/tablaFutbol';
import TablaBaloncesto from '../../components/TablasDisciplina/tablaBaloncesto';
import TablaDisciplinas from '../../components/TablasDisciplina/tablaDisciplinas';

const TablaDeportes = ({ categoria, disciplina, equipos }) => {

    const renderTablaDeporte = () => {
        switch (disciplina.nombre.toLowerCase()) {
            case 'futbol':
                return (
                    <TablaFutbol 
                        categoria={categoria}
                        disciplina={disciplina}
                        equipos={equipos}
                    />
                );
            case 'baloncesto':
                return (
                    <TablaBaloncesto 
                        categoria={categoria}
                        disciplina={disciplina}
                        equipos={equipos}
                    />
                );

            default:
                return (
                    <TablaDisciplinas 
                        categoria={categoria}
                        disciplina={disciplina}
                        equipos={equipos}
                    />
                );
        }
    };

    return (
        <div>
            {renderTablaDeporte()}
        </div>
    );
};

export default TablaDeportes;