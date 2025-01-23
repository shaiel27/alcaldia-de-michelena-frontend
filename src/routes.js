import React from "react"

const DashboardMunicipal = React.lazy(() => import("./views/dashboard/Dashboard"))

const ConstructionRequestForm = React.lazy(() => import("./views/pages/solicitud_obra/Solicitud_obra"))
const ConstanciasCatastrales = React.lazy(() => import("./views/pages/Cadastre_request/CadastreRequest"))
const RegistroTerrenos = React.lazy(() => import("./views/pages/Property_Registry/PropertyRegistry"))
const SellOrTransferProperty = React.lazy(() => import("./views/pages/UserTramites/UserTramitesProperties"))
const WaterComplaintForm = React.lazy(() => import("./views/pages/waterProblem/waterproblemForm"))
const Login = React.lazy(() => import("./views/pages/login/Login"))
const Register = React.lazy(() => import("./views/pages/register/Register"))
const UserProperties = React.lazy(() => import("./views/pages/User_Properties/UserProperties"))
const AdminRequestsApproval = React.lazy(() => import("./views/pages/admin_obrasSoli/obrasSoli"))
const SolicitarAyuda = React.lazy(() => import("./views/pages/solicitarAyuda/solicitarAyuda"))
const AdminRevisarSolicitudesAyuda = React.lazy(() => import("./views/pages/adminAyudas/adminAyudas"))
const TurismoInformacion = React.lazy(() => import("./views/pages/turismo/turismoInfo"))
const HistorialTramitesIngenieria = React.lazy(() => import("./views/pages/historialIngenieria/historialingenieria"))
const MonitoreoCalidadAgua = React.lazy(() => import("./views/pages/monitoreoAgua/monitoreoAgua"))

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/DashboardMunicipal", name: "Dashboard", element: DashboardMunicipal },
  { path: "/solicitud_obra", name: "ConstructionRequestForm", element: ConstructionRequestForm },
  { path: "/solicitud_catastro", name: "ConstanciasCatastrales", element: ConstanciasCatastrales },
  { path: "/registro_terreno", name: "RegistroTerrenos", element: RegistroTerrenos },
  { path: "/propiedades_usuario", name: "UserProperties", element: UserProperties },
  { path: "/property_transaction", name: "SellOrTransferProperty", element: SellOrTransferProperty },
  { path: "/WaterComplaintForm", name: "WaterComplaintForm", element: WaterComplaintForm },
  { path: "/Login", name: "Login", element: Login },
  { path: "/Register", name: "Register", element: Register },
  { path: "AdminRequestsApproval", name: "AdminRequestsApproval", element: AdminRequestsApproval},
  { path: "/solicitar-ayuda", name: "SolicitarAyuda", element: SolicitarAyuda },
  { path: "/adminAyudas", name: "AdminRevisarSolicitudesAyuda", element: AdminRevisarSolicitudesAyuda },
  { path: "/turismo", name: "TurismoInformacion", element: TurismoInformacion },
  { path: "/historialIngeieria", name: "HistorialTramitesIngenieria", element: HistorialTramitesIngenieria },
  { path: "/monitoreoAgua", name: "MonitoreoCalidadAgua", element: MonitoreoCalidadAgua },
]

export default routes

