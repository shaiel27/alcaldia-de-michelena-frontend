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
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CAlert,
} from "@coreui/react"
import { helpFetch } from "../api/helpfetch"

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
  }

  const addVivienda = () => {
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
  }

  const handleSubmit = async () => {
    try {
      const newTerreno = {
        ...terrenoData,
        Lote: lotes.map((lote) => ({
          ...lote,
          Vivienda: lote.viviendas,
        })),
      }

      await api.post("Terreno", { body: newTerreno })
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
      setError("Error al registrar el terreno")
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
              <CButton color="primary" onClick={() => setModalLoteVisible(true)} className="me-2">
                Agregar Lote
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para agregar lotes */}
      <CModal visible={modalLoteVisible} onClose={() => setModalLoteVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Agregar Lote</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="ID_Lote">ID del Lote</CFormLabel>
                <CFormInput id="ID_Lote" name="ID_Lote" value={loteData.ID_Lote} onChange={handleLoteChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Fecha_Registro">Fecha de Registro</CFormLabel>
                <CFormInput
                  id="Fecha_Registro"
                  name="Fecha_Registro"
                  type="date"
                  value={loteData.Fecha_Registro}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Medidas_Lote_Norte">Medidas Norte</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Norte"
                  name="Medidas_Lote_Norte"
                  value={loteData.Medidas_Lote_Norte}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Medidas_Lote_Sur">Medidas Sur</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Sur"
                  name="Medidas_Lote_Sur"
                  value={loteData.Medidas_Lote_Sur}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Medidas_Lote_Este">Medidas Este</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Este"
                  name="Medidas_Lote_Este"
                  value={loteData.Medidas_Lote_Este}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Medidas_Lote_Oeste">Medidas Oeste</CFormLabel>
                <CFormInput
                  id="Medidas_Lote_Oeste"
                  name="Medidas_Lote_Oeste"
                  value={loteData.Medidas_Lote_Oeste}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Colindancia_Lote_Norte">Colindancia Norte</CFormLabel>
                <CFormInput
                  id="Colindancia_Lote_Norte"
                  name="Colindancia_Lote_Norte"
                  value={loteData.Colindancia_Lote_Norte}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Colindancia_Lote_Sur">Colindancia Sur</CFormLabel>
                <CFormInput
                  id="Colindancia_Lote_Sur"
                  name="Colindancia_Lote_Sur"
                  value={loteData.Colindancia_Lote_Sur}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Colindancia_Lote_Este">Colindancia Este</CFormLabel>
                <CFormInput
                  id="Colindancia_Lote_Este"
                  name="Colindancia_Lote_Este"
                  value={loteData.Colindancia_Lote_Este}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Colindancia_Lote_Oeste">Colindancia Oeste</CFormLabel>
                <CFormInput
                  id="Colindancia_Lote_Oeste"
                  name="Colindancia_Lote_Oeste"
                  value={loteData.Colindancia_Lote_Oeste}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Nmro_Registro">Número de Registro</CFormLabel>
                <CFormInput
                  id="Nmro_Registro"
                  name="Nmro_Registro"
                  value={loteData.Nmro_Registro}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={addLote}>
            Guardar Lote
          </CButton>
          <CButton color="secondary" onClick={() => setModalLoteVisible(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para agregar viviendas */}
      <CModal visible={modalViviendaVisible} onClose={() => setModalViviendaVisible(false)} size="xl">
        <CModalHeader closeButton>
          <CModalTitle>Agregar Vivienda</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="ID_Vivienda">ID de la Vivienda</CFormLabel>
                <CFormInput
                  id="ID_Vivienda"
                  name="ID_Vivienda"
                  value={viviendaData.ID_Vivienda}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Color">Color</CFormLabel>
                <CFormInput id="Color" name="Color" value={viviendaData.Color} onChange={handleViviendaChange} />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Tipo_Techo">Tipo de Techo</CFormLabel>
                <CFormInput
                  id="Tipo_Techo"
                  name="Tipo_Techo"
                  value={viviendaData.Tipo_Techo}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="Area_Construccion">Área de Construcción</CFormLabel>
                <CFormInput
                  id="Area_Construccion"
                  name="Area_Construccion"
                  value={viviendaData.Area_Construccion}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Habitaciones">Habitaciones</CFormLabel>
                <CFormInput
                  id="Cant_Habitaciones"
                  name="Cant_Habitaciones"
                  type="number"
                  value={viviendaData.Cant_Habitaciones}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Cocinas">Cocinas</CFormLabel>
                <CFormInput
                  id="Cant_Cocinas"
                  name="Cant_Cocinas"
                  type="number"
                  value={viviendaData.Cant_Cocinas}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Baños">Baños</CFormLabel>
                <CFormInput
                  id="Cant_Baños"
                  name="Cant_Baños"
                  type="number"
                  value={viviendaData.Cant_Baños}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Area_Servicios">Áreas de Servicio</CFormLabel>
                <CFormInput
                  id="Cant_Area_Servicios"
                  name="Cant_Area_Servicios"
                  type="number"
                  value={viviendaData.Cant_Area_Servicios}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Sala_Estar">Salas de Estar</CFormLabel>
                <CFormInput
                  id="Cant_Sala_Estar"
                  name="Cant_Sala_Estar"
                  type="number"
                  value={viviendaData.Cant_Sala_Estar}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Comedor">Comedores</CFormLabel>
                <CFormInput
                  id="Cant_Comedor"
                  name="Cant_Comedor"
                  type="number"
                  value={viviendaData.Cant_Comedor}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Garage">Garajes</CFormLabel>
                <CFormInput
                  id="Cant_Garage"
                  name="Cant_Garage"
                  type="number"
                  value={viviendaData.Cant_Garage}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="Cant_Oficina">Oficinas</CFormLabel>
                <CFormInput
                  id="Cant_Oficina"
                  name="Cant_Oficina"
                  type="number"
                  value={viviendaData.Cant_Oficina}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Piso">Descripción del Piso</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Piso"
                  name="Descripcion_Piso"
                  value={viviendaData.Descripcion_Piso}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Paredes">Descripción de las Paredes</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Paredes"
                  name="Descripcion_Paredes"
                  value={viviendaData.Descripcion_Paredes}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Techo">Descripción del Techo</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Techo"
                  name="Descripcion_Techo"
                  value={viviendaData.Descripcion_Techo}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Estructura">Descripción de la Estructura</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Estructura"
                  name="Descripcion_Estructura"
                  value={viviendaData.Descripcion_Estructura}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Tuberia">Descripción de la Tubería</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Tuberia"
                  name="Descripcion_Tuberia"
                  value={viviendaData.Descripcion_Tuberia}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Puertas">Descripción de las Puertas</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Puertas"
                  name="Descripcion_Puertas"
                  value={viviendaData.Descripcion_Puertas}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Ventanas">Descripción de las Ventanas</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Ventanas"
                  name="Descripcion_Ventanas"
                  value={viviendaData.Descripcion_Ventanas}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Instalacion_Electrica">
                  Descripción de la Instalación Eléctrica
                </CFormLabel>
                <CFormTextarea
                  id="Descripcion_Instalacion_Electrica"
                  name="Descripcion_Instalacion_Electrica"
                  value={viviendaData.Descripcion_Instalacion_Electrica}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Instalacion_Sanitaria">
                  Descripción de la Instalación Sanitaria
                </CFormLabel>
                <CFormTextarea
                  id="Descripcion_Instalacion_Sanitaria"
                  name="Descripcion_Instalacion_Sanitaria"
                  value={viviendaData.Descripcion_Instalacion_Sanitaria}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="Descripcion_Acabados">Descripción de los Acabados</CFormLabel>
                <CFormTextarea
                  id="Descripcion_Acabados"
                  name="Descripcion_Acabados"
                  value={viviendaData.Descripcion_Acabados}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="Observaciones_Adicionales">Observaciones Adicionales</CFormLabel>
                <CFormTextarea
                  id="Observaciones_Adicionales"
                  name="Observaciones_Adicionales"
                  value={viviendaData.Observaciones_Adicionales}
                  onChange={handleViviendaChange}
                  rows={4}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={addVivienda}>
            Guardar Vivienda
          </CButton>
          <CButton color="secondary" onClick={() => setModalViviendaVisible(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>

      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>
            <h5>Lotes y Viviendas Registrados</h5>
          </CCardHeader>
          <CCardBody>
            {lotes.length > 0 ? (
              lotes.map((lote, index) => (
                <div key={index} className="mb-4">
                  <h6>Lote {index + 1}</h6>
                  <p>ID: {lote.ID_Lote}</p>
                  <p>
                    Medidas: N {lote.Medidas_Lote_Norte}, S {lote.Medidas_Lote_Sur}, E {lote.Medidas_Lote_Este}, O{" "}
                    {lote.Medidas_Lote_Oeste}
                  </p>
                  <p>Fecha de Registro: {lote.Fecha_Registro}</p>
                  <h6>Viviendas:</h6>
                  {lote.viviendas.length > 0 ? (
                    lote.viviendas.map((vivienda, vIndex) => (
                      <div key={vIndex} className="ml-4 mb-2">
                        <p>ID: {vivienda.ID_Vivienda}</p>
                        <p>Color: {vivienda.Color}</p>
                        <p>Área: {vivienda.Area_Construccion}</p>
                      </div>
                    ))
                  ) : (
                    <p>No hay viviendas registradas en este lote.</p>
                  )}
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => {
                      setLoteActual(index)
                      setModalViviendaVisible(true)
                    }}
                  >
                    Agregar Vivienda
                  </CButton>
                </div>
              ))
            ) : (
              <p>No se han agregado lotes.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} className="mt-3">
        <CButton color="success" onClick={handleSubmit}>
          Registrar Terreno
        </CButton>
      </CCol>
    </CRow>
  )
}

export default PropertyRegistry

