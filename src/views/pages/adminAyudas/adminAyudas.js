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
  CAlert,
  CBadge,
  CSpinner,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormTextarea,
  CPagination,
  CPaginationItem,
  CFormInput,
  CInputGroup,
  CWidgetStatsA,
  CContainer,
  CInputGroupText,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormSelect,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilPeople, cilCheck, cilX, cilClock, cilSearch, cilOptions, cilReload } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const AdminAyudas = () => {
  const [ayudas, setAyudas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState(null)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [selectedAyuda, setSelectedAyuda] = useState(null)
  const [modalAction, setModalAction] = useState("")
  const [observaciones, setObservaciones] = useState("")

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  const api = helpFetch()

  useEffect(() => {
    // Verificar usuario administrador
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      if (user.Rol !== "Administrador") {
        setError("No tiene permisos para acceder a esta sección")
        return
      }
    } else {
      setError("Debe iniciar sesión para acceder")
      return
    }

    fetchAyudas()
  }, [])

  const fetchAyudas = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await api.get("Ayuda")

      if (response?.error) {
        throw new Error("Error al obtener las ayudas")
      }

      const ayudasData = Array.isArray(response) ? response : []
      console.log("Ayudas obtenidas:", ayudasData)
      setAyudas(ayudasData)
    } catch (err) {
      console.error("Error fetching ayudas:", err)
      setError("Error al cargar las solicitudes de ayuda. Verifique la conexión.")
      setAyudas([])
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAyuda = (ayuda, action) => {
    setSelectedAyuda(ayuda)
    setModalAction(action)
    setObservaciones(ayuda.observaciones || "")
    setShowModal(true)
  }

  const handleModalSubmit = async () => {
    if (!selectedAyuda || !currentUser) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const updatedAyuda = {
        ...selectedAyuda,
        estado: modalAction === "approve" ? "Aprobada" : "Rechazada",
        observaciones: observaciones.trim(),
        fechaRevision: new Date().toISOString().split("T")[0],
        revisadoPor: currentUser.Cedula,
      }

      const response = await api.put("Ayuda", { body: updatedAyuda }, selectedAyuda.ID_Ayuda)

      if (response?.error) {
        throw new Error("Error al actualizar la ayuda")
      }

      setSuccess(`Solicitud ${modalAction === "approve" ? "aprobada" : "rechazada"} exitosamente`)

      // Actualizar la lista
      await fetchAyudas()

      // Cerrar modal
      setShowModal(false)
      setSelectedAyuda(null)
      setObservaciones("")

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      console.error("Error updating ayuda:", err)
      setError("Error al actualizar la solicitud. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobada":
        return "success"
      case "rechazada":
        return "danger"
      case "pendiente":
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

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("es-VE", {
      style: "currency",
      currency: "VES",
    })
  }

  // Filter functions
  const getFilteredAyudas = () => {
    let filtered = ayudas

    if (filterStatus) {
      filtered = filtered.filter((ayuda) => (ayuda.estado || "Pendiente").toLowerCase() === filterStatus.toLowerCase())
    }

    if (filterType) {
      filtered = filtered.filter((ayuda) => ayuda.tipoAyuda?.toLowerCase().includes(filterType.toLowerCase()))
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (ayuda) =>
          ayuda.cedulaUsuario?.toLowerCase().includes(term) ||
          ayuda.cedulaBeneficiario?.toLowerCase().includes(term) ||
          ayuda.tipoAyuda?.toLowerCase().includes(term) ||
          ayuda.ID_Ayuda?.toString().includes(term),
      )
    }

    return filtered
  }

  const getPaginatedAyudas = () => {
    const filtered = getFilteredAyudas()
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredAyudas().length / itemsPerPage)
  }

  // Statistics
  const getStatistics = () => {
    const total = ayudas.length
    const pendientes = ayudas.filter((a) => (a.estado || "Pendiente") === "Pendiente").length
    const aprobadas = ayudas.filter((a) => a.estado === "Aprobada").length
    const rechazadas = ayudas.filter((a) => a.estado === "Rechazada").length

    const totalMonto = ayudas.filter((a) => a.estado === "Aprobada").reduce((sum, a) => sum + Number(a.Monto || 0), 0)

    return { total, pendientes, aprobadas, rechazadas, totalMonto }
  }

  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Verificando permisos...</span>
      </div>
    )
  }

  const statistics = getStatistics()
  const paginatedAyudas = getPaginatedAyudas()
  const totalPages = getTotalPages()

  return (
    <div className="bg-light min-vh-100">
      <CContainer fluid className="py-4">
        <CRow>
          <CCol xs={12}>
            <CCard className="shadow-sm border-0">
              <CCardHeader className="bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">Administración de Ayudas Sociales</h4>
                    <small>Gestión y revisión de solicitudes de ayuda</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CBadge color="light" className="text-primary px-3 py-2">
                      {ayudas.length} solicitudes
                    </CBadge>
                    <CButton color="light" size="sm" onClick={fetchAyudas} disabled={loading}>
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
                      value={statistics.total.toString()}
                      title="Total Solicitudes"
                      action={<CIcon icon={cilPeople} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="warning"
                      value={statistics.pendientes.toString()}
                      title="Pendientes"
                      action={<CIcon icon={cilClock} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="success"
                      value={statistics.aprobadas.toString()}
                      title="Aprobadas"
                      action={<CIcon icon={cilCheck} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CWidgetStatsA
                      className="mb-4"
                      color="danger"
                      value={statistics.rechazadas.toString()}
                      title="Rechazadas"
                      action={<CIcon icon={cilX} height={52} className="my-4 text-white" />}
                    />
                  </CCol>
                </CRow>

                {/* Resumen Financiero */}
                <CRow className="mb-4">
                  <CCol lg={12}>
                    <CCard>
                      <CCardHeader>
                        <h6 className="mb-0">Resumen Financiero</h6>
                      </CCardHeader>
                      <CCardBody>
                        <div className="text-center">
                          <h3 className="text-success">{formatCurrency(statistics.totalMonto)}</h3>
                          <p className="text-muted">Total en ayudas aprobadas</p>
                          <hr />
                          <div className="row text-center">
                            <div className="col">
                              <div className="text-primary h5">{statistics.aprobadas}</div>
                              <div className="text-muted small">Aprobadas</div>
                            </div>
                            <div className="col">
                              <div className="text-warning h5">{statistics.pendientes}</div>
                              <div className="text-muted small">Pendientes</div>
                            </div>
                            <div className="col">
                              <div className="text-success h5">
                                {statistics.total > 0 ? Math.round((statistics.aprobadas / statistics.total) * 100) : 0}
                                %
                              </div>
                              <div className="text-muted small">Tasa Aprobación</div>
                            </div>
                          </div>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>

                {/* Filters */}
                <CRow className="mb-4">
                  <CCol md={4}>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilSearch} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Buscar por cédula, ID o tipo..."
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
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value)
                        setCurrentPage(1)
                      }}
                    >
                      <option value="">Todos los tipos</option>
                      <option value="Alimentaria">Ayuda Alimentaria</option>
                      <option value="Médica">Ayuda Médica</option>
                      <option value="Educativa">Ayuda Educativa</option>
                      <option value="Habitacional">Ayuda Habitacional</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CButton
                      color="secondary"
                      className="w-100"
                      onClick={() => {
                        setSearchTerm("")
                        setFilterStatus("")
                        setFilterType("")
                        setCurrentPage(1)
                      }}
                    >
                      Limpiar
                    </CButton>
                  </CCol>
                </CRow>

                {/* Table */}
                {loading ? (
                  <div className="text-center py-4">
                    <CSpinner color="primary" />
                    <div className="mt-2">Cargando solicitudes...</div>
                  </div>
                ) : paginatedAyudas.length === 0 ? (
                  <div className="text-center py-5">
                    <CIcon icon={cilPeople} size="3xl" className="text-muted mb-3" />
                    <h5 className="text-muted">No se encontraron solicitudes</h5>
                    <p className="text-muted">
                      {searchTerm || filterStatus || filterType
                        ? "Intente ajustar los filtros de búsqueda"
                        : "No hay solicitudes de ayuda registradas"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <CTable hover striped>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>ID</CTableHeaderCell>
                            <CTableHeaderCell>Solicitante</CTableHeaderCell>
                            <CTableHeaderCell>Beneficiario</CTableHeaderCell>
                            <CTableHeaderCell>Tipo de Ayuda</CTableHeaderCell>
                            <CTableHeaderCell>Monto</CTableHeaderCell>
                            <CTableHeaderCell>Fecha</CTableHeaderCell>
                            <CTableHeaderCell>Estado</CTableHeaderCell>
                            <CTableHeaderCell>Acciones</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {paginatedAyudas.map((ayuda) => (
                            <CTableRow key={ayuda.ID_Ayuda}>
                              <CTableDataCell>
                                <strong>#{ayuda.ID_Ayuda}</strong>
                              </CTableDataCell>
                              <CTableDataCell>{ayuda.cedulaUsuario}</CTableDataCell>
                              <CTableDataCell>{ayuda.cedulaBeneficiario}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color="info" className="px-2 py-1">
                                  {ayuda.tipoAyuda}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <span className="text-success fw-semibold">{formatCurrency(ayuda.Monto)}</span>
                              </CTableDataCell>
                              <CTableDataCell>{formatDate(ayuda.Fecha || ayuda.fechaSolicitud)}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={getBadgeColor(ayuda.estado || "Pendiente")} className="px-2 py-1">
                                  {ayuda.estado || "Pendiente"}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                <CDropdown>
                                  <CDropdownToggle color="primary" variant="outline" size="sm">
                                    <CIcon icon={cilOptions} />
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    {(ayuda.estado || "Pendiente") === "Pendiente" && (
                                      <>
                                        <CDropdownItem onClick={() => handleReviewAyuda(ayuda, "approve")}>
                                          <CIcon icon={cilCheck} className="me-2 text-success" />
                                          Aprobar
                                        </CDropdownItem>
                                        <CDropdownItem onClick={() => handleReviewAyuda(ayuda, "reject")}>
                                          <CIcon icon={cilX} className="me-2 text-danger" />
                                          Rechazar
                                        </CDropdownItem>
                                      </>
                                    )}
                                    <CDropdownItem onClick={() => handleReviewAyuda(ayuda, "view")}>
                                      <CIcon icon={cilPeople} className="me-2 text-info" />
                                      Ver Detalles
                                    </CDropdownItem>
                                  </CDropdownMenu>
                                </CDropdown>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </div>

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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Modal for Review */}
        <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
          <CModalHeader>
            <CModalTitle>
              {modalAction === "approve"
                ? "Aprobar Solicitud"
                : modalAction === "reject"
                  ? "Rechazar Solicitud"
                  : "Detalles de la Solicitud"}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedAyuda && (
              <div>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>ID de Solicitud:</strong>
                    <div>#{selectedAyuda.ID_Ayuda}</div>
                  </CCol>
                  <CCol md={6}>
                    <strong>Estado Actual:</strong>
                    <div>
                      <CBadge color={getBadgeColor(selectedAyuda.estado || "Pendiente")} className="px-2 py-1">
                        {selectedAyuda.estado || "Pendiente"}
                      </CBadge>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Solicitante:</strong>
                    <div>{selectedAyuda.cedulaUsuario}</div>
                  </CCol>
                  <CCol md={6}>
                    <strong>Beneficiario:</strong>
                    <div>{selectedAyuda.cedulaBeneficiario}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Tipo de Ayuda:</strong>
                    <div>{selectedAyuda.tipoAyuda}</div>
                  </CCol>
                  <CCol md={6}>
                    <strong>Monto Solicitado:</strong>
                    <div className="text-success fw-semibold">{formatCurrency(selectedAyuda.Monto)}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <strong>Fecha de Solicitud:</strong>
                    <div>{formatDate(selectedAyuda.Fecha || selectedAyuda.fechaSolicitud)}</div>
                  </CCol>
                  {selectedAyuda.fechaRevision && (
                    <CCol md={6}>
                      <strong>Fecha de Revisión:</strong>
                      <div>{formatDate(selectedAyuda.fechaRevision)}</div>
                    </CCol>
                  )}
                </CRow>

                {selectedAyuda.revisadoPor && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Revisado por:</strong>
                      <div>{selectedAyuda.revisadoPor}</div>
                    </CCol>
                  </CRow>
                )}

                {modalAction !== "view" && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <CForm>
                        <div className="mb-3">
                          <label className="form-label">
                            <strong>Observaciones:</strong>
                          </label>
                          <CFormTextarea
                            rows={4}
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder={
                              modalAction === "approve"
                                ? "Ingrese observaciones para la aprobación (opcional)"
                                : "Ingrese el motivo del rechazo (requerido)"
                            }
                          />
                        </div>
                      </CForm>
                    </CCol>
                  </CRow>
                )}

                {selectedAyuda.observaciones && (
                  <CRow className="mb-3">
                    <CCol xs={12}>
                      <strong>Observaciones Actuales:</strong>
                      <div className="mt-1 p-3 bg-light rounded">{selectedAyuda.observaciones}</div>
                    </CCol>
                  </CRow>
                )}
              </div>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </CButton>
            {modalAction !== "view" && (
              <CButton
                color={modalAction === "approve" ? "success" : "danger"}
                onClick={handleModalSubmit}
                disabled={loading || (modalAction === "reject" && !observaciones.trim())}
              >
                {loading ? (
                  <CSpinner size="sm" className="me-2" />
                ) : (
                  <CIcon icon={modalAction === "approve" ? cilCheck : cilX} className="me-2" />
                )}
                {modalAction === "approve" ? "Aprobar" : "Rechazar"}
              </CButton>
            )}
          </CModalFooter>
        </CModal>
      </CContainer>
    </div>
  )
}

export default AdminAyudas
