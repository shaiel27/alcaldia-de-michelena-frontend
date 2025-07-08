"use client"

import { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormInput,
  CInputGroup,
  CWidgetStatsA,
  CFormLabel,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilBuilding, cilHome, cilDescription, cilCheckCircle, cilClock, cilReload } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const AdminRequestsApproval = () => {
  const [activeTab, setActiveTab] = useState("obras")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Estados para cada tipo de solicitud
  const [solicitudesObra, setSolicitudesObra] = useState([])
  const [constancias, setConstancias] = useState([])
  const [solicitudesVenta, setSolicitudesVenta] = useState([])

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [observaciones, setObservaciones] = useState("")

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  const api = helpFetch()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    setError("")

    try {
      const [obrasResponse, constanciasResponse, ventasResponse] = await Promise.allSettled([
        api.get("Solicitud_de_obra"),
        api.get("Constancias"),
        api.get("Solicitud_Venta"),
      ])

      // Procesar solicitudes de obra
      if (obrasResponse.status === "fulfilled" && !obrasResponse.value?.error) {
        setSolicitudesObra(Array.isArray(obrasResponse.value) ? obrasResponse.value : [])
      } else {
        console.error("Error fetching obras:", obrasResponse)
        setSolicitudesObra([])
      }

      // Procesar constancias
      if (constanciasResponse.status === "fulfilled" && !constanciasResponse.value?.error) {
        setConstancias(Array.isArray(constanciasResponse.value) ? constanciasResponse.value : [])
      } else {
        console.error("Error fetching constancias:", constanciasResponse)
        setConstancias([])
      }

      // Procesar solicitudes de venta
      if (ventasResponse.status === "fulfilled" && !ventasResponse.value?.error) {
        setSolicitudesVenta(Array.isArray(ventasResponse.value) ? ventasResponse.value : [])
      } else {
        console.error("Error fetching ventas:", ventasResponse)
        setSolicitudesVenta([])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar las solicitudes. Verifique la conexión.")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (item, type) => {
    setSelectedItem({ ...item, type })
    setNewStatus(item.Estatus || item.estado || "Pendiente")
    setObservaciones(item.Observacion || item.observaciones || "")
    setShowModal(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedItem || !newStatus) {
      setError("Por favor seleccione un estado")
      return
    }

    setLoading(true)
    setError("")

    try {
      let endpoint = ""
      let updatedItem = {}
      let itemId = ""

      switch (selectedItem.type) {
        case "obra":
          endpoint = "Solicitud_de_obra"
          itemId = selectedItem.ID_Solicitud_de_obra
          updatedItem = {
            ...selectedItem,
            Estatus: newStatus,
            Observacion: observaciones,
            fechaRevision: new Date().toISOString().split("T")[0],
          }
          break
        case "constancia":
          endpoint = "Constancias"
          itemId = selectedItem.id
          updatedItem = {
            ...selectedItem,
            estado: newStatus,
            observaciones: observaciones,
            fechaRevision: new Date().toISOString().split("T")[0],
          }
          break
        case "venta":
          endpoint = "Solicitud_Venta"
          itemId = selectedItem.id
          updatedItem = {
            ...selectedItem,
            estado: newStatus,
            observaciones: observaciones,
            fechaRevision: new Date().toISOString().split("T")[0],
          }
          break
        default:
          throw new Error("Tipo de solicitud no válido")
      }

      // Remover la propiedad type antes de enviar
      delete updatedItem.type

      const response = await api.put(endpoint, { body: updatedItem }, itemId)

      if (response?.error) {
        throw new Error(response.statusText || "Error al actualizar")
      }

      setSuccess(`Solicitud actualizada a estado: ${newStatus}`)
      setShowModal(false)
      setObservaciones("")
      await fetchAllData()

      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      console.error("Error updating status:", err)
      setError("Error al actualizar la solicitud: " + (err.message || "Error desconocido"))
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
  const getFilteredData = (data, statusField = "Estatus") => {
    let filtered = data

    if (filterStatus) {
      filtered = filtered.filter(
        (item) => (item[statusField] || item.estado || "Pendiente").toLowerCase() === filterStatus.toLowerCase(),
      )
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.Cedula?.toLowerCase().includes(term) ||
          item.cedula?.toLowerCase().includes(term) ||
          item.Descripcion?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.Ubicacion?.toLowerCase().includes(term) ||
          item.tipo?.toLowerCase().includes(term) ||
          item.ID_Solicitud_de_obra?.toString().includes(term) ||
          item.id?.toString().includes(term),
      )
    }

    return filtered
  }

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  // Statistics
  const getStatistics = () => {
    const totalObras = solicitudesObra.length
    const obrasPendientes = solicitudesObra.filter((s) => (s.Estatus || "Pendiente") === "Pendiente").length
    const obrasAprobadas = solicitudesObra.filter((s) => s.Estatus === "Aprobada").length

    const totalConstancias = constancias.length
    const constanciasPendientes = constancias.filter((c) => (c.estado || "Pendiente") === "Pendiente").length
    const constanciasAprobadas = constancias.filter((c) => c.estado === "Aprobada").length

    const totalVentas = solicitudesVenta.length
    const ventasPendientes = solicitudesVenta.filter((v) => (v.estado || "Pendiente") === "Pendiente").length
    const ventasAprobadas = solicitudesVenta.filter((v) => v.estado === "Aprobada").length

    return {
      totalObras,
      obrasPendientes,
      obrasAprobadas,
      totalConstancias,
      constanciasPendientes,
      constanciasAprobadas,
      totalVentas,
      ventasPendientes,
      ventasAprobadas,
    }
  }

  const statistics = getStatistics()

  const renderObrasTab = () => {
    const filteredObras = getFilteredData(solicitudesObra, "Estatus")
    const paginatedObras = getPaginatedData(filteredObras)

    return (
      <>
        {/* Statistics for Obras */}
        <CRow className="mb-4">
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="primary"
              value={statistics.totalObras.toString()}
              title="Total Solicitudes"
              action={<CIcon icon={cilBuilding} height={52} className="my-4 text-white" />}
            />
          </CCol>
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="warning"
              value={statistics.obrasPendientes.toString()}
              title="Pendientes"
              action={<CIcon icon={cilClock} height={52} className="my-4 text-white" />}
            />
          </CCol>
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="success"
              value={statistics.obrasAprobadas.toString()}
              title="Aprobadas"
              action={<CIcon icon={cilCheckCircle} height={52} className="my-4 text-white" />}
            />
          </CCol>
        </CRow>

        <CTable hover responsive striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Cédula</CTableHeaderCell>
              <CTableHeaderCell>Descripción</CTableHeaderCell>
              <CTableHeaderCell>Ubicación</CTableHeaderCell>
              <CTableHeaderCell>Monto</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedObras.length > 0 ? (
              paginatedObras.map((obra, index) => (
                <CTableRow key={obra.ID_Solicitud_de_obra || index}>
                  <CTableDataCell>{obra.ID_Solicitud_de_obra}</CTableDataCell>
                  <CTableDataCell>{obra.Cedula}</CTableDataCell>
                  <CTableDataCell>{obra.Descripcion}</CTableDataCell>
                  <CTableDataCell>{obra.Ubicacion}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(obra.Monto)}</CTableDataCell>
                  <CTableDataCell>{formatDate(obra.Fecha)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getBadgeColor(obra.Estatus || "Pendiente")}>{obra.Estatus || "Pendiente"}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleReview(obra, "obra")}>
                      Revisar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  No hay solicitudes de obra
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        {getTotalPages(filteredObras.length) > 1 && (
          <CPagination align="center" className="mt-3">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Anterior
            </CPaginationItem>
            {[...Array(getTotalPages(filteredObras.length))].map((_, i) => (
              <CPaginationItem key={i + 1} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === getTotalPages(filteredObras.length)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        )}
      </>
    )
  }

  const renderConstanciasTab = () => {
    const filteredConstancias = getFilteredData(constancias, "estado")
    const paginatedConstancias = getPaginatedData(filteredConstancias)

    return (
      <>
        {/* Statistics for Constancias */}
        <CRow className="mb-4">
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="info"
              value={statistics.totalConstancias.toString()}
              title="Total Constancias"
              action={<CIcon icon={cilDescription} height={52} className="my-4 text-white" />}
            />
          </CCol>
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="warning"
              value={statistics.constanciasPendientes.toString()}
              title="Pendientes"
              action={<CIcon icon={cilClock} height={52} className="my-4 text-white" />}
            />
          </CCol>
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="success"
              value={statistics.constanciasAprobadas.toString()}
              title="Aprobadas"
              action={<CIcon icon={cilCheckCircle} height={52} className="my-4 text-white" />}
            />
          </CCol>
        </CRow>

        <CTable hover responsive striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Cédula</CTableHeaderCell>
              <CTableHeaderCell>Terreno</CTableHeaderCell>
              <CTableHeaderCell>Tipo</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedConstancias.length > 0 ? (
              paginatedConstancias.map((constancia, index) => (
                <CTableRow key={constancia.id || index}>
                  <CTableDataCell>{constancia.id}</CTableDataCell>
                  <CTableDataCell>{constancia.cedula}</CTableDataCell>
                  <CTableDataCell>{constancia.idTerreno}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{constancia.tipo}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{formatDate(constancia.fecha)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getBadgeColor(constancia.estado || "Pendiente")}>
                      {constancia.estado || "Pendiente"}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleReview(constancia, "constancia")}>
                      Revisar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center">
                  No hay constancias registradas
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        {getTotalPages(filteredConstancias.length) > 1 && (
          <CPagination align="center" className="mt-3">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Anterior
            </CPaginationItem>
            {[...Array(getTotalPages(filteredConstancias.length))].map((_, i) => (
              <CPaginationItem key={i + 1} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === getTotalPages(filteredConstancias.length)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        )}
      </>
    )
  }

  const renderVentasTab = () => {
    const filteredVentas = getFilteredData(solicitudesVenta, "estado")
    const paginatedVentas = getPaginatedData(filteredVentas)

    return (
      <>
        {/* Statistics for Ventas */}
        <CRow className="mb-4">
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="secondary"
              value={statistics.totalVentas.toString()}
              title="Total Ventas"
              action={<CIcon icon={cilHome} height={52} className="my-4 text-white" />}
            />
          </CCol>
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="warning"
              value={statistics.ventasPendientes.toString()}
              title="Pendientes"
              action={<CIcon icon={cilClock} height={52} className="my-4 text-white" />}
            />
          </CCol>
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="success"
              value={statistics.ventasAprobadas.toString()}
              title="Aprobadas"
              action={<CIcon icon={cilCheckCircle} height={52} className="my-4 text-white" />}
            />
          </CCol>
        </CRow>

        <CTable hover responsive striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Cédula</CTableHeaderCell>
              <CTableHeaderCell>Propiedad</CTableHeaderCell>
              <CTableHeaderCell>Tipo</CTableHeaderCell>
              <CTableHeaderCell>Precio</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {paginatedVentas.length > 0 ? (
              paginatedVentas.map((venta, index) => (
                <CTableRow key={venta.id || index}>
                  <CTableDataCell>{venta.id}</CTableDataCell>
                  <CTableDataCell>{venta.cedula}</CTableDataCell>
                  <CTableDataCell>{venta.propertyId}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={venta.transactionType === "sell" ? "warning" : "info"}>
                      {venta.transactionType === "sell" ? "Venta" : "Transferencia"}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{formatCurrency(venta.price)}</CTableDataCell>
                  <CTableDataCell>{formatDate(venta.fecha)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getBadgeColor(venta.estado || "Pendiente")}>{venta.estado || "Pendiente"}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleReview(venta, "venta")}>
                      Revisar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  No hay solicitudes de venta
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        {getTotalPages(filteredVentas.length) > 1 && (
          <CPagination align="center" className="mt-3">
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Anterior
            </CPaginationItem>
            {[...Array(getTotalPages(filteredVentas.length))].map((_, i) => (
              <CPaginationItem key={i + 1} active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === getTotalPages(filteredVentas.length)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </CPaginationItem>
          </CPagination>
        )}
      </>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Administración de Solicitudes</strong>
                <small className="ms-2 text-muted">Revisión y aprobación de trámites</small>
              </div>
              <CButton color="info" onClick={fetchAllData} disabled={loading} size="sm">
                {loading ? <CSpinner size="sm" className="me-2" /> : <CIcon icon={cilReload} className="me-2" />}
                Actualizar
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
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

            {/* Filters */}
            <CRow className="mb-3">
              <CCol md={4}>
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
              <CCol md={6}>
                <CInputGroup>
                  <CFormInput
                    placeholder="Buscar por cédula, descripción, ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setSearchTerm("")
                      setCurrentPage(1)
                    }}
                    disabled={!searchTerm}
                  >
                    Limpiar
                  </CButton>
                </CInputGroup>
              </CCol>
            </CRow>

            {/* Tabs */}
            <CNav variant="tabs" className="mb-3">
              <CNavItem>
                <CNavLink
                  active={activeTab === "obras"}
                  onClick={() => {
                    setActiveTab("obras")
                    setCurrentPage(1)
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Solicitudes de Obra ({statistics.totalObras})
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
                  Constancias ({statistics.totalConstancias})
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
                  Solicitudes de Venta ({statistics.totalVentas})
                </CNavLink>
              </CNavItem>
            </CNav>

            {/* Tab Content */}
            <CTabContent>
              <CTabPane visible={activeTab === "obras"}>{renderObrasTab()}</CTabPane>
              <CTabPane visible={activeTab === "constancias"}>{renderConstanciasTab()}</CTabPane>
              <CTabPane visible={activeTab === "ventas"}>{renderVentasTab()}</CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para revisar solicitudes */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>
            Revisar{" "}
            {selectedItem?.type === "obra"
              ? "Solicitud de Obra"
              : selectedItem?.type === "constancia"
                ? "Constancia"
                : "Solicitud de Venta"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <>
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="mb-3">Detalles de la Solicitud</h6>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-2">
                      <strong>ID:</strong> {selectedItem.id || selectedItem.ID_Solicitud_de_obra}
                    </div>
                    <div className="mb-2">
                      <strong>Cédula:</strong> {selectedItem.Cedula || selectedItem.cedula}
                    </div>
                    <div className="mb-2">
                      <strong>Fecha:</strong> {formatDate(selectedItem.Fecha || selectedItem.fecha)}
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-2">
                      <strong>Estado Actual:</strong>
                      <CBadge
                        color={getBadgeColor(selectedItem.Estatus || selectedItem.estado || "Pendiente")}
                        className="ms-2"
                      >
                        {selectedItem.Estatus || selectedItem.estado || "Pendiente"}
                      </CBadge>
                    </div>
                    {selectedItem.Monto && (
                      <div className="mb-2">
                        <strong>Monto:</strong> {formatCurrency(selectedItem.Monto)}
                      </div>
                    )}
                    {selectedItem.price && (
                      <div className="mb-2">
                        <strong>Precio:</strong> {formatCurrency(selectedItem.price)}
                      </div>
                    )}
                  </CCol>
                </CRow>

                {selectedItem.Descripcion && (
                  <div className="mt-3">
                    <strong>Descripción:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">{selectedItem.Descripcion}</div>
                  </div>
                )}

                {selectedItem.description && (
                  <div className="mt-3">
                    <strong>Descripción:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">{selectedItem.description}</div>
                  </div>
                )}

                {selectedItem.Ubicacion && (
                  <div className="mt-3">
                    <strong>Ubicación:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">{selectedItem.Ubicacion}</div>
                  </div>
                )}

                {selectedItem.tipo && (
                  <div className="mt-3">
                    <strong>Tipo:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">{selectedItem.tipo}</div>
                  </div>
                )}

                {(selectedItem.Observacion || selectedItem.observaciones) && (
                  <div className="mt-3">
                    <strong>Observaciones Anteriores:</strong>
                    <div className="mt-1 p-2 bg-white rounded border">
                      {selectedItem.Observacion || selectedItem.observaciones}
                    </div>
                  </div>
                )}
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
                        <option value="Aprobada">Aprobada</option>
                        <option value="Rechazada">Rechazada</option>
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
                    placeholder="Ingrese las observaciones sobre la decisión tomada, documentos requeridos, motivo de aprobación/rechazo, etc."
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
          <CButton color="primary" onClick={handleUpdateStatus} disabled={loading || !newStatus}>
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              "Guardar Revisión"
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AdminRequestsApproval
