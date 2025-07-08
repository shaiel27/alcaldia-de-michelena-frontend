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
import CIcon from "@coreui/icons-react"
import { cilDrop, cilLocationPin } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const WaterProblemForm = () => {
  const [formData, setFormData] = useState({
    direccion: "",
    tipo_problema: "",
    descripcion: "",
    prioridad: "Media",
    telefono_contacto: "",
  })

  const [reportes, setReportes] = useState([])
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
      fetchUserReportes(user.Cedula)
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchUserReportes = async (cedula) => {
    try {
      const response = await api.get("Problemas_agua")

      if (response?.err) {
        console.error("Error fetching reportes:", response)
        setReportes([])
        return
      }

      const safeReportes = Array.isArray(response) ? response : []
      const userReportes = safeReportes.filter((reporte) => reporte.cedula === cedula)
      setReportes(userReportes)
    } catch (err) {
      console.error("Error fetching reportes:", err)
      setReportes([])
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
    if (!formData.direccion || !formData.tipo_problema || !formData.descripcion) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const reporteData = {
        ...formData,
        reportante: `${currentUser.Nombre} ${currentUser.Apellido}`,
        cedula: currentUser.Cedula,
        fecha: new Date().toISOString().split("T")[0],
        status: "Reportado",
        telefono_contacto: formData.telefono_contacto || currentUser.Telefono,
      }

      const response = await api.post("Problemas_agua", { body: reporteData })

      if (response?.err) {
        throw new Error(response.statusText || "Error al enviar el reporte")
      }

      setSuccess("Reporte de problema de agua enviado exitosamente")
      setFormData({
        direccion: "",
        tipo_problema: "",
        descripcion: "",
        prioridad: "Media",
        telefono_contacto: "",
      })

      // Recargar reportes
      fetchUserReportes(currentUser.Cedula)
    } catch (err) {
      console.error("Error submitting reporte:", err)
      setError("Error al enviar el reporte. Por favor intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resuelto":
        return "success"
      case "reportado":
        return "warning"
      case "en proceso":
        return "info"
      case "pendiente":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "alta":
        return "danger"
      case "media":
        return "warning"
      case "baja":
        return "info"
      default:
        return "secondary"
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <CIcon icon={cilDrop} className="me-2" />
              Reportar Problema de Agua
            </h2>
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
                    <CFormLabel>Dirección del Problema *</CFormLabel>
                    <CFormInput
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Dirección exacta donde ocurre el problema"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Tipo de Problema *</CFormLabel>
                    <CFormSelect
                      name="tipo_problema"
                      value={formData.tipo_problema}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione el tipo de problema</option>
                      <option value="Falta de agua">Falta de agua</option>
                      <option value="Baja presión">Baja presión</option>
                      <option value="Agua turbia">Agua turbia</option>
                      <option value="Mal sabor u olor">Mal sabor u olor</option>
                      <option value="Fuga en la red">Fuga en la red</option>
                      <option value="Tubería rota">Tubería rota</option>
                      <option value="Problema con medidor">Problema con medidor</option>
                      <option value="Otro">Otro</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Prioridad</CFormLabel>
                    <CFormSelect name="prioridad" value={formData.prioridad} onChange={handleInputChange}>
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </CFormSelect>
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Teléfono de Contacto</CFormLabel>
                    <CFormInput
                      type="tel"
                      name="telefono_contacto"
                      value={formData.telefono_contacto}
                      onChange={handleInputChange}
                      placeholder={currentUser?.Telefono || "0414-1234567"}
                    />
                  </div>
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel>Descripción del Problema *</CFormLabel>
                <CFormTextarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describa detalladamente el problema de agua que está experimentando"
                  rows={4}
                  required
                />
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton
                  type="button"
                  color="secondary"
                  onClick={() => {
                    setFormData({
                      direccion: "",
                      tipo_problema: "",
                      descripcion: "",
                      prioridad: "Media",
                      telefono_contacto: "",
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
                    "Enviar Reporte"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>

        {/* Historial de reportes */}
        <CCard>
          <CCardHeader>
            <h5>Mis Reportes de Problemas de Agua</h5>
          </CCardHeader>
          <CCardBody>
            {reportes.length > 0 ? (
              <CTable bordered responsive hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Dirección</CTableHeaderCell>
                    <CTableHeaderCell>Tipo de Problema</CTableHeaderCell>
                    <CTableHeaderCell>Prioridad</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {reportes.map((reporte) => (
                    <CTableRow key={reporte.id}>
                      <CTableDataCell>{reporte.id}</CTableDataCell>
                      <CTableDataCell>{reporte.fecha}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilLocationPin} className="me-1 text-muted" />
                          {reporte.direccion}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{reporte.tipo_problema}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getPriorityBadgeColor(reporte.prioridad)}>{reporte.prioridad}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadgeColor(reporte.status)}>{reporte.status}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <div className="text-center py-4">
                <CIcon icon={cilDrop} size="3xl" className="text-muted mb-3" />
                <h6 className="text-muted">No hay reportes registrados</h6>
                <p className="text-muted">Sus reportes de problemas de agua aparecerán aquí.</p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WaterProblemForm
