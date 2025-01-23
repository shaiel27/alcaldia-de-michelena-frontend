import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormTextarea,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"

const AdminRequestsApproval = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [approvalComment, setApprovalComment] = useState("")
  const navigate = useNavigate()
  const api = helpFetch()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const data = await api.get("Solicitud_de_obra")
      setRequests(data || [])
      setLoading(false)
    } catch (err) {
      console.error("Error fetching requests:", err)
      setError("Error al cargar las solicitudes. Por favor, intente de nuevo.")
      setLoading(false)
    }
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  const handleApprove = async () => {
    try {
      await api.put(`Solicitud_de_obra/${selectedRequest.id}`, {
        body: {
          ...selectedRequest,
          Estatus: "Aprobada",
          Observacion: approvalComment,
        },
      })
      setSuccess("Solicitud aprobada exitosamente.")
      setShowModal(false)
      setApprovalComment("")
      fetchRequests() // Refresh the list
    } catch (err) {
      console.error("Error approving request:", err)
      setError("Error al aprobar la solicitud. Por favor, intente de nuevo.")
    }
  }

  const handleReject = async () => {
    try {
      await api.put(`Solicitud_de_obra/${selectedRequest.id}`, {
        body: {
          ...selectedRequest,
          Estatus: "Rechazada",
          Observacion: approvalComment,
        },
      })
      setSuccess("Solicitud rechazada exitosamente.")
      setShowModal(false)
      setApprovalComment("")
      fetchRequests() // Refresh the list
    } catch (err) {
      console.error("Error rejecting request:", err)
      setError("Error al rechazar la solicitud. Por favor, intente de nuevo.")
    }
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Aprobación de Solicitudes de Obra</strong>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {success && <CAlert color="success">{success}</CAlert>}
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Cédula</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ID Vivienda</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ID Terreno</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {requests.map((request) => (
                  <CTableRow key={request.id}>
                    <CTableDataCell>{request.ID_Solicitud_de_obra}</CTableDataCell>
                    <CTableDataCell>{request.Cedula}</CTableDataCell>
                    <CTableDataCell>{request.ID_Vivienda}</CTableDataCell>
                    <CTableDataCell>{request.ID_Terreno}</CTableDataCell>
                    <CTableDataCell>{request.Fecha}</CTableDataCell>
                    <CTableDataCell>{request.Estatus}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm" onClick={() => handleViewDetails(request)}>
                        Ver Detalles
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Detalles de la Solicitud</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedRequest && (
            <>
              <p>
                <strong>ID:</strong> {selectedRequest.ID_Solicitud_de_obra}
              </p>
              <p>
                <strong>Cédula:</strong> {selectedRequest.Cedula}
              </p>
              <p>
                <strong>ID Vivienda:</strong> {selectedRequest.ID_Vivienda}
              </p>
              <p>
                <strong>ID Terreno:</strong> {selectedRequest.ID_Terreno}
              </p>
              <p>
                <strong>Fecha:</strong> {selectedRequest.Fecha}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedRequest.Descripcion}
              </p>
              <p>
                <strong>Estado:</strong> {selectedRequest.Estatus}
              </p>
              <p>
                <strong>Observación:</strong> {selectedRequest.Observacion}
              </p>
              <p>
                <strong>Ubicación:</strong> {selectedRequest.Ubicacion}
              </p>
              <p>
                <strong>Tiempo de Obra:</strong> {selectedRequest.Tiempo_Obra}
              </p>
              <p>
                <strong>Monto:</strong> {selectedRequest.Monto}
              </p>
            </>
          )}
          {selectedRequest && selectedRequest.Estatus === "Pendiente" && (
            <CForm>
              <CFormTextarea
                id="approvalComment"
                label="Comentario de Aprobación"
                placeholder="Ingrese un comentario para la aprobación o rechazo"
                rows={3}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
              />
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          {selectedRequest && selectedRequest.Estatus === "Pendiente" && (
            <>
              <CButton color="success" onClick={handleApprove}>
                Aprobar
              </CButton>
              <CButton color="danger" onClick={handleReject}>
                Rechazar
              </CButton>
            </>
          )}
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AdminRequestsApproval

