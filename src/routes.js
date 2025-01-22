import React from "react";

const DashboardMunicipal = React.lazy(() => import("./views/dashboard/Dashboard"));

const ConstructionRequestForm = React.lazy(() => import("./views/pages/solicitud_obra/Solicitud_obra"));
const ConstanciasCatastrales = React.lazy(() => import("./views/pages/Cadastre_request/CadastreRequest"));
const RegistroTerrenos = React.lazy(() => import("./views/pages/Property_Registry/PropertyRegistry"));
const VisualizacionPropiedades = React.lazy(() => import("./views/pages/User_Properties/UserProperties"));
const SellOrTransferProperty = React.lazy(() => import('./views/pages/UserTramites/UserTramitesProperties'))
const WaterComplaintForm = React.lazy(() => import('./views/pages/waterProblem/waterproblemForm'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/DashboardMunicipal", name: "Dashboard", element: DashboardMunicipal },
  { path: "/solicitud_obra", name: "ConstructionRequestForm", element: ConstructionRequestForm },
  { path: "/solicitud_catastro", name: "ConstanciasCatastrales", element: ConstanciasCatastrales },
  { path: "/registro_terreno", name: "RegistroTerrenos", element: RegistroTerrenos },
  { path: "/propiedades_usuario", name: "VisualizacionPropiedades", element: VisualizacionPropiedades },
  { path: "/property_transaction", name: "SellOrTransferProperty", element: SellOrTransferProperty },
  { path: "/WaterComplaintForm", name: "WaterComplaintForm", element: WaterComplaintForm },
  { path: "/Login", name: "Login", element: Login },
  { path: "/Register", name: "Register", element: Register },
];

export default routes;
