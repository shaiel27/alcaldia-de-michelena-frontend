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
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CAlert,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"
import { useNavigate } from "react-router-dom"

const PropertyRegistry = () => {
  const api = helpFetch()
  const [terrenoData, setTerrenoData] = useState({
    ID_Terreno: "",
    Medidas_Norte: "",
    Medidas_Sur: "",
    Medidas_Este: "",
    Medidas_Oeste: "",
    Colindancias_Norte: "",
    Colindancias_Sur: "",
    Colindancias_Este: "",
    Colindancias_Oeste: "",
  })
  const [lotes, setLotes] = useState([])
  const [modalLoteVisible, setModalLoteVisible] = useState(false)
  const [modalViviendaVisible, setModalViviendaVisible] = useState(false)
  const [loteActual, setLoteActual] = useState(null)
  const [loteData, setLoteData] = useState({
    ID_Lote: "",
    Medidas_Lote_Norte: "",
    Medidas_Lote_Sur: "",
    Medidas_Lote_Este: "",
    Medidas_Lote_Oeste: "",
    Colindancia_Lote_Norte: "",
    Colindancia_Lote_Sur: "",
    Colindancia_Lote_Este: "",
    Colindancia_Lote_Oeste: "",
    Fecha_Registro: "",
    Nmro_Registro: "",
  })
  const [viviendaData, setViviendaData] = useState({
    ID_Vivienda: "",
    Color: "",
    Tipo_Techo: "",
    Area_Construccion: "",
    Cant_Habitaciones: "",
    Cant_Cocinas: "",
    Cant_Baños: "",
    Cant_Area_Servicios: "",
    Cant_Sala_Estar: "",
    Cant_Comedor: "",
    Cant_Garage: "",
    Cant_Oficina: "",
    Descripcion_Piso: "",
    Descripcion_Paredes: "",
    Descripcion_Techo: "",
    Descripcion_Estructura: "",
    Descripcion_Tuberia: "",
    Descripcion_Puertas: "",
    Descripcion_Ventanas: "",
    Descripcion_Instalacion_Electrica: "",
    Descripcion_Instalacion_Sanitaria: "",
    Descripcion_Acabados: "",
    Observaciones_Adicionales: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      setCurrentUser(JSON.parse(userString))
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleTerrenoChange = (e) => {
    const { name, value } = e.target
    setTerrenoData({ ...terrenoData, [name]: value })
  }

  const handleLoteChange = (e) => {
    const { name, value } = e.target
    setLoteData({ ...loteData, [name]: value })
  }

  const handleViviendaChange = (e) => {
    const { name, value } = e.target
    setViviendaData({ ...viviendaData, [name]: value })
  }

  const addLote = () => {
    if (!loteData.ID_Lote) {
      setError("Por favor ingrese el ID del lote")
      return
    }
    setLotes([...lotes, { ...loteData, viviendas: [] }])
    setLoteData({
      ID_Lote: "",
      Medidas_Lote_Norte: "",
      Medidas_Lote_Sur: "",
      Medidas_Lote_Este: "",
      Medidas_Lote_Oeste: "",
      Colindancia_Lote_Norte: "",
      Colindancia_Lote_Sur: "",
      Colindancia_Lote_Este: "",
      Colindancia_Lote_Oeste: "",
      Fecha_Registro: "",
      Nmro_Registro: "",
    })
    setModalLoteVisible(false)
    setError("")
  }

  const addVivienda = () => {
    if (!viviendaData.ID_Vivienda) {
      setError("Por favor ingrese el ID de la vivienda")
      return
    }
    const lotesActualizados = lotes.map((lote, index) => {
      if (index === loteActual) {
        return {
          ...lote,
          viviendas: [...lote.viviendas, viviendaData],
        }
      }
      return lote
    })
    setLotes(lotesActualizados)
    setViviendaData({
      ID_Vivienda: "",
      Color: "",
      Tipo_Techo: "",
      Area_Construccion: "",
      Cant_Habitaciones: "",
      Cant_Cocinas: "",
      Cant_Baños: "",
      Cant_Area_Servicios: "",
      Cant_Sala_Estar: "",
      Cant_Comedor: "",
      Cant_Garage: "",
      Cant_Oficina: "",
      Descripcion_Piso: "",
      Descripcion_Paredes: "",
      Descripcion_Techo: "",
      Descripcion_Estructura: "",
      Descripcion_Tuberia: "",
      Descripcion_Puertas: "",
      Descripcion_Ventanas: "",
      Descripcion_Instalacion_Electrica: "",
      Descripcion_Instalacion_Sanitaria: "",
      Descripcion_Acabados: "",
      Observaciones_Adicionales: "",
    })
    setModalViviendaVisible(false)
    setError("")
  }

  const handleSubmit = async () => {
    if (!terrenoData.ID_Terreno) {
      setError("Por favor ingrese el ID del terreno")
      return
    }

    try {
      // 1. Registrar el terreno
      const newTerreno = {
        ...terrenoData,
        Lote: lotes.map((lote) => ({
          ...lote,
          Vivienda: lote.viviendas,
        })),
      }

      const terrenoResponse = await api.post("Terreno", newTerreno)

      if (terrenoResponse.err) {
        throw new Error("Error al registrar el terreno")
      }

      // 2. Registrar en la tabla Duenos
      const duenoData = {
        Cedula: currentUser.Cedula,
        ID_Terreno: terrenoResponse.ID_Terreno || terrenoData.ID_Terreno,
        Status: "Activo",
        Porcentaje_de_Propiedad: "100%",
        Fecha_Tramite: new Date().toISOString().split("T")[0],
        Fecha_Adquisicion: new Date().toISOString().split("T")[0],
      }

      const duenoResponse = await api.post("Duenos", duenoData)

      if (duenoResponse.err) {
        throw new Error("Error al registrar el dueño")
      }

      setSuccess("Terreno registrado exitosamente!")
      setError("")

      // Reset form
      setTerrenoData({
        ID_Terreno: "",
        Medidas_Norte: "",
        Medidas_Sur: "",
        Medidas_Este: "",
        Medidas_Oeste: "",
        Colindancias_Norte: "",
        Colindancias_Sur: "",
        Colindancias_Este: "",
        Colindancias_Oeste: "",
      })
      setLotes([])
    } catch (error) {
      console.error("Error registering terreno:", error)
      setError("Error al registrar el terreno: " + error.message)
      setSuccess("")
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Registro de Terrenos</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              {error && <CAlert color="danger">{error}</CAlert>}
              {success && <CAlert color="success">{success}</CAlert>}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="ID_Terreno">ID del Terreno</CFormLabel>
                  <CFormInput
                    id="ID_Terreno"
                    name="ID_Terreno"
                    value={terrenoData.ID_Terreno}
                    onChange={handleTerrenoChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="Medidas_Norte">Medidas Norte</CFormLabel>
                  <CFormInput
                    id="Medidas_Norte"
                    name="Medidas_Norte"
                    value={terrenoData.Medidas_Norte}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="Medidas_Sur">Medidas Sur</CFormLabel>
                  <CFormInput
                    id="Medidas_Sur"
                    name="Medidas_Sur"
                    value={terrenoData.Medidas_Sur}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="Medidas_Este">Medidas Este</CFormLabel>
                  <CFormInput
                    id="Medidas_Este"
                    name="Medidas_Este"
                    value={terrenoData.Medidas_Este}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="Medidas_Oeste">Medidas Oeste</CFormLabel>
                  <CFormInput
                    id="Medidas_Oeste"
                    name="Medidas_Oeste"
                    value={terrenoData.Medidas_Oeste}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="Colindancias_Norte">Colindancias Norte</CFormLabel>
                  <CFormInput
                    id="Colindancias_Norte"
                    name="Colindancias_Norte"
                    value={terrenoData.Colindancias_Norte}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="Colindancias_Sur">Colindancias Sur</CFormLabel>
                  <CFormInput
                    id="Colindancias_Sur"
                    name="Colindancias_Sur"
                    value={terrenoData.Colindancias_Sur}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="Colindancias_Este">Colindancias Este</CFormLabel>
                  <CFormInput
                    id="Colindancias_Este"
                    name="Colindancias_Este"
                    value={terrenoData.Colindancias_Este}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="Colindancias_Oeste">Colindancias Oeste</CFormLabel>
                  <CFormInput
                    id="Colindancias_Oeste"
                    name="Colindancias_Oeste"
                    value={terrenoData.Colindancias_Oeste}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12}>
                  <CButton color="primary" onClick={() => setModalLoteVisible(true)}>
                    Agregar Lote
                  </CButton>
                </CCol>
              </CRow>
              {lotes.length > 0 && (
                <CRow className="mb-3">
                  <CCol md={12}>
                    <h6>Lotes agregados:</h6>
                    {lotes.map((lote, index) => (
                      <div key={index} className="mb-2">
                        <span>Lote {lote.ID_Lote}</span>
                        <CButton
                          color="secondary"
                          size="sm"
                          className="ms-2"
                          onClick={() => {
                            setLoteActual(index)
                            setModalViviendaVisible(true)
                          }}
                        >
                          Agregar Vivienda
                        </CButton>
                        {lote.viviendas.length > 0 && <span className="ms-2">({lote.viviendas.length} viviendas)</span>}
                      </div>
                    ))}
                  </CCol>
                </CRow>
              )}
              <CRow>
                <CCol md={12}>
                  <CButton color="success" onClick={handleSubmit}>
                    Registrar Terreno
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para agregar lote */}
      <CModal visible={modalLoteVisible} onClose={() => setModalLoteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Agregar Lote</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="ID_Lote">ID del Lote</CFormLabel>
                <CFormInput id="ID_Lote" name="ID_Lote" value={loteData.ID_Lote} onChange={handleLoteChange} required />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Fecha_Registro">Fecha de Registro</CFormLabel>
                <CFormInput
                  type="date"
                  id="Fecha_Registro"
                  name="Fecha_Registro"
                  value={loteData.Fecha_Registro}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="Nmro_Registro">Número de Registro</CFormLabel>
                <CFormInput
                  id="Nmro_Registro"
                  name="Nmro_Registro"
                  value={loteData.Nmro_Registro}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={3}>
                <CFormLabel htmlFor="Medidas_Lote_Norte">Medidas Norte</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Norte"
                  name="Medidas_Lote_Norte"
                  value={loteData.Medidas_Lote_Norte}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Medidas_Lote_Sur">Medidas Sur</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Sur"
                  name="Medidas_Lote_Sur"
                  value={loteData.Medidas_Lote_Sur}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Medidas_Lote_Este">Medidas Este</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Este"
                  name="Medidas_Lote_Este"
                  value={loteData.Medidas_Lote_Este}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Medidas_Lote_Oeste">Medidas Oeste</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Oeste"
                  name="Medidas_Lote_Oeste"
                  value={loteData.Medidas_Lote_Oeste}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalLoteVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={addLote}>
            Agregar Lote
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para agregar vivienda */}
      <CModal visible={modalViviendaVisible} onClose={() => setModalViviendaVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Agregar Vivienda</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="ID_Vivienda">ID de la Vivienda</CFormLabel>
                <CFormInput
                  id="ID_Vivienda"
                  name="ID_Vivienda"
                  value={viviendaData.ID_Vivienda}
                  onChange={handleViviendaChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Color">Color</CFormLabel>
                <CFormInput id="Color" name="Color" value={viviendaData.Color} onChange={handleViviendaChange} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Tipo_Techo">Tipo de Techo</CFormLabel>
                <CFormInput
                  id="Tipo_Techo"
                  name="Tipo_Techo"
                  value={viviendaData.Tipo_Techo}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Area_Construccion">Área de Construcción</CFormLabel>
                <CFormInput
                  id="Area_Construccion"
                  name="Area_Construccion"
                  value={viviendaData.Area_Construccion}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Habitaciones">Habitaciones</CFormLabel>
                <CFormInput
                  type="number"
                  id="Cant_Habitaciones"
                  name="Cant_Habitaciones"
                  value={viviendaData.Cant_Habitaciones}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Baños">Baños</CFormLabel>
                <CFormInput
                  type="number"
                  id="Cant_Baños"
                  name="Cant_Baños"
                  value={viviendaData.Cant_Baños}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Cocinas">Cocinas</CFormLabel>
                <CFormInput
                  type="number"
                  id="Cant_Cocinas"
                  name="Cant_Cocinas"
                  value={viviendaData.Cant_Cocinas}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="Observaciones_Adicionales">Observaciones Adicionales</CFormLabel>
                <CFormTextarea
                  id="Observaciones_Adicionales"
                  name="Observaciones_Adicionales"
                  rows={3}
                  value={viviendaData.Observaciones_Adicionales}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalViviendaVisible(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={addVivienda}>
            Agregar Vivienda
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default PropertyRegistry
