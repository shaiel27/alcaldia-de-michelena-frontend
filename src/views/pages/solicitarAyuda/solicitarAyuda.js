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
  CInputGroup,
  CInputGroupText,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilMoney, cilDescription, cilPeople } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const SolicitarAyuda = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    tipoAyuda: "",
    Descripcion: "",
    Monto: "",
    cedulaBeneficiario: "",
    nombreBeneficiario: "",
    observaciones: "",
  })

  const navigate = useNavigate()
  const api = helpFetch()

  const tiposAyuda = [
    { value: "vivienda", label: "Mejora de Vivienda" },
    { value: "salud", label: "Ayuda Médica" },
    { value: "educacion", label: "Beca Estudiantil" },
    { value: "alimentacion", label: "Ayuda Alimentaria" },
    { value: "emergencia", label: "Emergencia" },
    { value: "otros", label: "Otros" },
  ]

  useEffect(() => {
    // Verificar usuario logueado
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      // Pre-llenar algunos campos
      setFormData((prev) => ({
        ...prev,
        cedulaBeneficiario: user.Cedula,
        nombreBeneficiario: `${user.Nombre} ${user.Apellido}`,
      }))
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpiar mensajes al escribir
    if (error) setError("")
    if (success) setSuccess("")
  }

  const validateForm = () => {
    if (!formData.tipoAyuda) {
      setError("Por favor seleccione el tipo de ayuda")
      return false
    }
    if (!formData.Descripcion.trim()) {
      setError("Por favor ingrese una descripción de la ayuda solicitada")
      return false
    }
    if (!formData.cedulaBeneficiario.trim()) {
      setError("Por favor ingrese la cédula del beneficiario")
      return false
    }
    if (!formData.nombreBeneficiario.trim()) {
      setError("Por favor ingrese el nombre del beneficiario")
      return false
    }
    if (formData.Monto && isNaN(Number(formData.Monto))) {
      setError("El monto debe ser un número válido")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Generar ID único para la ayuda
      const ayudaId = Date.now().toString()

      // Preparar datos para enviar
      const ayudaData = {
        id: ayudaId,
        ID_Ayuda: ayudaId,
        ID_Detalle_Ayuda: ayudaId,
        COD_Area: "3", // Servicios Sociales
        Monto: formData.Monto || "0",
        Descripcion: formData.Descripcion.trim(),
        Fecha: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
        fechaSolicitud: new Date().toISOString(),
        tipoAyuda: formData.tipoAyuda,
        cedulaUsuario: currentUser.Cedula,
        nombreSolicitante: `${currentUser.Nombre} ${currentUser.Apellido}`,
        cedulaBeneficiario: formData.cedulaBeneficiario.trim(),
        nombreBeneficiario: formData.nombreBeneficiario.trim(),
        estado: "Pendiente",
        observaciones: formData.observaciones.trim() || "",
      }

      console.log("Enviando datos de ayuda:", ayudaData)

      // Enviar solicitud
      const response = await api.post("Ayuda", { body: ayudaData })

      if (response?.err) {
        throw new Error("Error al enviar la solicitud")
      }

      setSuccess("Solicitud de ayuda enviada exitosamente. Será revisada por el personal administrativo.")

      // Limpiar formulario
      setFormData({
        tipoAyuda: "",
        Descripcion: "",
        Monto: "",
        cedulaBeneficiario: currentUser.Cedula,
        nombreBeneficiario: `${currentUser.Nombre} ${currentUser.Apellido}`,
        observaciones: "",
      })

      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate("/historial-tramites")
      }, 3000)
    } catch (err) {
      console.error("Error al enviar solicitud:", err)
      setError("Error al enviar la solicitud. Verifique la conexión e intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      tipoAyuda: "",
      Descripcion: "",
      Monto: "",
      cedulaBeneficiario: currentUser?.Cedula || "",
      nombreBeneficiario: currentUser ? `${currentUser.Nombre} ${currentUser.Apellido}` : "",
      observaciones: "",
    })
    setError("")
    setSuccess("")
  }

  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando...</span>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Solicitar Ayuda Social</strong>
            <small className="ms-2 text-muted">Complete el formulario para solicitar ayuda del municipio</small>
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

            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="tipoAyuda">Tipo de Ayuda *</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormSelect
                      id="tipoAyuda"
                      name="tipoAyuda"
                      value={formData.tipoAyuda}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccione el tipo de ayuda</option>
                      {tiposAyuda.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="Monto">Monto Solicitado (Opcional)</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilMoney} />
                    </CInputGroupText>
                    <CFormInput
                      type="number"
                      id="Monto"
                      name="Monto"
                      placeholder="Ingrese el monto en Bs."
                      value={formData.Monto}
                      onChange={handleInputChange}
                      disabled={loading}
                      min="0"
                      step="0.01"
                    />
                  </CInputGroup>
                  <small className="text-muted">Deje en blanco si no aplica</small>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="cedulaBeneficiario">Cédula del Beneficiario *</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="cedulaBeneficiario"
                      name="cedulaBeneficiario"
                      placeholder="Ej: V12345678"
                      value={formData.cedulaBeneficiario}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </CInputGroup>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="nombreBeneficiario">Nombre del Beneficiario *</CFormLabel>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilPeople} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="nombreBeneficiario"
                      name="nombreBeneficiario"
                      placeholder="Nombre completo del beneficiario"
                      value={formData.nombreBeneficiario}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor="Descripcion">Descripción de la Ayuda Solicitada *</CFormLabel>
                  <CFormTextarea
                    id="Descripcion"
                    name="Descripcion"
                    rows={4}
                    placeholder="Describa detalladamente la ayuda que necesita, incluyendo motivos y justificación..."
                    value={formData.Descripcion}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <small className="text-muted">
                    Sea específico sobre el tipo de ayuda y las razones por las que la necesita
                  </small>
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol xs={12}>
                  <CFormLabel htmlFor="observaciones">Observaciones Adicionales</CFormLabel>
                  <CFormTextarea
                    id="observaciones"
                    name="observaciones"
                    rows={3}
                    placeholder="Información adicional que considere relevante..."
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </CCol>
              </CRow>

              {/* Información del solicitante */}
              <CRow className="mb-4">
                <CCol xs={12}>
                  <div className="bg-light p-3 rounded">
                    <h6 className="mb-2">Información del Solicitante:</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Nombre:</strong> {currentUser.Nombre} {currentUser.Apellido}
                      </div>
                      <div className="col-md-6">
                        <strong>Cédula:</strong> {currentUser.Cedula}
                      </div>
                      <div className="col-md-6">
                        <strong>Correo:</strong> {currentUser.Correo}
                      </div>
                      <div className="col-md-6">
                        <strong>Dirección:</strong> {currentUser.Direccion}
                      </div>
                    </div>
                  </div>
                </CCol>
              </CRow>

              <CRow>
                <CCol xs={12}>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton
                      type="button"
                      color="secondary"
                      onClick={handleReset}
                      disabled={loading}
                      className="me-md-2"
                    >
                      Limpiar Formulario
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
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SolicitarAyuda
