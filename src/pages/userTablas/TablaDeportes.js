import React from 'react';
import { styled, Box } from '@mui/material';
import TablaFutbol from '../../components/TablasDisciplina/tablaFutbol';
import TablaBaloncesto from '../../components/TablasDisciplina/tablaBaloncesto';
import TablaDisciplinas from '../../components/TablasDisciplina/tablaDisciplinas';

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#1a1a1a', // Darker sidebar
    padding: theme.spacing(3),
    borderRadius: '8px', // Rounded corners
    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', // Subtle shadow
    marginBottom: theme.spacing(2), // Space between tables
    overflowX: 'auto', // Enable horizontal scroll if needed
    color: '#eee', // Text color
}));

const TablaDeportes = ({ categoria, disciplina, equipos }) => {

    const renderTablaDeporte = () => {
        switch (disciplina.nombre.toLowerCase()) {
            case 'futbol':
                return (
                    <StyledBox>
                        <TablaFutbol
                            categoria={categoria}
                            disciplina={disciplina}
                            equipos={equipos}
                        />
                    </StyledBox>
                );
            case 'baloncesto':
                return (
                    <StyledBox>
                        <TablaBaloncesto
                            categoria={categoria}
                            disciplina={disciplina}
                            equipos={equipos}
                        />
                    </StyledBox>
                );

            default:
                return (
                    <StyledBox>
                        <TablaDisciplinas
                            categoria={categoria}
                            disciplina={disciplina}
                            equipos={equipos}
                        />
                    </StyledBox>
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