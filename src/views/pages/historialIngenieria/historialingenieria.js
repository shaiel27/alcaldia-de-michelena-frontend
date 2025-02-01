import { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from "@coreui/react"
import { CChartBar, CChartDoughnut } from "@coreui/react-chartjs"

const HistorialTramitesIngenieria = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const tramitesData = {
    solicitudesObra: 45,
    permisosAprobados: 30,
    permisosRechazados: 10,
    permisosPendientes: 5,
    inspeccionesRealizadas: 28,
  }

  const tramitesDetallados = [
    {
      id: "001",
      fecha: "2024-01-15",
      tipo: "Construcción",
      descripcion: "Edificio Residencial 5 Pisos",
      solicitante: "Juan Pérez",
      estado: "Aprobado",
      area: "500m²",
      presupuesto: "$250,000",
      inspector: "María González",
      ultimaActualizacion: "2024-01-20",
    },
    {
      id: "002",
      fecha: "2024-01-18",
      tipo: "Remodelación",
      descripcion: "Renovación Interior Local Comercial",
      solicitante: "Carlos Ruiz",
      estado: "Pendiente",
      area: "120m²",
      presupuesto: "$45,000",
      inspector: "Pedro Sánchez",
      ultimaActualizacion: "2024-01-22",
    },
    {
      id: "003",
      fecha: "2024-01-20",
      tipo: "Demolición",
      descripcion: "Demolición Estructura Antigua",
      solicitante: "Ana López",
      estado: "Rechazado",
      area: "200m²",
      presupuesto: "$30,000",
      inspector: "Roberto Díaz",
      ultimaActualizacion: "2024-01-25",
    },
    {
      id: "004",
      fecha: "2024-01-22",
      tipo: "Ampliación",
      descripcion: "Ampliación Área Comercial",
      solicitante: "Luis Torres",
      estado: "Aprobado",
      area: "150m²",
      presupuesto: "$80,000",
      inspector: "María González",
      ultimaActualizacion: "2024-01-28",
    },
    {
      id: "005",
      fecha: "2024-01-25",
      tipo: "Construcción",
      descripcion: "Centro Comercial",
      solicitante: "Empresa XYZ",
      estado: "En Revisión",
      area: "1500m²",
      presupuesto: "$800,000",
      inspector: "Pedro Sánchez",
      ultimaActualizacion: "2024-01-30",
    },
    {
      id: "006",
      fecha: "2024-01-28",
      tipo: "Remodelación",
      descripcion: "Remodelación Oficinas",
      solicitante: "Empresa ABC",
      estado: "Aprobado",
      area: "300m²",
      presupuesto: "$150,000",
      inspector: "Roberto Díaz",
      ultimaActualizacion: "2024-02-01",
    },
    {
      id: "007",
      fecha: "2024-02-01",
      tipo: "Ampliación",
      descripcion: "Ampliación Bodega Industrial",
      solicitante: "Industrias XYZ",
      estado: "Pendiente",
      area: "800m²",
      presupuesto: "$400,000",
      inspector: "María González",
      ultimaActualizacion: "2024-02-05",
    },
  ]

  const tramitesPorMes = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Solicitudes",
        backgroundColor: "#321fdb",
        data: [40, 35, 45, 50, 45, 60],
      },
      {
        label: "Aprobados",
        backgroundColor: "#2eb85c",
        data: [30, 25, 35, 40, 35, 45],
      },
    ],
  }

  const tiposTramites = {
    labels: ["Construcción", "Remodelación", "Demolición", "Ampliación", "Otros"],
    datasets: [
      {
        data: [45, 25, 10, 15, 5],
        backgroundColor: ["#321fdb", "#2eb85c", "#e55353", "#f9b115", "#3399ff"],
        hoverBackgroundColor: ["#321fdb", "#2eb85c", "#e55353", "#f9b115", "#3399ff"],
      },
    ],
  }

  const getBadgeColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "aprobado":
        return "success"
      case "rechazado":
        return "danger"
      case "pendiente":
        return "warning"
      case "en revisión":
        return "info"
      default:
        return "primary"
    }
  }

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = tramitesDetallados.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(tramitesDetallados.length / itemsPerPage)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Historial de Trámites - Departamento de Ingeniería</h2>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <h4>Resumen de Trámites</h4>
                <CTable bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Tipo</CTableHeaderCell>
                      <CTableHeaderCell>Cantidad</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Total Solicitudes</CTableDataCell>
                      <CTableDataCell>{tramitesData.solicitudesObra}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">Total</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Permisos Aprobados</CTableDataCell>
                      <CTableDataCell>{tramitesData.permisosAprobados}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="success">Aprobado</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Permisos Rechazados</CTableDataCell>
                      <CTableDataCell>{tramitesData.permisosRechazados}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger">Rechazado</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Permisos Pendientes</CTableDataCell>
                      <CTableDataCell>{tramitesData.permisosPendientes}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="warning">Pendiente</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Inspecciones Realizadas</CTableDataCell>
                      <CTableDataCell>{tramitesData.inspeccionesRealizadas}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">Completado</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
              <CCol md={6}>
                <h4>Distribución de Tipos de Trámites</h4>
                <div style={{ height: "300px" }}>
                  <CChartDoughnut
                    data={tiposTramites}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol xs={12}>
                <h4>Evolución de Trámites por Mes</h4>
                <div style={{ height: "300px" }}>
                  <CChartBar
                    data={tramitesPorMes}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </CCol>
            </CRow>

            {/* Nueva Tabla Detallada */}
            <CRow className="mt-4">
              <CCol xs={12}>
                <h4>Detalle de Trámites</h4>
                <div className="d-flex justify-content-end mb-3">
                  <div style={{ width: "150px" }}>
                    <CFormSelect
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                    >
                      <option value={5}>5 por página</option>
                      <option value={10}>10 por página</option>
                      <option value={15}>15 por página</option>
                    </CFormSelect>
                  </div>
                </div>
                <CTable bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Tipo</CTableHeaderCell>
                      <CTableHeaderCell>Descripción</CTableHeaderCell>
                      <CTableHeaderCell>Solicitante</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Área</CTableHeaderCell>
                      <CTableHeaderCell>Presupuesto</CTableHeaderCell>
                      <CTableHeaderCell>Inspector</CTableHeaderCell>
                      <CTableHeaderCell>Última Actualización</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentItems.map((tramite) => (
                      <CTableRow key={tramite.id}>
                        <CTableDataCell>{tramite.id}</CTableDataCell>
                        <CTableDataCell>{tramite.fecha}</CTableDataCell>
                        <CTableDataCell>{tramite.tipo}</CTableDataCell>
                        <CTableDataCell>{tramite.descripcion}</CTableDataCell>
                        <CTableDataCell>{tramite.solicitante}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadgeColor(tramite.estado)}>{tramite.estado}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{tramite.area}</CTableDataCell>
                        <CTableDataCell>{tramite.presupuesto}</CTableDataCell>
                        <CTableDataCell>{tramite.inspector}</CTableDataCell>
                        <CTableDataCell>{tramite.ultimaActualizacion}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination className="justify-content-end" aria-label="Page navigation">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    aria-label="Next"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HistorialTramitesIngenieria

