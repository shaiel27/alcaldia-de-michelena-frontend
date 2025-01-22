import React, { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CSpinner,
  CAlert,
} from "@coreui/react"

const WaterProblemForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    incidentDate: "",
    address: "",
    photos: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, photos: e.target.files })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const data = new FormData()
      data.append("description", formData.description)
      data.append("incidentDate", formData.incidentDate)
      data.append("address", formData.address)

      if (formData.photos) {
        for (let i = 0; i < formData.photos.length; i++) {
          data.append("photos", formData.photos[i])
        }
      }

      // Replace with your actual API endpoint
      const response = await fetch("/api/water-complaints", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Error al enviar el reporte")
      }

      setSubmitStatus("success")
      setFormData({
        description: "",
        incidentDate: "",
        address: "",
        photos: null,
      })
    } catch (error) {
      console.error("Error submitting complaint:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Reporte de Problema de Agua</h5>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="description">Descripción del Problema</CFormLabel>
                  <CFormTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Describa el problema del agua en detalle..."
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="incidentDate">Fecha del Incidente</CFormLabel>
                  <CFormInput
                    type="date"
                    id="incidentDate"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleInputChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="address">Dirección</CFormLabel>
                  <CFormInput
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese la dirección completa"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="photos">Fotos del Problema</CFormLabel>
                  <CFormInput
                    type="file"
                    id="photos"
                    name="photos"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    required
                  />
                </CCol>
              </CRow>

              {submitStatus === "success" && (
                <CAlert color="success" className="mt-3">
                  Reporte enviado exitosamente.
                </CAlert>
              )}

              {submitStatus === "error" && (
                <CAlert color="danger" className="mt-3">
                  Error al enviar el reporte. Por favor, intente nuevamente.
                </CAlert>
              )}

              <CRow className="mt-3">
                <CCol xs={12}>
                  <CButton type="submit" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Reporte"
                    )}
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WaterProblemForm

