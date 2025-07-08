"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CAlert,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"

const SolicitudObra = () => {
  const [formData, setFormData] = useState({
    descripcion: "",
    ubicacion: "",
    monto: "",
    tiempo_obra: "",
    tipo_obra: "",
    area_construccion: "",
    numero_pisos: "1",
    uso_destinado: "",
    ingeniero_responsable: "",
    materiales_principales: "",
    impacto_ambiental: "Bajo",
    contacto_emergencia: "",
  })

  const [solicitudes, setSolicitudes] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()
  const api = helpFetch()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      fetchUserSolicitudes(user.Cedula)
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchUserSolicitudes = async (cedula) => {
    try {
      const response = await api.get("Solicitud_de_obra")

      if (response?.err) {
        console.error("Error fetching solicitudes:", response)
        setSolicitudes([])
        return
      }

      const safeSolicitudes = Array.isArray(response) ? response : []
      const userSolicitudes = safeSolicitudes.filter((sol) => sol.Cedula === cedula)
      setSolicitudes(userSolicitudes)
    } catch (err) {
      console.error("Error fetching solicitudes:", err)
      setSolicitudes([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      setError("Usuario no autenticado")
      return
    }

    // Validación básica
    if (!formData.descripcion || !formData.ubicacion || !formData.monto || !formData.tipo_obra) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const solicitudData = {
        ...formData,
        Cedula: currentUser.Cedula,
        Fecha: new Date().toISOString().split("T")[0],
        Estatus: "Pendiente",
        Observacion: "Solicitud recibida, en proceso de evaluación",
        Monto: Number.parseFloat(formData.monto),
        Fecha_Inicio_Estimada: null,
        Fecha_Fin_Estimada: null,
        Fecha_Revision: null,
        Revisado_Por: null,
      }

      const response = await api.post("Solicitud_de_obra", { body: solicitudData })

      if (response?.err) {
        throw new Error(response.statusText || "Error al enviar la solicitud")
      }

      setSuccess("Solicitud de obra enviada exitosamente")
      setFormData({
        descripcion: "",
        ubicacion: "",
        monto: "",
        tiempo_obra: "",
        tipo_obra: "",
        area_construccion: "",
        numero_pisos: "1",
        uso_destinado: "",
        ingeniero_responsable: "",
        materiales_principales: "",
        impacto_ambiental: "Bajo",
        contacto_emergencia: "",
      })

      // Recargar solicitudes
      fetchUserSolicitudes(currentUser.Cedula)
    } catch (err) {
      console.error("Error submitting solicitud:", err)
      setError("Error al enviar la solicitud. Por favor intente de nuevo.")
    } finally {
      setLoading(false)
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Solicitud de Obra</h2>
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

            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Descripción de la Obra *</CFormLabel>
                    <CFormTextarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Describa detalladamente la obra a realizar"
                      rows={3}
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Ubicación *</CFormLabel>
                    <CFormInput
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      placeholder="Dirección completa de la obra"
                      required
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Monto Estimado (Bs.) *</CFormLabel>
                    <CFormInput
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Tiempo de Obra</CFormLabel>
                    <CFormInput
                      type="text"
                      name="tiempo_obra"
                      value={formData.tiempo_obra}
                      onChange={handleInputChange}
                      placeholder="ej: 30 días, 2 meses"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Tipo de Obra *</CFormLabel>
                    <CFormSelect name="tipo_obra" value={formData.tipo_obra} onChange={handleInputChange} required>
                      <option value="">Seleccione el tipo</option>
                      <option value="Construcción Civil">Construcción Civil</option>
                      <option value="Ampliación">Ampliación</option>
                      <option value="Reparación">Reparación</option>
                      <option value="Remodelación">Remodelación</option>
                      <option value="Demolición">Demolición</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Área de Construcción (m²)</CFormLabel>
                    <CFormInput
                      type="number"
                      name="area_construccion"
                      value={formData.area_construccion}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Número de Pisos</CFormLabel>
                    <CFormSelect name="numero_pisos" value={formData.numero_pisos} onChange={handleInputChange}>
                      <option value="1">1 Piso</option>
                      <option value="2">2 Pisos</option>
                      <option value="3">3 Pisos</option>
                      <option value="4">4 Pisos</option>
                      <option value="5+">5 o más Pisos</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={4}>
                  <div className="mb-3">
                    <CFormLabel>Uso Destinado</CFormLabel>
                    <CFormSelect name="uso_destinado" value={formData.uso_destinado} onChange={handleInputChange}>
                      <option value="">Seleccione el uso</option>
                      <option value="Residencial">Residencial</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Mixto">Mixto</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Ingeniero Responsable</CFormLabel>
                    <CFormInput
                      type="text"
                      name="ingeniero_responsable"
                      value={formData.ingeniero_responsable}
                      onChange={handleInputChange}
                      placeholder="Nombre del ingeniero a cargo"
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Contacto de Emergencia</CFormLabel>
                    <CFormInput
                      type="tel"
                      name="contacto_emergencia"
                      value={formData.contacto_emergencia}
                      onChange={handleInputChange}
                      placeholder="0414-1234567"
                    />
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Materiales Principales</CFormLabel>
                    <CFormTextarea
                      name="materiales_principales"
                      value={formData.materiales_principales}
                      onChange={handleInputChange}
                      placeholder="ej: Concreto, Bloques, Cabillas, etc."
                      rows={2}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Impacto Ambiental</CFormLabel>
                    <CFormSelect
                      name="impacto_ambiental"
                      value={formData.impacto_ambiental}
                      onChange={handleInputChange}
                    >
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton
                  type="button"
                  color="secondary"
                  onClick={() => {
                    setFormData({
                      descripcion: "",
                      ubicacion: "",
                      monto: "",
                      tiempo_obra: "",
                      tipo_obra: "",
                      area_construccion: "",
                      numero_pisos: "1",
                      uso_destinado: "",
                      ingeniero_responsable: "",
                      materiales_principales: "",
                      impacto_ambiental: "Bajo",
                      contacto_emergencia: "",
                    })
                  }}
                >
                  Limpiar
                </CButton>
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Solicitud"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Historial de solicitudes */}
        <CCard>
          <CCardHeader>
            <h5>Mis Solicitudes de Obra</h5>
          </CCardHeader>
          <CCardBody>
            {solicitudes.length > 0 ? (
              <CTable bordered responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Descripción</CTableHeaderCell>
                    <CTableHeaderCell>Tipo</CTableHeaderCell>
                    <CTableHeaderCell>Monto</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {solicitudes.map((solicitud) => (
                    <CTableRow key={solicitud.ID_Solicitud_de_obra}>
                      <CTableDataCell>{solicitud.ID_Solicitud_de_obra}</CTableDataCell>
                      <CTableDataCell>{solicitud.Fecha}</CTableDataCell>
                      <CTableDataCell>
                        {solicitud.Descripcion?.substring(0, 50)}
                        {solicitud.Descripcion?.length > 50 ? "..." : ""}
                      </CTableDataCell>
                      <CTableDataCell>{solicitud.Tipo_Obra}</CTableDataCell>
                      <CTableDataCell>Bs. {(Number.parseFloat(solicitud.Monto) || 0).toLocaleString()}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadgeColor(solicitud.Estatus)}>{solicitud.Estatus}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <div className="text-center py-4">
                <h6 className="text-muted">No hay solicitudes registradas</h6>
                <p className="text-muted">Sus solicitudes de obra aparecerán aquí.</p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SolicitudObra
