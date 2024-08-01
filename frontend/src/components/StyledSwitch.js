// src/components/StyledSwitch.js

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 40, // Diminuir o tamanho total do switch
  height: 20, // Diminuir a altura do switch
  padding: 0, // Remover o padding extra
  '& .MuiSwitch-switchBase': {
    padding: 1, // Ajustar o padding do switchBase
    '&.Mui-checked': {
      transform: 'translateX(20px)', // Ajustar a posição do Thumb quando ativado
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#4cd964', // Cor verde típica do iOS quando ativado
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#fff', // Thumb branco para um visual clean
    width: 18, // Tamanho do Thumb
    height: 18, // Altura do Thumb
    borderRadius: '50%', // Thumb arredondado
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)', // Sombra sutil para dar um efeito de profundidade
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2, // Tornar o track arredondado
    backgroundColor: '#e5e5ea', // Cor cinza suave para o track desativado
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 200, // Suavizar a transição
    }),
  },
}));

export default CustomSwitch;
