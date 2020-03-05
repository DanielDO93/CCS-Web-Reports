import React from 'react';
import DefaultLayout from './containers/DefaultLayout';


// eslint-disable-next-line
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Inicio = React.lazy(() => import('./views/Inicio'));
const Buscador = React.lazy(() => import('./views/Buscador'));
const Reportes = React.lazy(() => import('./views/Reportes'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/Inicio', name: 'Inicio', component: Inicio },
  { path: '/Buscador', name: 'Buscador', component: Buscador },
  { path: '/Reportes', name: 'Reportes', component: Reportes },

];

export default routes;
