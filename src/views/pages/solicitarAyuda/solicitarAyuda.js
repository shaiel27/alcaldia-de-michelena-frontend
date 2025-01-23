import React, { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CAlert,
  CSpinner,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"

const SolicitarAyuda = () => {
  const [formData, setFormData] = useState({
    tipoAyuda: "",
    descripcion: "",
    monto: "",
    cedulaBeneficiario: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", color: "info" })
  const api = helpFetch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"))
      if (!user || !user.Cedula) {
        throw new Error("Usuario no encontrado")
      }

      const ayudaData = {
        ...formData,
        cedulaUsuario: user.Cedula,
        fecha: new Date().toISOString(),
        estado: "Pendiente",
      }

      const response = await api.post("Ayuda", {
        body: ayudaData,
      })

      if (response.error) {
        throw new Error(response.statusText || "Error al enviar la solicitud")
      }

      setAlert({ show: true, message: "Solicitud de ayuda enviada con éxito", color: "success" })
      setFormData({ tipoAyuda: "", descripcion: "", monto: "", cedulaBeneficiario: "" })
    } catch (error) {
      console.error("Error al enviar la solicitud de ayuda:", error)
      setAlert({
        show: true,
        message: "Error al enviar la solicitud. Por favor, intente de nuevo.",
        color: "danger",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12} lg={8}>
        <CCard>
          <CCardHeader>
            <h2>Solicitar Ayuda</h2>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="tipoAyuda">Tipo de Ayuda</CFormLabel>
                <CFormSelect
                  id="tipoAyuda"
                  name="tipoAyuda"
                  value={formData.tipoAyuda}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione el tipo de ayuda</option>
                  <option value="economica">Económica</option>
                  <option value="vivienda">Vivienda</option>
                  <option value="salud">Salud</option>
                  <option value="educacion">Educación</option>
                  <option value="alimentacion">Alimentación</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="descripcion">Descripción de la Situación</CFormLabel>
                <CFormTextarea
                  id="descripcion"
                  name="descripcion"
                  rows="4"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  placeholder="Describa su situación y el motivo de la solicitud"
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="monto">Monto Solicitado (si aplica)</CFormLabel>
                <CFormInput
                  type="number"
                  id="monto"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  placeholder="Ingrese el monto en caso de ayuda económica"
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="cedulaBeneficiario">Cédula del Beneficiario</CFormLabel>
                <CFormInput
                  type="text"
                  id="cedulaBeneficiario"
                  name="cedulaBeneficiario"
                  value={formData.cedulaBeneficiario}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese la cédula del beneficiario"
                />
              </div>
              <CButton type="submit" color="primary" disabled={isLoading}>
                {isLoading ? <CSpinner size="sm" /> : "Enviar Solicitud"}
              </CButton>
            </CForm>
            {alert.show && (
              <CAlert color={alert.color} className="mt-3">
                {alert.message}
              </CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SolicitarAyuda

