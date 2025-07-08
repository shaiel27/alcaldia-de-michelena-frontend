"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CSpinner,
  CBadge,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CWidgetStatsF,
  CListGroup,
  CListGroupItem,
  CPagination,
  CPaginationItem,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilSearch,
  cilCalendar,
  cilCheckCircle,
  cilClock,
  cilXCircle,
  cilInfo,
  cilHome,
  cilPeople,
  cilDescription,
  cilLocationPin,
  cilUser,
  cilReload,
  cilBuilding,
  cilDollar,
  cilWarning,
} from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const HistorialTramites = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedTramite, setSelectedTramite] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Data states
  const [solicitudesObra, setSolicitudesObra] = useState([])
  const [constancias, setConstancias] = useState([])
  const [solicitudesVenta, setSolicitudesVenta] = useState([])
  const [ayudas, setAyudas] = useState([])

  const api = helpFetch()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      fetchAllData(user.Cedula)
    } else {
      setError("Debe iniciar sesión para ver su historial")
      setLoading(false)
    }
  }, [])

  const fetchAllData = async (cedula) => {
    setLoading(true)
    setError("")

    try {
      // Fetch all data in parallel
      const [obrasRes, constanciasRes, ventasRes, ayudasRes] = await Promise.allSettled([
        api.get("Solicitud_de_obra"),
        api.get("Constancias"),
        api.get("Solicitud_Venta"),
        api.get("Ayuda"),
      ])

      // Process obras
      if (obrasRes.status === "fulfilled" && !obrasRes.value?.error) {
        const obras = Array.isArray(obrasRes.value) ? obrasRes.value.filter((item) => item.Cedula === cedula) : []
        setSolicitudesObra(obras)
      } else {
        setSolicitudesObra([])
      }

      // Process constancias
      if (constanciasRes.status === "fulfilled" && !constanciasRes.value?.error) {
        const constanciasData = Array.isArray(constanciasRes.value)
          ? constanciasRes.value.filter((item) => item.cedula === cedula)
          : []
        setConstancias(constanciasData)
      } else {
        setConstancias([])
      }

      // Process ventas
      if (ventasRes.status === "fulfilled" && !ventasRes.value?.error) {
        const ventas = Array.isArray(ventasRes.value) ? ventasRes.value.filter((item) => item.cedula === cedula) : []
        setSolicitudesVenta(ventas)
      } else {
        setSolicitudesVenta([])
      }

      // Process ayudas
      if (ayudasRes.status === "fulfilled" && !ayudasRes.value?.error) {
        const ayudasData = Array.isArray(ayudasRes.value)
          ? ayudasRes.value.filter((item) => item.cedulaUsuario === cedula)
          : []
        setAyudas(ayudasData)
      } else {
        setAyudas([])
      }

      console.log("Datos cargados para usuario:", cedula)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los datos. Verifique la conexión.")
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobada":
      case "aprobado":
        return "success"
      case "rechazada":
      case "rechazado":
        return "danger"
      case "pendiente":
        return "warning"
      case "en proceso":
        return "info"
      default:
        return "primary"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobada":
      case "aprobado":
        return cilCheckCircle
      case "rechazada":
      case "rechazado":
        return cilXCircle
      case "pendiente":
        return cilWarning
      case "en proceso":
        return cilInfo
      default:
        return cilClock
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha"
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("es-VE", {
      style: "currency",
      currency: "VES",
    })
  }

  const getAllTramites = () => {
    const todos = [
      ...solicitudesObra.map((item) => ({
        ...item,
        tipo: "Solicitud de Obra",
        id: item.ID_Solicitud_de_obra,
        fecha: item.Fecha,
        estado: item.Estatus || "Pendiente",
        descripcion: item.Descripcion,
        monto: item.Monto,
        ubicacion: item.Ubicacion,
        observaciones: item.Observacion,
        tiempoObra: item.Tiempo_Obra,
      })),
      ...constancias.map((item) => ({
        ...item,
        tipo: "Constancia Catastral",
        fecha: item.fecha,
        estado: item.estado || "Pendiente",
        descripcion: `Constancia ${item.tipo}`,
        ubicacion: `Terreno ID: ${item.idTerreno}`,
        observaciones: item.observaciones,
      })),
      ...solicitudesVenta.map((item) => ({
        ...item,
        tipo: "Solicitud de Venta",
        fecha: item.fecha,
        estado: item.estado || "Pendiente",
        descripcion: item.description || "Venta de propiedad",
        monto: item.price,
        ubicacion: `Propiedad ID: ${item.propertyId}`,
        observaciones: item.observaciones,
        tipoTransaccion: item.transactionType,
        lotes: `${item.lotsToSell}/${item.totalLots}`,
      })),
      ...ayudas.map((item) => ({
        ...item,
        tipo: "Solicitud de Ayuda",
        id: item.ID_Ayuda,
        fecha: item.Fecha || item.fechaSolicitud,
        estado: item.estado || "Pendiente",
        descripcion: item.tipoAyuda || "Ayuda Social",
        monto: item.Monto,
        beneficiario: item.cedulaBeneficiario,
        observaciones: item.observaciones,
      })),
    ]

    return todos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  const getFilteredTramites = () => {
    let tramites = getAllTramites()

    // Filter by tab
    if (activeTab !== "todos") {
      tramites = tramites.filter((item) => {
        switch (activeTab) {
          case "obras":
            return item.tipo === "Solicitud de Obra"
          case "constancias":
            return item.tipo === "Constancia Catastral"
          case "ventas":
            return item.tipo === "Solicitud de Venta"
          case "ayudas":
            return item.tipo === "Solicitud de Ayuda"
          default:
            return true
        }
      })
    }

    // Filter by status
    if (filterStatus) {
      tramites = tramites.filter((item) => item.estado?.toLowerCase() === filterStatus.toLowerCase())
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      tramites = tramites.filter(
        (item) =>
          item.descripcion?.toLowerCase().includes(term) ||
          item.ubicacion?.toLowerCase().includes(term) ||
          item.tipo?.toLowerCase().includes(term) ||
          item.id?.toString().includes(term),
      )
    }

    return tramites
  }

  const getPaginatedTramites = () => {
    const filtered = getFilteredTramites()
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredTramites().length / itemsPerPage)
  }

  const getStatistics = () => {
    const todos = getAllTramites()
    const total = todos.length
    const pendientes = todos.filter((t) => t.estado?.toLowerCase() === "pendiente").length
    const aprobados = todos.filter((t) => ["aprobada", "aprobado"].includes(t.estado?.toLowerCase())).length
    const rechazados = todos.filter((t) => ["rechazada", "rechazado"].includes(t.estado?.toLowerCase())).length
    const enProceso = todos.filter((t) => t.estado?.toLowerCase() === "en proceso").length

    return { total, pendientes, aprobados, rechazados, enProceso }
  }

  const handleViewDetails = (tramite) => {
    setSelectedTramite(tramite)
    setShowModal(true)
  }

  const TramiteCard = ({ tramite }) => (
    <CCard className="mb-3 shadow-sm border-0 h-100" style={{ transition: "all 0.3s ease" }}>
      <CCardBody className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <CIcon
                icon={
                  tramite.tipo === "Solicitud de Obra"
                    ? cilBuilding
                    : tramite.tipo === "Constancia Catastral"
                      ? cilDescription
                      : tramite.tipo === "Solicitud de Venta"
                        ? cilHome
                        : cilPeople
                }
                className="me-2 text-primary"
              />
              <h6 className="text-primary mb-0">{tramite.tipo}</h6>
            </div>
            <small className="text-muted">ID: {tramite.id}</small>
          </div>
          <CBadge color={getBadgeColor(tramite.estado)} className="px-3 py-2">
            <CIcon icon={getStatusIcon(tramite.estado)} size="sm" className="me-1" />
            {tramite.estado || "Sin estado"}
          </CBadge>
        </div>

        <div className="mb-3">
          <p className="mb-2 fw-semibold text-dark">{tramite.descripcion}</p>

          <CListGroup flush>
            {tramite.ubicacion && (
              <CListGroupItem className="px-0 py-1 border-0 bg-transparent">
                <CIcon icon={cilLocationPin} size="sm" className="me-2 text-muted" />
                <small className="text-muted">{tramite.ubicacion}</small>
              </CListGroupItem>
            )}

            <CListGroupItem className="px-0 py-1 border-0 bg-transparent">
              <CIcon icon={cilCalendar} size="sm" className="me-2 text-muted" />
              <small className="text-muted">{formatDate(tramite.fecha)}</small>
            </CListGroupItem>

            {tramite.monto && Number(tramite.monto) > 0 && (
              <CListGroupItem className="px-0 py-1 border-0 bg-transparent">
                <CIcon icon={cilDollar} size="sm" className="me-2 text-success" />
                <small className="text-success fw-semibold">{formatCurrency(tramite.monto)}</small>
              </CListGroupItem>
            )}

            {tramite.beneficiario && (
              <CListGroupItem className="px-0 py-1 border-0 bg-transparent">
                <CIcon icon={cilUser} size="sm" className="me-2 text-muted" />
                <small className="text-muted">Beneficiario: {tramite.beneficiario}</small>
              </CListGroupItem>
            )}

            {tramite.lotes && (
              <CListGroupItem className="px-0 py-1 border-0 bg-transparent">
                <CIcon icon={cilHome} size="sm" className="me-2 text-muted" />
                <small className="text-muted">Lotes: {tramite.lotes}</small>
              </CListGroupItem>
            )}
          </CListGroup>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="progress-container" style={{ width: "60%" }}>
            <small className="text-muted">Progreso</small>
            <CProgress
              className="mt-1"
              height={6}
              color={getBadgeColor(tramite.estado)}
              value={
                tramite.estado?.toLowerCase() === "aprobada" || tramite.estado?.toLowerCase() === "aprobado"
                  ? 100
                  : tramite.estado?.toLowerCase() === "en proceso"
                    ? 50
                    : tramite.estado?.toLowerCase() === "pendiente"
                      ? 25
                      : 0
              }
            />
          </div>
          <CButton color="primary" variant="outline" size="sm" onClick={() => handleViewDetails(tramite)}>
            Ver Detalles
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )

  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Verificando usuario...</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando historial de trámites...</span>
      </div>
    )
  }

  const statistics = getStatistics()
  const paginatedTramites = getPaginatedTramites()
  const totalPages = getTotalPages()

  return (
    <div className="bg-light min-vh-100">
      <CContainer fluid className="py-4">
        {/* Header */}
        <CRow className="mb-4">
          <CCol>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="text-dark mb-1">Mi Historial de Trámites</h2>
                <p className="text-muted mb-0">Seguimiento completo de todas sus gestiones municipales</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <div className="d-flex align-items-center text-muted">
                    <CIcon icon={cilUser} className="me-2" />
                    <div>
                      <div className="fw-semibold">
                        {currentUser.Nombre} {currentUser.Apellido}
                      </div>
                      <small>{currentUser.Cedula}</small>
                    </div>
                  </div>
                </div>
                <CButton
                  color="primary"
                  onClick={() => fetchAllData(currentUser.Cedula)}
                  disabled={loading}
                  className="d-flex align-items-center"
                >
                  {loading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilReload} className="me-2" />}
                  Actualizar
                </CButton>
              </div>
            </div>
          </CCol>
        </CRow>

        {error && (
          <CRow className="mb-4">
            <CCol>
              <CAlert color="danger" dismissible onClose={() => setError("")}>
                {error}
              </CAlert>
            </CCol>
          </CRow>
        )}

        {/* Statistics Cards */}
        <CRow className="mb-4">
          <CCol sm={6} lg={2}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              icon={<CIcon icon={cilDescription} height={24} />}
              title="Total"
              value={statistics.total.toString()}
            />
          </CCol>
          <CCol sm={6} lg={2}>
            <CWidgetStatsF
              className="mb-3"
              color="warning"
              icon={<CIcon icon={cilClock} height={24} />}
              title="Pendientes"
              value={statistics.pendientes.toString()}
            />
          </CCol>
          <CCol sm={6} lg={2}>
            <CWidgetStatsF
              className="mb-3"
              color="info"
              icon={<CIcon icon={cilInfo} height={24} />}
              title="En Proceso"
              value={statistics.enProceso.toString()}
            />
          </CCol>
          <CCol sm={6} lg={2}>
            <CWidgetStatsF
              className="mb-3"
              color="success"
              icon={<CIcon icon={cilCheckCircle} height={24} />}
              title="Aprobados"
              value={statistics.aprobados.toString()}
            />
          </CCol>
          <CCol sm={6} lg={2}>
            <CWidgetStatsF
              className="mb-3"
              color="danger"
              icon={<CIcon icon={cilXCircle} height={24} />}
              title="Rechazados"
              value={statistics.rechazados.toString()}
            />
          </CCol>
          <CCol sm={6} lg={2}>
            <CButton color="primary" className="h-100 w-100" style={{ minHeight: "80px" }}>
              <CIcon icon={cilHome} className="mb-2" />
              <br />
              Nuevo Trámite
            </CButton>
          </CCol>
        </CRow>

        {/* Filters and Search */}
        <CRow className="mb-4">
          <CCol md={6}>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Buscar por ID, descripción, ubicación o tipo..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </CInputGroup>
          </CCol>
          <CCol md={3}>
            <CFormSelect
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </CFormSelect>
          </CCol>
          <CCol md={3}>
            <CButton
              color="secondary"
              className="w-100"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("")
                setActiveTab("todos")
                setCurrentPage(1)
              }}
            >
              Limpiar Filtros
            </CButton>
          </CCol>
        </CRow>

        {/* Tabs */}
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-white border-bottom-0">
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  active={activeTab === "todos"}
                  onClick={() => {
                    setActiveTab("todos")
                    setCurrentPage(1)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CIcon icon={cilDescription} className="me-2" />
                  Todos ({statistics.total})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "obras"}
                  onClick={() => {
                    setActiveTab("obras")
                    setCurrentPage(1)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CIcon icon={cilBuilding} className="me-2" />
                  Obras ({solicitudesObra.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "constancias"}
                  onClick={() => {
                    setActiveTab("constancias")
                    setCurrentPage(1)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CIcon icon={cilDescription} className="me-2" />
                  Constancias ({constancias.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "ventas"}
                  onClick={() => {
                    setActiveTab("ventas")
                    setCurrentPage(1)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CIcon icon={cilHome} className="me-2" />
                  Ventas ({solicitudesVenta.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "ayudas"}
                  onClick={() => {
                    setActiveTab("ayudas")
                    setCurrentPage(1)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CIcon icon={cilPeople} className="me-2" />
                  Ayudas ({ayudas.length})
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>

          <CCardBody className="p-4">
            <CTabContent>
              <CTabPane visible={true}>
                {paginatedTramites.length === 0 ? (
                  <div className="text-center py-5">
                    <CIcon icon={cilDescription} size="3xl" className="text-muted mb-3" />
                    <h5 className="text-muted">No se encontraron trámites</h5>
                    <p className="text-muted">
                      {searchTerm || filterStatus
                        ? "Intente ajustar los filtros de búsqueda"
                        : "Aún no ha realizado ningún trámite"}
                    </p>
                    {!searchTerm && !filterStatus && <CButton color="primary">Realizar Primer Trámite</CButton>}
                  </div>
                ) : (
                  <>
                    <CRow>
                      {paginatedTramites.map((tramite, index) => (
                        <CCol key={`${tramite.tipo}-${tramite.id || index}`} md={6} lg={4} className="mb-4">
                          <TramiteCard tramite={tramite} />
                        </CCol>
                      ))}
                    </CRow>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-4">
                        <CPagination>
                          <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                            Anterior
                          </CPaginationItem>
                          {[...Array(totalPages)].map((_, i) => (
                            <CPaginationItem
                              key={i + 1}
                              active={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </CPaginationItem>
                          ))}
                          <CPaginationItem
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Siguiente
                          </CPaginationItem>
                        </CPagination>
                      </div>
                    )}
                  </>
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>

        {/* Modal for details */}
        <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
          <CModalHeader>
            <CModalTitle>
              <CIcon
                icon={
                  selectedTramite?.tipo === "Solicitud de Obra"
                    ? cilBuilding
                    : selectedTramite?.tipo === "Constancia Catastral"
                      ? cilDescription
                      : selectedTramite?.tipo === "Solicitud de Venta"
                        ? cilHome
                        : cilPeople
                }
                className="me-2"
              />
              Detalles del Trámite
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedTramite && (
              <div>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Tipo de Trámite:</strong>
                    <div className="mt-1">{selectedTramite.tipo}</div>
                  </CCol>
                  <CCol md={6}>
                    <strong>Estado:</strong>
                    <div className="mt-1">
                      <CBadge color={getBadgeColor(selectedTramite.estado)} className="px-3 py-2">
                        <CIcon icon={getStatusIcon(selectedTramite.estado)} size="sm" className="me-1" />
                        {selectedTramite.estado || "Sin estado"}
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>ID del Trámite:</strong>
                    <div className="mt-1">{selectedTramite.id}</div>
                  </CCol>
                  <CCol md={6}>
                    <strong>Fecha de Solicitud:</strong>
                    <div className="mt-1">{formatDate(selectedTramite.fecha)}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol xs={12}>
                    <strong>Descripción:</strong>
                    <div className="mt-1 p-3 bg-light rounded">{selectedTramite.descripcion}</div>
                  </CCol>
                </CRow>

                {selectedTramite.ubicacion && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Ubicación/Referencia:</strong>
                      <div className="mt-1">{selectedTramite.ubicacion}</div>
                    </CCol>
                  </CRow>
                )}

                {selectedTramite.monto && Number(selectedTramite.monto) > 0 && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Monto:</strong>
                      <div className="mt-1 text-success fw-semibold fs-5">{formatCurrency(selectedTramite.monto)}</div>
                    </CCol>
                  </CRow>
                )}

                {selectedTramite.observaciones && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Observaciones:</strong>
                      <div className="mt-1 p-3 bg-light rounded">{selectedTramite.observaciones}</div>
                    </CCol>
                  </CRow>
                )}

                {selectedTramite.beneficiario && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Beneficiario:</strong>
                      <div className="mt-1">{selectedTramite.beneficiario}</div>
                    </CCol>
                  </CRow>
                )}

                {selectedTramite.tiempoObra && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Tiempo Estimado de Obra:</strong>
                      <div className="mt-1">{selectedTramite.tiempoObra}</div>
                    </CCol>
                  </CRow>
                )}

                {selectedTramite.lotes && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Lotes a Vender:</strong>
                      <div className="mt-1">{selectedTramite.lotes}</div>
                    </CCol>
                  </CRow>
                )}

                {selectedTramite.tipoTransaccion && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Tipo de Transacción:</strong>
                      <div className="mt-1">
                        <CBadge color={selectedTramite.tipoTransaccion === "sell" ? "warning" : "info"}>
                          {selectedTramite.tipoTransaccion === "sell" ? "Venta" : "Transferencia"}
                        </CBadge>
                      </div>
                    </CCol>
                  </CRow>
                )}
              </div>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </CButton>
          </CModalFooter>
        </CModal>
      </CContainer>
    </div>
  )
}

export default HistorialTramites
