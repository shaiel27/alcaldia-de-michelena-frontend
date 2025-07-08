"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  CSpinner,
  CAlert,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilHome, cilDollar, cilTransfer } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const UserTramitesProperties = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [properties, setProperties] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [formData, setFormData] = useState({
    propertyId: "",
    transactionType: "sell",
    lotsToSell: 1,
    price: "",
    description: "",
    comprador_nombre: "",
    comprador_cedula: "",
    comprador_telefono: "",
  })

  const navigate = useNavigate()
  const api = helpFetch()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      fetchData(user.Cedula)
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchData = async (cedula) => {
    try {
      setLoading(true)
      setError(null)

      const [solicitudesResponse, terrenosResponse] = await Promise.all([
        api.get("Solicitud_Venta"),
        api.get("Terrenos"),
      ])

      // Handle solicitudes response
      const safeSolicitudes =
        Array.isArray(solicitudesResponse) && !solicitudesResponse.err
          ? solicitudesResponse.filter((sol) => sol.cedula === cedula)
          : []

      // Handle terrenos response
      const safeTerrenos =
        Array.isArray(terrenosResponse) && !terrenosResponse.err
          ? terrenosResponse.filter((terreno) => terreno.Propietario === cedula)
          : []

      setSolicitudes(safeSolicitudes)
      setProperties(safeTerrenos)

      if (solicitudesResponse?.err || terrenosResponse?.err) {
        setError("Algunos datos no pudieron cargarse completamente")
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los datos. Verifique que el servidor esté funcionando.")
      setSolicitudes([])
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      setError("Usuario no autenticado")
      return
    }

    // Validación básica
    if (!formData.propertyId || !formData.price || !formData.description) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    try {
      const selectedProperty = properties.find((p) => p.ID_Terreno.toString() === formData.propertyId)

      const solicitudData = {
        ...formData,
        cedula: currentUser.Cedula,
        fecha: new Date().toISOString().split("T")[0],
        estado: "Pendiente",
        observaciones: "Solicitud recibida, en proceso de evaluación",
        price: Number.parseFloat(formData.price),
        totalLots: 1,
        tipo_propiedad: "Terreno",
        area_total: selectedProperty?.Area || "No especificada",
        direccion_completa: selectedProperty?.Ubicacion || "No especificada",
        valor_catastral: selectedProperty?.Valor_Catastral || 0,
      }

      const response = await api.post("Solicitud_Venta", { body: solicitudData })

      if (response?.err) {
        throw new Error(response.statusText || "Error al enviar la solicitud")
      }

      setSuccess("Solicitud de trámite enviada exitosamente")
      setModalVisible(false)
      setFormData({
        propertyId: "",
        transactionType: "sell",
        lotsToSell: 1,
        price: "",
        description: "",
        comprador_nombre: "",
        comprador_cedula: "",
        comprador_telefono: "",
      })

      // Recargar datos
      fetchData(currentUser.Cedula)
    } catch (err) {
      console.error("Error submitting solicitud:", err)
      setError("Error al enviar la solicitud. Por favor intente de nuevo.")
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobada":
        return "success"
      case "pendiente":
        return "warning"
      case "en proceso":
        return "info"
      case "rechazada":
        return "danger"
      default:
        return "secondary"
    }
  }

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case "sell":
        return cilDollar
      case "transfer":
        return cilTransfer
      default:
        return cilHome
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando datos...</span>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h2>
                <CIcon icon={cilHome} className="me-2" />
                Trámites de Propiedades
              </h2>
              <CButton color="primary" onClick={() => setModalVisible(true)} disabled={properties.length === 0}>
                Nueva Solicitud
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError(null)}>
                {error}
              </CAlert>
            )}

            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
                {success}
              </CAlert>
            )}

            {properties.length === 0 && (
              <CAlert color="info">
                No tiene propiedades registradas. Debe tener al menos una propiedad para realizar trámites.
              </CAlert>
            )}

            {/* Resumen */}
            <CRow className="mb-4">
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-primary">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">{properties.length}</div>
                    <div>Propiedades</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-info">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">{solicitudes.length}</div>
                    <div>Solicitudes</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-success">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">{solicitudes.filter((s) => s.estado === "Aprobada").length}</div>
                    <div>Aprobadas</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-warning">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">{solicitudes.filter((s) => s.estado === "Pendiente").length}</div>
                    <div>Pendientes</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Tabla de solicitudes */}
            <CCard>
              <CCardHeader>
                <h5>Historial de Solicitudes</h5>
              </CCardHeader>
              <CCardBody>
                {solicitudes.length > 0 ? (
                  <CTable bordered responsive hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>ID</CTableHeaderCell>
                        <CTableHeaderCell>Fecha</CTableHeaderCell>
                        <CTableHeaderCell>Propiedad</CTableHeaderCell>
                        <CTableHeaderCell>Tipo</CTableHeaderCell>
                        <CTableHeaderCell>Precio</CTableHeaderCell>
                        <CTableHeaderCell>Estado</CTableHeaderCell>
                        <CTableHeaderCell>Comprador</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {solicitudes.map((solicitud) => (
                        <CTableRow key={solicitud.id}>
                          <CTableDataCell>{solicitud.id}</CTableDataCell>
                          <CTableDataCell>{solicitud.fecha}</CTableDataCell>
                          <CTableDataCell>
                            ID: {solicitud.propertyId}
                            <br />
                            <small className="text-muted">{solicitud.direccion_completa}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <CIcon icon={getTransactionTypeIcon(solicitud.transactionType)} className="me-1" />
                              {solicitud.transactionType === "sell" ? "Venta" : "Transferencia"}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            Bs. {(Number.parseFloat(solicitud.price) || 0).toLocaleString()}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getStatusBadgeColor(solicitud.estado)}>{solicitud.estado}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {solicitud.comprador_nombre || "N/A"}
                            <br />
                            <small className="text-muted">{solicitud.comprador_cedula || ""}</small>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilHome} size="3xl" className="text-muted mb-3" />
                    <h6 className="text-muted">No hay solicitudes registradas</h6>
                    <p className="text-muted">Sus solicitudes de trámites aparecerán aquí.</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para nueva solicitud */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Nueva Solicitud de Trámite</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Propiedad *</CFormLabel>
                  <CFormSelect
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione una propiedad</option>
                    {properties.map((property) => (
                      <option key={property.ID_Terreno} value={property.ID_Terreno}>
                        ID: {property.ID_Terreno} - {property.Ubicacion}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Tipo de Trámite *</CFormLabel>
                  <CFormSelect
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                    required
                  >
                    <option value="sell">Venta</option>
                    <option value="transfer">Transferencia</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Precio (Bs.) *</CFormLabel>
                  <CFormInput
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Lotes a Vender</CFormLabel>
                  <CFormInput
                    type="number"
                    name="lotsToSell"
                    value={formData.lotsToSell}
                    onChange={(e) => setFormData({ ...formData, lotsToSell: Number.parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </CCol>
            </CRow>

            <div className="mb-3">
              <CFormLabel>Descripción *</CFormLabel>
              <CFormTextarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describa los detalles del trámite"
                rows={3}
                required
              />
            </div>

            <h6 className="mb-3">Información del Comprador (Opcional)</h6>
            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Nombre del Comprador</CFormLabel>
                  <CFormInput
                    type="text"
                    name="comprador_nombre"
                    value={formData.comprador_nombre}
                    onChange={(e) => setFormData({ ...formData, comprador_nombre: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>
              </CCol>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Cédula del Comprador</CFormLabel>
                  <CFormInput
                    type="text"
                    name="comprador_cedula"
                    value={formData.comprador_cedula}
                    onChange={(e) => setFormData({ ...formData, comprador_cedula: e.target.value })}
                    placeholder="V-12345678"
                  />
                </div>
              </CCol>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Teléfono del Comprador</CFormLabel>
                  <CFormInput
                    type="tel"
                    name="comprador_telefono"
                    value={formData.comprador_telefono}
                    onChange={(e) => setFormData({ ...formData, comprador_telefono: e.target.value })}
                    placeholder="0414-1234567"
                  />
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" type="submit">
              Enviar Solicitud
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </CRow>
  )
}

export default UserTramitesProperties
