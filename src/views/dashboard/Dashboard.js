"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
} from "@coreui/react"
import { CChartBar, CChartLine } from "@coreui/react-chartjs"
import CIcon from "@coreui/icons-react"
import { cilCloudDownload } from "@coreui/icons"
import { helpFetch } from "../../api/helpfetch"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    engineeringProjects: [],
    monthlyProcedures: [],
    constructionRequests: [],
    cadastralCertificates: [],
    cadastralStats: {
      registeredLands: 0,
      updatedProperties: 0,
      taxCollection: 0,
    },
    financialStatus: {
      income: 0,
      expenses: 0,
      annualBudget: 5000000,
    },
  })

  const api = helpFetch()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all required data with error handling
      const [
        solicitudesObraRes,
        terrenosRes,
        constanciasRes,
        ingresosRes,
        ayudasRes,
        inspeccionesRes
      ] = await Promise.allSettled([
        api.get("Solicitud_de_obra"),
        api.get("Terreno"),
        api.get("Constancias"),
        api.get("Ingresos"),
        api.get("Ayudas_Registradas"),
        api.get("Inspeccion"),
      ])

      // Safely extract data with fallbacks
      const solicitudesObra = solicitudesObraRes.status === 'fulfilled' && !solicitudesObraRes.value?.err 
        ? solicitudesObraRes.value || [] 
        : []
      
      const terrenos = terrenosRes.status === 'fulfilled' && !terrenosRes.value?.err 
        ? terrenosRes.value || [] 
        : []
      
      const constancias = constanciasRes.status === 'fulfilled' && !constanciasRes.value?.err 
        ? constanciasRes.value || [] 
        : []
      
      const ingresos = ingresosRes.status === 'fulfilled' && !ingresosRes.value?.err 
        ? ingresosRes.value || [] 
        : []
      
      const ayudas = ayudasRes.status === 'fulfilled' && !ayudasRes.value?.err 
        ? ayudasRes.value || [] 
        : []

      // Process engineering projects data
      const engineeringProjects = Array.isArray(solicitudesObra) 
        ? solicitudesObra.map((solicitud) => ({
            id: solicitud.ID_Solicitud_de_obra,
            name: solicitud.Descripcion || 'Sin descripción',
            status: solicitud.Estatus || 'Pendiente',
            budget: Number.parseInt(solicitud.Monto) || 0,
          }))
        : []

      // Process monthly procedures
      const monthlyProcedures = [
        { month: "Enero", count: Array.isArray(solicitudesObra) ? solicitudesObra.filter((s) => s.Fecha?.includes("2025-01")).length : 0 },
        { month: "Febrero", count: Array.isArray(solicitudesObra) ? solicitudesObra.filter((s) => s.Fecha?.includes("2025-02")).length : 0 },
        { month: "Marzo", count: Array.isArray(solicitudesObra) ? solicitudesObra.filter((s) => s.Fecha?.includes("2025-03")).length : 0 },
        { month: "Abril", count: Array.isArray(solicitudesObra) ? solicitudesObra.filter((s) => s.Fecha?.includes("2025-04")).length : 0 },
        { month: "Mayo", count: Array.isArray(solicitudesObra) ? solicitudesObra.filter((s) => s.Fecha?.includes("2025-05")).length : 0 },
        { month: "Junio", count: Array.isArray(solicitudesObra) ? solicitudesObra.filter((s) => s.Fecha?.includes("2025-06")).length : 0 },
      ]

      // Process construction requests
      const constructionRequests = Array.isArray(solicitudesObra) 
        ? solicitudesObra.slice(0, 5).map((solicitud) => ({
            id: solicitud.ID_Solicitud_de_obra,
            type: solicitud.Descripcion?.includes("Construcción")
              ? "Residencial"
              : solicitud.Descripcion?.includes("Comercial")
                ? "Comercial"
                : "Otros",
            status:
              solicitud.Estatus === "Aprobada"
                ? "Aprobado"
                : solicitud.Estatus === "Rechazada"
                  ? "Rechazado"
                  : "Pendiente",
            requestDate: solicitud.Fecha || 'Sin fecha',
          }))
        : []

      // Process cadastral certificates
      const cadastralCertificates = Array.isArray(constancias) 
        ? constancias.slice(0, 5).map((constancia) => ({
            id: constancia.id,
            type: constancia.tipo || "Propiedad",
            issueDate: constancia.fecha ? new Date(constancia.fecha).toISOString().split("T")[0] : 'Sin fecha',
          }))
        : []

      // Calculate cadastral stats
      const cadastralStats = {
        registeredLands: Array.isArray(terrenos) ? terrenos.length : 0,
        updatedProperties: Array.isArray(terrenos) ? terrenos.filter((t) => t.Superficie && t.Ubicacion).length : 0,
        taxCollection: Array.isArray(ingresos) ? ingresos.reduce((sum, ing) => sum + (Number(ing.monto) || 0), 0) : 0,
      }

      // Calculate financial status
      const totalIncome = Array.isArray(ingresos) ? ingresos.reduce((sum, ing) => sum + (Number(ing.monto) || 0), 0) : 0
      const totalExpenses = Array.isArray(ayudas) ? ayudas.reduce((sum, ayuda) => sum + (Number(ayuda.monto) || 0), 0) : 0

      const financialStatus = {
        income: totalIncome,
        expenses: totalExpenses,
        annualBudget: 5000000,
      }

      setDashboardData({
        engineeringProjects,
        monthlyProcedures,
        constructionRequests,
        cadastralCertificates,
        cadastralStats,
        financialStatus,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Error al cargar los datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("es-VE", { style: "currency", currency: "VES" })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Aprobado":
      case "Aprobada":
        return <CBadge color="success">{status}</CBadge>
      case "Rechazado":
      case "Rechazada":
        return <CBadge color="danger">{status}</CBadge>
      case "Pendiente":
        return <CBadge color="warning">{status}</CBadge>
      default:
        return <CBadge color="info">{status}</CBadge>
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <h1 className="mb-4">Dashboard Municipal de Michelena</h1>
      </CCol>

      {/* Sección de Proyectos de Ingeniería */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            Proyectos de Ingeniería
            <CButton color="link" className="card-header-action">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CCardHeader>
          <CCardBody>
            {dashboardData.engineeringProjects.length > 0 ? (
              <CChartBar
                data={{
                  labels: dashboardData.engineeringProjects.map((project) =>
                    project.name.length > 20 ? project.name.substring(0, 20) + "..." : project.name,
                  ),
                  datasets: [
                    {
                      label: "Presupuesto",
                      backgroundColor: "#321fdb",
                      data: dashboardData.engineeringProjects.map((project) => project.budget),
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Presupuesto (Bs)",
                      },
                    },
                  },
                }}
              />
            ) : (
              <CAlert color="info">No hay proyectos de ingeniería registrados</CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Trámites Mensuales */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Trámites Mensuales</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: dashboardData.monthlyProcedures.map((item) => item.month),
                datasets: [
                  {
                    label: "Cantidad de Trámites",
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointBorderColor: "#fff",
                    data: dashboardData.monthlyProcedures.map((item) => item.count),
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Cantidad",
                    },
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Solicitudes de Construcción */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Solicitudes de Construcción</CCardHeader>
          <CCardBody>
            {dashboardData.constructionRequests.length > 0 ? (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dashboardData.constructionRequests.map((request, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                      <CTableDataCell>{request.type}</CTableDataCell>
                      <CTableDataCell>{getStatusBadge(request.status)}</CTableDataCell>
                      <CTableDataCell>{request.requestDate}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <CAlert color="info">No hay solicitudes de construcción registradas</CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Constancias Catastrales */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Constancias Catastrales Emitidas</CCardHeader>
          <CCardBody>
            {dashboardData.cadastralCertificates.length > 0 ? (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Fecha de Emisión</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dashboardData.cadastralCertificates.map((certificate, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row">{certificate.id}</CTableHeaderCell>
                      <CTableDataCell>{certificate.type}</CTableDataCell>
                      <CTableDataCell>{certificate.issueDate}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <CAlert color="info">No hay constancias catastrales registradas</CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Estadísticas Catastrales */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Estadísticas Catastrales</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Terrenos Registrados</div>
                <strong>{dashboardData.cadastralStats.registeredLands}</strong>
              </CCol>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Propiedades Actualizadas</div>
                <strong>{dashboardData.cadastralStats.updatedProperties}</strong>
              </CCol>
            </CRow>
            <div className="mt-3">
              <div className="text-medium-emphasis">Recaudación de Impuestos</div>
              <strong>{formatCurrency(dashboardData.cadastralStats.taxCollection)}</strong>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Estado Financiero */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Estado Financiero</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Ingresos</div>
                <strong>{formatCurrency(dashboardData.financialStatus.income)}</strong>
              </CCol>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Gastos</div>
                <strong>{formatCurrency(dashboardData.financialStatus.expenses)}</strong>
              </CCol>
            </CRow>
            <div className="mt-3">
              <div className="text-medium-emphasis">Presupuesto Anual</div>
              <strong>{formatCurrency(dashboardData.financialStatus.annualBudget)}</strong>
            </div>
            <div className="mt-3">
              <div className="text-medium-emphasis">Balance</div>
              <strong
                className={
                  dashboardData.financialStatus.income - dashboardData.financialStatus.expenses >= 0
                    ? "text-success"
                    : "text-danger"
                }
              >
                {formatCurrency(dashboardData.financialStatus.income - dashboardData.financialStatus.expenses)}
              </strong>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
