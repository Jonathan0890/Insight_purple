import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppThemeProvider } from './context/ThemeContext';
import { routes } from './router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/es'
import './i18n'; // Importa la configuración de i18n
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <AppThemeProvider>
        <NotificationProvider>
          <RouterProvider router={routes} />

        </NotificationProvider>
      </AppThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
