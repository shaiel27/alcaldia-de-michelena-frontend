import React, { useState, useEffect } from "react"
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
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"



const ConstanciasCatastrales = () => {

  
  const [formData, setFormData] = useState({
    cedula: "",
    idTerreno: "",
  })
  const [constancias, setConstancias] = useState([])
  const [loading, setLoading] = useState(false)
  const api = helpFetch()

  useEffect(() => {
    fetchConstancias()
  }, [])

  const fetchConstancias = async () => {
    try {
      const data = await api.get("constancias")
      setConstancias(data || [])
    } catch (error) {
      console.error("Error fetching constancias:", error)
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
    setLoading(true)
    try {
      await api.post("constancias", {
        body: {
          ...formData,
          fecha: new Date().toISOString(),
          estado: "Pendiente",
        },
      })
      setFormData({
        cedula: "",
        idTerreno: "",
      })
      fetchConstancias()
    } catch (error) {
      console.error("Error submitting constancia:", error)
    } finally {
      setLoading(false)
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
                {loading ? "Enviando..." : "Solicitar Constancia"}
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
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Cédula</CTableHeaderCell>
                  <CTableHeaderCell>ID Terreno</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {constancias.length > 0 ? (
                  constancias.map((constancia, index) => (
                    <CTableRow key={constancia.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{constancia.cedula}</CTableDataCell>
                      <CTableDataCell>{constancia.idTerreno}</CTableDataCell>
                      <CTableDataCell>{constancia.estado}</CTableDataCell>
                      <CTableDataCell>{new Date(constancia.fecha).toLocaleDateString()}</CTableDataCell>
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ConstanciasCatastrales

