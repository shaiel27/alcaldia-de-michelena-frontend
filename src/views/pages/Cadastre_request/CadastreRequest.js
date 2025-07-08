"use client"

import { useState, useEffect } from "react"
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CSpinner,
  CBadge,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"

const CadastreRequest = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    idTerreno: "",
  })
  const [constancias, setConstancias] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const api = helpFetch()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      setFormData((prev) => ({
        ...prev,
        cedula: user.Cedula,
      }))
    }
    fetchConstancias()
  }, [])

  const fetchConstancias = async () => {
    try {
      setLoading(true)
      const data = await api.get("Constancias")
      if (data.err) {
        throw new Error(data.err)
      }
      setConstancias(data || [])
    } catch (error) {
      console.error("Error fetching constancias:", error)
      setError("Error al cargar las constancias")
    } finally {
      setLoading(false)
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

    if (!formData.cedula || !formData.idTerreno) {
      setError("Por favor complete todos los campos")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const constanciaData = {
        cedula: formData.cedula,
        idTerreno: formData.idTerreno,
        fecha: new Date().toISOString(),
        estado: "Pendiente",
        fechaSolicitud: new Date().toISOString().split("T")[0],
        tipo: "Catastral",
      }

      const response = await api.post("Constancias", { body: constanciaData })

      if (response.err) {
        throw new Error(response.err)
      }

      setSuccess("Solicitud de constancia catastral enviada exitosamente")
      setFormData({
        cedula: currentUser?.Cedula || "",
        idTerreno: "",
      })
      await fetchConstancias()
    } catch (error) {
      console.error("Error submitting constancia:", error)
      setError("Error al enviar la solicitud: " + error.message)
    } finally {
      setLoading(false)
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
            <h5>Solicitud de Constancias Catastrales</h5>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {success && <CAlert color="success">{success}</CAlert>}

            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Cédula del Usuario</CFormLabel>
                  <CFormInput
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleInputChange}
                    placeholder="Ingrese la cédula"
                    required
                    disabled={!!currentUser}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>ID del Terreno</CFormLabel>
                  <CFormInput
                    type="text"
                    name="idTerreno"
                    value={formData.idTerreno}
                    onChange={handleInputChange}
                    placeholder="Ingrese el ID del terreno"
                    required
                  />
                </CCol>
              </CRow>
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Enviando...
                  </>
                ) : (
                  "Solicitar Constancia"
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mt-4">
          <CCardHeader>
            <h5>Historial de Constancias</h5>
          </CCardHeader>
          <CCardBody>
            {loading && constancias.length === 0 ? (
              <div className="text-center">
                <CSpinner color="primary" />
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Cédula</CTableHeaderCell>
                    <CTableHeaderCell>ID Terreno</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                    <CTableHeaderCell>Fecha Solicitud</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {constancias.length > 0 ? (
                    constancias.map((constancia, index) => (
                      <CTableRow key={constancia.id || index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{constancia.cedula}</CTableDataCell>
                        <CTableDataCell>{constancia.idTerreno}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadgeColor(constancia.estado)}>{constancia.estado || "Pendiente"}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {constancia.fechaSolicitud
                            ? new Date(constancia.fechaSolicitud).toLocaleDateString()
                            : new Date(constancia.fecha).toLocaleDateString()}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center">
                        No hay constancias registradas
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CadastreRequest
