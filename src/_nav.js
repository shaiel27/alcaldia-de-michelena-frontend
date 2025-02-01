import React from "react"
import CIcon from "@coreui/icons-react"
import {
  cilSpeedometer,
  cilDrop,
  cilUser,
  cilClipboard,
  cilHome,
  cilChartPie,
  cilPuzzle,
  cilBell,
  cilNotes,
  cilPeople,
} from "@coreui/icons"
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react"

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/DashboardMunicipal",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  {
    component: CNavTitle,
    name: "Servicios al Ciudadano",
  },
  {
    component: CNavGroup,
    name: "Catastro e Ingeniería",
    to: "/catastro",
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Solicitud de Obras",
        to: "/solicitud_obra",
      },
      {
        component: CNavItem,
        name: "Solicitud de Ventas",
        to: "/property_transaction",
      },
      {
        component: CNavItem,
        name: "Constancias Catastrales",
        to: "/solicitud_catastro",
      },
      {
        component: CNavItem,
        name: "Historial de Trámites",
        to: "/historialIngeieria",
      },
      {
        component: CNavItem,
        name: "Inspecciones",
        to: "/inspecciones",
      },
    ],
  },
  {
    component: CNavItem,
    name: "Solicitar Ayuda",
    to: "/solicitar-ayuda",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Gestión de Aguas",
    to: "/aguas",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Monitoreo de Calidad",
        to: "/monitoreoAgua",
      },
      {
        component: CNavItem,
        name: "Problemáticas",
        to: "/WaterComplaintForm",
      },
    ],
  },
  {
    component: CNavTitle,
    name: "Registros",
  },
  {
    component: CNavItem,
    name: "Registrar Terrenos",
    to: "/registro_terreno",
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Propiedades",
    to: "/propiedades_usuario",
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: "Administración",
  },
  {
    component: CNavGroup,
    name: "Gestión de Trámites",
    to: "/administracion",
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Solicitudes de obras",
        to: "/AdminRequestsApproval",
      },
      {
        component: CNavItem,
        name: "Rentas",
        to: "/rentas",
      },
      // {
      //   component: CNavItem,
      //   name: "Recursos Humanos",
      //   to: "/administracion/recursos-humanos",
      // },
      // {
      //   component: CNavItem,
      //   name: "Hacienda",
      //   to: "/administracion/hacienda",
      // },
    ],
  },
  {
    component: CNavItem,
    name: "Revisar Ayudas",
    to: "/adminAyudas",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: "Transparencia",
  //   to: "/transparencia",
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Acceso a Información Pública",
  //       to: "/transparencia/informacion-publica",
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Retroalimentación Ciudadana",
  //       to: "/transparencia/retroalimentacion",
  //     },
  //   ],
  // },
  {
    component: CNavItem,
    name: "Turismo e Información",
    to: "/turismo",
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: "Soporte Técnico",
  //   to: "/soporte",
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  // },
]

export default _nav

