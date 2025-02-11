import React from 'react';
import { Container, Box, Button, Typography, styled, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.webp';
import MenuIcon from '@mui/icons-material/Menu';

// ***Styled Components MUST be declared BEFORE the UserPage component***
const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#111',
  color: '#eee',
  fontFamily: 'Roboto Mono, monospace',
  overflowX: 'hidden',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  padding: theme.spacing(1),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: '40px',
  marginRight: theme.spacing(2),
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  color: '#eee',
  '&:hover': {
    color: '#00bcd4',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: '#1a1a1a',
    color: '#eee',
    width: '240px',
  },
}));

const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#222',
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: 'inherit',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: '#4caf50',
  color: '#111',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0px 0px 5px rgb(12, 2, 146)',
  '&:hover': {
    backgroundColor: '#68b96c',
    transform: 'scale(1.05)',
    boxShadow: '0px 0px 10px rgb(31, 10, 224)',
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'radial-gradient(circle, rgba(0,0,0,0.5), rgba(0,0,0,0.8))',
}));

const Title = styled(Typography)(({ theme }) => ({
  color: '#eee',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  textShadow: '0px 0px 5px #00bcd4',
}));


const UserPage = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleRedirect = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Resultado General', path: '/tablaGeneral' },
    { text: 'Estadisticas', path: '/tablaEstadisticas' },
    { text: 'Calificación', path: '/tablaCalificacion' },
    { text: 'Equipos', path: '/tablaEquipos' },
    { text: 'Partidos', path: '/tablaPartidos' },
    { text: 'Puntuaciones', path: '/login' },
  ];

  return (
    <StyledContainer>
      <StyledAppBar position="static">
        <StyledToolbar>
          <LogoImage src={logo} alt="Logo" />
          <MenuButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </MenuButton>
        </StyledToolbar>
      </StyledAppBar>

      <StyledDrawer
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <StyledList>
          {menuItems.map((item) => (
            <StyledListItem key={item.text}>
              <StyledListItemButton onClick={() => handleRedirect(item.path)}>
                <ListItemText primary={item.text} />
              </StyledListItemButton>
            </StyledListItem>
          ))}
        </StyledList>
      </StyledDrawer>

      <ContentBox>
        <Title variant="h3">CAMPEONATO COLEGIO de ING</Title>
        <LogoImage src={logo} alt="Logo" />
      </ContentBox>
    </StyledContainer>
  );
};

export default UserPage;