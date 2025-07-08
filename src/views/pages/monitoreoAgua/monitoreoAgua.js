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
  CSpinner,
  CAlert,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormTextarea,
  CPagination,
  CPaginationItem,
  CWidgetStatsA,
  CFormInput,
  CFormLabel,
  CContainer,
} from "@coreui/react"
import { CChartLine } from "@coreui/react-chartjs"
import CIcon from "@coreui/icons-react"
import {
  cilDrop,
  cilWarning,
  cilCheckCircle,
  cilClock,
  cilReload,
  cilLocationPin,
  cilUser,
  cilCalendar,
  cilChart,
} from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const MonitoreoAgua = () => {
  const [activeTab, setActiveTab] = useState("calidad")
  const [calidadAgua, setCalidadAgua] = useState([])
  const [reportesAgua, setReportesAgua] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState(null)

  // Modal states
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [observaciones, setObservaciones] = useState("")

  // Pagination
  const [currentPageCalidad, setCurrentPageCalidad] = useState(1)
  const [currentPageReportes, setCurrentPageReportes] = useState(1)
  const itemsPerPage = 10

  const api = helpFetch()

  useEffect(() => {
    // Verificar usuario
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
    }

    fetchMonitoreoData()
  }, [])

  const fetchMonitoreoData = async () => {
    setLoading(true)
    setError("")

    try {
      // Fetch calidad del agua
      const calidadResponse = await api.get("Monitoreo_Agua")
      console.log("Calidad response:", calidadResponse)

      if (calidadResponse && !calidadResponse.error) {
        const calidadData = Array.isArray(calidadResponse) ? calidadResponse : []
        setCalidadAgua(calidadData)
      } else {
        console.error("Error en calidad:", calidadResponse)
        setCalidadAgua([])
      }

      // Fetch reportes de agua (usando la misma estructura por ahora)
      // En un sistema real, esto vendría de un endpoint diferente
      const reportesResponse = await api.get("Monitoreo_Agua")

      if (reportesResponse && !reportesResponse.error) {
        // Simular reportes basados en los datos de monitoreo
        const reportesData = Array.isArray(reportesResponse)
          ? reportesResponse
              .filter((item) => item.observaciones && item.observaciones.trim() !== "")
              .map((item) => ({
                ...item,
                id: item.ID_Monitoreo,
                description: item.observaciones || "Problema reportado",
                address: item.ubicacion || "Ubicación no especificada",
                incidentDate: item.fecha,
                reportedBy: item.inspector || "Sistema",
                status: item.estado === "Crítico" ? "Pendiente" : "Resuelto",
                fecha: item.fecha,
              }))
          : []
        setReportesAgua(reportesData)
      } else {
        setReportesAgua([])
      }
    } catch (err) {
      console.error("Error fetching monitoreo data:", err)
      setError("Error al cargar los datos de monitoreo. Verifique la conexión.")
      setCalidadAgua([])
      setReportesAgua([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setNewStatus(report.status || "Pendiente")
    setObservaciones(report.observaciones || "")
    setShowModal(true)
  }

  const handleUpdateReportStatus = async () => {
    if (!selectedReport || !newStatus) {
      setError("Por favor seleccione un estado")
      return
    }

    setLoading(true)
    setError("")

    try {
      const updatedReport = {
        ...selectedReport,
        estado: newStatus === "Resuelto" ? "Normal" : "Crítico",
        observaciones: observaciones,
        fechaRevision: new Date().toISOString().split("T")[0],
      }

      // Actualizar en Monitoreo_Agua
      const response = await api.put("Monitoreo_Agua", { body: updatedReport }, selectedReport.ID_Monitoreo)

      if (response?.error) {
        throw new Error(response.statusText || "Error al actualizar")
      }

      setSuccess(`Reporte actualizado a estado: ${newStatus}`)
      setShowModal(false)
      setObservaciones("")
      await fetchMonitoreoData()

      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      console.error("Error updating report:", err)
      setError("Error al actualizar el reporte: " + (err.message || "Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resuelto":
      case "normal":
        return "success"
      case "rechazado":
        return "danger"
      case "pendiente":
      case "crítico":
        return "warning"
      case "en proceso":
        return "info"
      default:
        return "primary"
    }
  }

  const getCalidadBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "normal":
      case "óptimo":
        return "success"
      case "aceptable":
        return "info"
      case "crítico":
      case "deficiente":
        return "danger"
      case "alerta":
        return "warning"
      default:
        return "primary"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha"
    try {
      return new Date(dateString).toLocaleDateString("es-ES")
    } catch {
      return dateString
    }
  }

  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  // Prepare chart data for water quality trends
  const getChartData = () => {
    const sortedData = [...calidadAgua]
      .filter((item) => item.ph && item.cloro)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(-10) // Últimos 10 registros

    return {
      labels: sortedData.map((item) => formatDate(item.fecha)),
      datasets: [
        {
          label: "pH",
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          data: sortedData.map((item) => Number.parseFloat(item.ph) || 0),
          tension: 0.1,
        },
        {
          label: "Cloro (mg/L)",
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          data: sortedData.map((item) => Number.parseFloat(item.cloro) || 0),
          tension: 0.1,
        },
        {
          label: "Turbidez (NTU)",
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          data: sortedData.map((item) => Number.parseFloat(item.turbidez) || 0),
          tension: 0.1,
        },
      ],
    }
  }

  // Statistics
  const getStatistics = () => {
    const totalMonitoreos = calidadAgua.length
    const criticos = calidadAgua.filter((item) => item.estado?.toLowerCase() === "crítico").length
    const normales = calidadAgua.filter((item) => item.estado?.toLowerCase() === "normal").length
    const reportesPendientes = reportesAgua.filter((item) => item.status?.toLowerCase() === "pendiente").length

    return { totalMonitoreos, criticos, normales, reportesPendientes }
  }

  if (loading && calidadAgua.length === 0 && reportesAgua.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando datos de monitoreo...</span>
      </div>
    )
  }

  const statistics = getStatistics()

  return (
    <div className="bg-light min-vh-100">
      <CContainer fluid className="py-4">
        <CRow>
          <CCol xs={12}>
            <CCard className="shadow-sm border-0">
              <CCardHeader className="bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">Monitoreo de Calidad del Agua</h4>
                    <small>Sistema de seguimiento y control de calidad hídrica</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CBadge color="light" className="text-primary px-3 py-2">
                      {calidadAgua.length} registros
                    </CBadge>
                    <CButton color="light" size="sm" onClick={fetchMonitoreoData} disabled={loading}>
                      {loading ? <CSpinner size="sm" /> : <CIcon icon={cilReload} />}
                    </CButton>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody className="p-4">
                {error && (
                  <CAlert color="danger" dismissible onClose={() => setError("")}>
                    {error}
                  </CAlert>
                )}

                {success && (
                  <CAlert color="success" dismissible onClose={() => setSuccess("")}>
                    {success}
                  </CAlert>
                )}

                {/* Statistics Cards */}
                <CRow className="mb-4">
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="primary"
                      value={statistics.totalMonitoreos.toString()}
                      title="Total Monitoreos"
                      action={<CIcon icon={cilDrop} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="success"
                      value={statistics.normales.toString()}
                      title="Estado Normal"
                      action={<CIcon icon={cilCheckCircle} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="warning"
                      value={statistics.criticos.toString()}
                      title="Estado Crítico"
                      action={<CIcon icon={cilWarning} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="info"
                      value={statistics.reportesPendientes.toString()}
                      title="Reportes Pendientes"
                      action={<CIcon icon={cilClock} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                </CRow>

                {/* Tabs */}
                <CNav variant="tabs" className="mb-3">
                  <CNavItem>
                    <CNavLink
                      active={activeTab === "calidad"}
                      onClick={() => setActiveTab("calidad")}
                      style={{ cursor: "pointer" }}
                    >
                      <CIcon icon={cilDrop} className="me-2" />
                      Calidad del Agua ({calidadAgua.length})
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      active={activeTab === "reportes"}
                      onClick={() => setActiveTab("reportes")}
                      style={{ cursor: "pointer" }}
                    >
                      <CIcon icon={cilWarning} className="me-2" />
                      Reportes de Problemas ({reportesAgua.length})
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      active={activeTab === "graficos"}
                      onClick={() => setActiveTab("graficos")}
                      style={{ cursor: "pointer" }}
                    >
                      <CIcon icon={cilChart} className="me-2" />
                      Gráficos y Tendencias
                    </CNavLink>
                  </CNavItem>
                </CNav>

                <CTabContent>
                  {/* Calidad del Agua */}
                  <CTabPane visible={activeTab === "calidad"}>
                    {calidadAgua.length === 0 ? (
                      <div className="text-center py-5">
                        <CIcon icon={cilDrop} size="3xl" className="text-muted mb-3" />
                        <h5 className="text-muted">No hay registros de calidad del agua</h5>
                        <p className="text-muted">Los datos de monitoreo aparecerán aquí cuando estén disponibles</p>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <CTable hover striped>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>ID</CTableHeaderCell>
                                <CTableHeaderCell>Fecha</CTableHeaderCell>
                                <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                <CTableHeaderCell>pH</CTableHeaderCell>
                                <CTableHeaderCell>Turbidez (NTU)</CTableHeaderCell>
                                <CTableHeaderCell>Cloro (mg/L)</CTableHeaderCell>
                                <CTableHeaderCell>Inspector</CTableHeaderCell>
                                <CTableHeaderCell>Estado</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {getPaginatedData(calidadAgua, currentPageCalidad).map((item, index) => (
                                <CTableRow key={item.ID_Monitoreo || index}>
                                  <CTableDataCell>
                                    <strong>#{item.ID_Monitoreo}</strong>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                      <CIcon icon={cilCalendar} size="sm" className="me-2 text-muted" />
                                      {formatDate(item.fecha)}
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                      <CIcon icon={cilLocationPin} size="sm" className="me-2 text-muted" />
                                      {item.ubicacion || "Sin especificar"}
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <span
                                      className={`fw-semibold ${Number.parseFloat(item.ph) >= 6.5 && Number.parseFloat(item.ph) <= 8.5 ? "text-success" : "text-warning"}`}
                                    >
                                      {item.ph}
                                    </span>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <span
                                      className={`fw-semibold ${Number.parseFloat(item.turbidez) <= 5 ? "text-success" : "text-warning"}`}
                                    >
                                      {item.turbidez}
                                    </span>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <span
                                      className={`fw-semibold ${Number.parseFloat(item.cloro) >= 0.2 && Number.parseFloat(item.cloro) <= 1.5 ? "text-success" : "text-warning"}`}
                                    >
                                      {item.cloro}
                                    </span>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                      <CIcon icon={cilUser} size="sm" className="me-2 text-muted" />
                                      {item.inspector || "Sin especificar"}
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color={getCalidadBadgeColor(item.estado)} className="px-2 py-1">
                                      {item.estado || "Normal"}
                                    </CBadge>
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </div>

                        {getTotalPages(calidadAgua.length) > 1 && (
                          <div className="d-flex justify-content-center mt-4">
                            <CPagination>
                              <CPaginationItem
                                disabled={currentPageCalidad === 1}
                                onClick={() => setCurrentPageCalidad(currentPageCalidad - 1)}
                              >
                                Anterior
                              </CPaginationItem>
                              {[...Array(getTotalPages(calidadAgua.length))].map((_, i) => (
                                <CPaginationItem
                                  key={i + 1}
                                  active={currentPageCalidad === i + 1}
                                  onClick={() => setCurrentPageCalidad(i + 1)}
                                >
                                  {i + 1}
                                </CPaginationItem>
                              ))}
                              <CPaginationItem
                                disabled={currentPageCalidad === getTotalPages(calidadAgua.length)}
                                onClick={() => setCurrentPageCalidad(currentPageCalidad + 1)}
                              >
                                Siguiente
                              </CPaginationItem>
                            </CPagination>
                          </div>
                        )}
                      </>
                    )}
                  </CTabPane>

                  {/* Reportes de Problemas */}
                  <CTabPane visible={activeTab === "reportes"}>
                    {reportesAgua.length === 0 ? (
                      <div className="text-center py-5">
                        <CIcon icon={cilWarning} size="3xl" className="text-muted mb-3" />
                        <h5 className="text-muted">No hay reportes de problemas</h5>
                        <p className="text-muted">Los reportes de problemas de agua aparecerán aquí</p>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <CTable hover striped>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>ID</CTableHeaderCell>
                                <CTableHeaderCell>Descripción</CTableHeaderCell>
                                <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                <CTableHeaderCell>Fecha Incidente</CTableHeaderCell>
                                <CTableHeaderCell>Reportado Por</CTableHeaderCell>
                                <CTableHeaderCell>Estado</CTableHeaderCell>
                                <CTableHeaderCell>Acciones</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {getPaginatedData(reportesAgua, currentPageReportes).map((report, index) => (
                                <CTableRow key={report.id || index}>
                                  <CTableDataCell>
                                    <strong>#{report.id}</strong>
                                  </CTableDataCell>
                                  <CTableDataCell>{report.description || "Sin descripción"}</CTableDataCell>
                                  <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                      <CIcon icon={cilLocationPin} size="sm" className="me-2 text-muted" />
                                      {report.address || "Sin dirección"}
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>{formatDate(report.incidentDate)}</CTableDataCell>
                                  <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                      <CIcon icon={cilUser} size="sm" className="me-2 text-muted" />
                                      {report.reportedBy || "Anónimo"}
                                    </div>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color={getBadgeColor(report.status)} className="px-2 py-1">
                                      {report.status || "Pendiente"}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CButton color="primary" size="sm" onClick={() => handleViewReport(report)}>
                                      Revisar
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </div>

                        {getTotalPages(reportesAgua.length) > 1 && (
                          <div className="d-flex justify-content-center mt-4">
                            <CPagination>
                              <CPaginationItem
                                disabled={currentPageReportes === 1}
                                onClick={() => setCurrentPageReportes(currentPageReportes - 1)}
                              >
                                Anterior
                              </CPaginationItem>
                              {[...Array(getTotalPages(reportesAgua.length))].map((_, i) => (
                                <CPaginationItem
                                  key={i + 1}
                                  active={currentPageReportes === i + 1}
                                  onClick={() => setCurrentPageReportes(i + 1)}
                                >
                                  {i + 1}
                                </CPaginationItem>
                              ))}
                              <CPaginationItem
                                disabled={currentPageReportes === getTotalPages(reportesAgua.length)}
                                onClick={() => setCurrentPageReportes(currentPageReportes + 1)}
                              >
                                Siguiente
                              </CPaginationItem>
                            </CPagination>
                          </div>
                        )}
                      </>
                    )}
                  </CTabPane>

                  {/* Gráficos y Tendencias */}
                  <CTabPane visible={activeTab === "graficos"}>
                    {calidadAgua.length === 0 ? (
                      <div className="text-center py-5">
                        <CIcon icon={cilChart} size="3xl" className="text-muted mb-3" />
                        <h5 className="text-muted">No hay datos suficientes para gráficos</h5>
                        <p className="text-muted">Se necesitan al menos algunos registros para mostrar tendencias</p>
                      </div>
                    ) : (
                      <CRow>
                        <CCol xs={12}>
                          <CCard>
                            <CCardHeader>
                              <h6 className="mb-0">Tendencia de Parámetros de Calidad del Agua</h6>
                            </CCardHeader>
                            <CCardBody>
                              <CChartLine
                                data={getChartData()}
                                options={{
                                  plugins: {
                                    legend: {
                                      display: true,
                                      position: "top",
                                    },
                                  },
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      title: {
                                        display: true,
                                        text: "Valores",
                                      },
                                    },
                                    x: {
                                      title: {
                                        display: true,
                                        text: "Fecha",
                                      },
                                    },
                                  },
                                  responsive: true,
                                  maintainAspectRatio: false,
                                }}
                                height={400}
                              />
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    )}
                  </CTabPane>
                </CTabContent>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Modal para revisar reportes */}
        <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
          <CModalHeader closeButton>
            <CModalTitle>
              <CIcon icon={cilWarning} className="me-2" />
              Revisar Reporte de Problema
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedReport && (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-3">Detalles del Reporte</h6>
                  <CRow>
                    <CCol md={6}>
                      <div className="mb-2">
                        <strong>ID:</strong> {selectedReport.id}
                      </div>
                      <div className="mb-2">
                        <strong>Fecha del Incidente:</strong> {formatDate(selectedReport.incidentDate)}
                      </div>
                      <div className="mb-2">
                        <strong>Reportado por:</strong> {selectedReport.reportedBy}
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-2">
                        <strong>Estado Actual:</strong>
                        <CBadge color={getBadgeColor(selectedReport.status)} className="ms-2 px-2 py-1">
                          {selectedReport.status}
                        </CBadge>
                      </div>
                      <div className="mb-2">
                        <strong>Fecha de Reporte:</strong> {formatDate(selectedReport.fecha)}
                      </div>
                    </CCol>
                  </CRow>

                  <div className="mt-3">
                    <strong>Descripción:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">{selectedReport.description}</div>
                  </div>

                  <div className="mt-3">
                    <strong>Ubicación:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">{selectedReport.address}</div>
                  </div>
                </div>

                <CForm>
                  <CRow>
                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel htmlFor="estado">Nuevo Estado *</CFormLabel>
                        <CFormSelect
                          id="estado"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          required
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="Resuelto">Resuelto</option>
                          <option value="Rechazado">Rechazado</option>
                        </CFormSelect>
                      </div>
                    </CCol>
                    <CCol md={6}>
                      <div className="mb-3">
                        <CFormLabel>Fecha de Revisión</CFormLabel>
                        <CFormInput type="text" value={new Date().toLocaleDateString("es-ES")} disabled />
                      </div>
                    </CCol>
                  </CRow>
                  <div className="mb-3">
                    <CFormLabel htmlFor="observaciones">Observaciones de la Revisión</CFormLabel>
                    <CFormTextarea
                      id="observaciones"
                      rows={4}
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Ingrese observaciones sobre las acciones tomadas, estado del problema, etc."
                    />
                  </div>
                </CForm>
              </>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={handleUpdateReportStatus} disabled={loading || !newStatus}>
              {loading ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                "Actualizar Estado"
              )}
            </CButton>
          </CModalFooter>
        </CModal>
      </CContainer>
    </div>
  )
}

export default MonitoreoAgua
