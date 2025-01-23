import React, { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CBadge,
  CSpinner,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"

const AdminRevisarSolicitudesAyuda = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [selectedSolicitud, setSelectedSolicitud] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ estado: "", observaciones: "" })
  const [alert, setAlert] = useState({ show: false, message: "", color: "info" })
  const [isLoading, setIsLoading] = useState(false)
  const api = helpFetch()

  useEffect(() => {
    fetchSolicitudes()
  }, [])

  const fetchSolicitudes = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("Ayuda")
      if (response.error) {
        throw new Error("Error al obtener las solicitudes")
      }
      setSolicitudes(response || [])
    } catch (error) {
      console.error("Error fetching solicitudes:", error)
      setAlert({ show: true, message: "Error al cargar las solicitudes", color: "danger" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReview = (solicitud) => {
    setSelectedSolicitud(solicitud)
    setFormData({ estado: solicitud.estado || "", observaciones: solicitud.observaciones || "" })
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitReview = async () => {
    if (!selectedSolicitud) return

    setIsLoading(true)
    try {
      const response = await api.put(`Ayuda/${selectedSolicitud.id}`, {
        body: {
          ...selectedSolicitud,
          estado: formData.estado,
          observaciones: formData.observaciones,
          fechaRevision: new Date().toISOString(),
        },
      })

      if (response.error) {
        throw new Error("Error al actualizar la solicitud")
      }

      setAlert({ show: true, message: "Solicitud actualizada con éxito", color: "success" })
      setShowModal(false)
      await fetchSolicitudes()
    } catch (error) {
      console.error("Error updating solicitud:", error)
      setAlert({ show: true, message: "Error al actualizar la solicitud", color: "danger" })
    } finally {
      setIsLoading(false)
    }
  }

  const getBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <h2>Revisar Solicitudes de Ayuda</h2>
          </CCardHeader>
          <CCardBody>
            {alert.show && (
              <CAlert color={alert.color} className="mb-3">
                {alert.message}
              </CAlert>
            )}

            <CTable responsive bordered hover striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo de Ayuda</th>
                  <th>Cédula Solicitante</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id}>
                    <td>{solicitud.id}</td>
                    <td>{solicitud.tipoAyuda}</td>
                    <td>{solicitud.cedulaUsuario}</td>
                    <td>{new Date(solicitud.fecha).toLocaleDateString()}</td>
                    <td>
                      <CBadge color={getBadgeColor(solicitud.estado)}>{solicitud.estado || "Pendiente"}</CBadge>
                    </td>
                    <td>
                      <CButton color="primary" size="sm" onClick={() => handleReview(solicitud)}>
                        Revisar
                      </CButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CTable>

            {isLoading && (
              <div className="text-center my-3">
                <CSpinner />
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>Revisar Solicitud de Ayuda</CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="estado">Estado</CFormLabel>
              <CFormSelect id="estado" name="estado" value={formData.estado} onChange={handleInputChange}>
                <option value="">Seleccionar Estado</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="pendiente">Pendiente</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="observaciones">Observaciones</CFormLabel>
              <CFormTextarea
                id="observaciones"
                name="observaciones"
                rows="3"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Ingrese las observaciones sobre la solicitud"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleSubmitReview} disabled={isLoading}>
            {isLoading ? <CSpinner size="sm" /> : "Guardar Revisión"}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AdminRevisarSolicitudesAyuda

