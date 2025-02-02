import React, { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CRow,
  CAlert,
  CSpinner,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"
import { useNavigate } from "react-router-dom"

const ConstructionRequestForm = () => {
  const [formData, setFormData] = useState({
    ID_Solicitud_de_obra: "",
    Cedula: "",
    ID_Vivienda: "",
    ID_Terreno: "",
    Fecha: new Date().toISOString().split("T")[0],
    Descripcion: "",
    Estatus: "Pendiente",
    Observacion: "",
    Ubicacion: "",
    Tiempo_Obra: "",
    Monto: "",
  })

  const [terrenos, setTerrenos] = useState([])
  const [lotes, setLotes] = useState([])
  const [viviendas, setViviendas] = useState([])
  const [selectedTerreno, setSelectedTerreno] = useState(null)
  const [selectedLote, setSelectedLote] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const api = helpFetch()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      setFormData((prevState) => ({
        ...prevState,
        Cedula: user.Cedula,
      }))
      fetchUserProperties(user.Cedula)
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchUserProperties = async (cedula) => {
    setLoading(true)
    try {
      // Primero obtenemos los registros de Duenos que corresponden a la cédula del usuario
      const duenosData = await api.get(`Duenos?Cedula=${cedula}&Status=Activo`)

      if (!duenosData || duenosData.error || duenosData.length === 0) {
        setError("No se encontraron propiedades para este usuario.")
        setTerrenos([])
        return
      }

      // Obtenemos los IDs de los terrenos que pertenecen al usuario
      const terrenoIds = duenosData.map((dueno) => dueno.ID_Terreno)

      // Obtenemos los detalles de cada terreno
      const terrenosData = []
      for (const id of terrenoIds) {
        const terreno = await api.get(`Terreno?ID_Terreno=${id}`)
        if (terreno && !terreno.error && terreno.length > 0) {
          terrenosData.push(terreno[0])
        }
      }

      setTerrenos(terrenosData)
    } catch (error) {
      console.error("Error fetching user properties:", error)
      setError("Error al cargar las propiedades. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleTerrenoChange = (e) => {
    const terrenoId = e.target.value
    const terreno = terrenos.find((t) => t.ID_Terreno.toString() === terrenoId)
    setSelectedTerreno(terreno)
    setFormData((prevState) => ({
      ...prevState,
      ID_Terreno: terrenoId,
      ID_Vivienda: "",
    }))
    setLotes(terreno?.Lote || [])
    setViviendas([])
    setSelectedLote(null)
  }

  const handleLoteChange = (e) => {
    const loteId = e.target.value
    const lote = lotes.find((l) => l.ID_Lote.toString() === loteId)
    setSelectedLote(lote)
    setViviendas(lote?.Vivienda || [])
    setFormData((prevState) => ({
      ...prevState,
      ID_Vivienda: "",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Obtener el último ID de solicitud para incrementarlo
      const solicitudes = await api.get("Solicitud_de_obra")
      const lastId = Math.max(...solicitudes.map((s) => Number.parseInt(s.ID_Solicitud_de_obra) || 0), 0)

      const solicitudData = {
        ...formData,
        ID_Solicitud_de_obra: (lastId + 1).toString(),
      }

      const response = await api.post("Solicitud_de_obra", {
        body: solicitudData,
      })

      if (response.error) {
        throw new Error(response.statusText || "Error al enviar la solicitud")
      }

      setSuccess("Solicitud enviada exitosamente")
      setFormData({
        ...formData,
        ID_Vivienda: "",
        ID_Terreno: "",
        Descripcion: "",
        Observacion: "",
        Ubicacion: "",
        Tiempo_Obra: "",
        Monto: "",
      })
      setSelectedTerreno(null)
      setSelectedLote(null)
      setViviendas([])
    } catch (error) {
      console.error("Error submitting request:", error)
      setError("Error al enviar la solicitud. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Solicitud de Obra</strong>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="Cedula">Cédula</CFormLabel>
              <CFormInput id="Cedula" name="Cedula" value={formData.Cedula} disabled />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="ID_Terreno">Terreno</CFormLabel>
              <CFormSelect
                id="ID_Terreno"
                name="ID_Terreno"
                value={formData.ID_Terreno}
                onChange={handleTerrenoChange}
                required
              >
                <option value="">Seleccione un terreno</option>
                {terrenos.map((terreno) => (
                  <option key={terreno.ID_Terreno} value={terreno.ID_Terreno}>
                    Terreno {terreno.ID_Terreno} - {terreno.Ubicacion || "Sin ubicación"}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {selectedTerreno && (
            <>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="ID_Lote">Lote</CFormLabel>
                  <CFormSelect id="ID_Lote" name="ID_Lote" onChange={handleLoteChange} required>
                    <option value="">Seleccione un lote</option>
                    {lotes.map((lote) => (
                      <option key={lote.ID_Lote} value={lote.ID_Lote}>
                        Lote {lote.ID_Lote}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {selectedLote && (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="ID_Vivienda">Vivienda</CFormLabel>
                    <CFormSelect
                      id="ID_Vivienda"
                      name="ID_Vivienda"
                      value={formData.ID_Vivienda}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione una vivienda</option>
                      {viviendas.map((vivienda) => (
                        <option key={vivienda.ID_Vivienda} value={vivienda.ID_Vivienda}>
                          Vivienda {vivienda.ID_Vivienda}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
              )}
            </>
          )}

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="Fecha">Fecha</CFormLabel>
              <CFormInput
                type="date"
                id="Fecha"
                name="Fecha"
                value={formData.Fecha}
                onChange={handleInputChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="Ubicacion">Ubicación</CFormLabel>
              <CFormInput
                type="text"
                id="Ubicacion"
                name="Ubicacion"
                value={formData.Ubicacion}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormLabel htmlFor="Descripcion">Descripción de la Obra</CFormLabel>
              <CFormTextarea
                id="Descripcion"
                name="Descripcion"
                rows={3}
                value={formData.Descripcion}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="Tiempo_Obra">Tiempo Estimado de Obra</CFormLabel>
              <CFormInput
                type="text"
                id="Tiempo_Obra"
                name="Tiempo_Obra"
                value={formData.Tiempo_Obra}
                onChange={handleInputChange}
                required
                placeholder="Ej: 3 meses"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="Monto">Monto Estimado</CFormLabel>
              <CFormInput
                type="number"
                id="Monto"
                name="Monto"
                value={formData.Monto}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el monto en Bs."
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12}>
              <CFormLabel htmlFor="Observacion">Observaciones Adicionales</CFormLabel>
              <CFormTextarea
                id="Observacion"
                name="Observacion"
                rows={2}
                value={formData.Observacion}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={12}>
              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Solicitud"}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ConstructionRequestForm

