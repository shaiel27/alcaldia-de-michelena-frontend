import React, { useState } from "react"
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
  CFormSelect,
} from "@coreui/react"

const RegistroTerrenos = () => {
  const [terrenoData, setTerrenoData] = useState({
    id_terreno: "",
    direccion: "",
    medidas_norte: "",
    medidas_sur: "",
    medidas_este: "",
    medidas_oeste: "",
    colindancias_norte: "",
    colindancias_sur: "",
    colindancias_este: "",
    colindancias_oeste: "",
    foto: null,
  })
  const [lotes, setLotes] = useState([])
  const [modalLoteVisible, setModalLoteVisible] = useState(false)
  const [modalViviendaVisible, setModalViviendaVisible] = useState(false)
  const [modalPropietarioVisible, setModalPropietarioVisible] = useState(false)
  const [loteActual, setLoteActual] = useState(null)
  const [loteData, setLoteData] = useState({
    id_lote: "",
    medidas_lote_norte: "",
    medidas_lote_sur: "",
    medidas_lote_este: "",
    medidas_lote_oeste: "",
    colindancia_lote_norte: "",
    colindancia_lote_sur: "",
    colindancia_lote_este: "",
    colindancia_lote_oeste: "",
    fecha_registro: "",
    nmro_registro: "",
    viviendas: [],
  })
  const [viviendaData, setViviendaData] = useState({
    id_vivienda: "",
    color: "",
    tipo_techo: "",
    area_construccion: "",
    cant_habitaciones: "",
    cant_cocinas: "",
    cant_baños: "",
    cant_area_servicios: "",
    cant_salaEstar: "",
    cant_comedor: "",
    cant_garage: "",
    cant_oficina: "",
    descripcion_piso: "",
    descripcion_paredes: "",
    descripcion_techo: "",
    descripcion_estructura: "",
    descripcion_tuberia: "",
    descripcion_puertas: "",
    descripcion_ventanas: "",
    descripcion_instalacion_electrica: "",
    descripcion_instalacion_sanitaria: "",
    descripcion_acabados: "",
    observaciones_adicionales: "",
  })
  const [propietarios, setPropietarios] = useState([])
  const [propietarioData, setPropietarioData] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    porcentaje_propiedad: "",
  })

  const handleTerrenoChange = (e) => {
    const { name, value } = e.target
    setTerrenoData({ ...terrenoData, [name]: value })
  }

  const handleFotoChange = (e) => {
    setTerrenoData({ ...terrenoData, foto: e.target.files[0] })
  }

  const handleLoteChange = (e) => {
    const { name, value } = e.target
    setLoteData({ ...loteData, [name]: value })
  }

  const handleViviendaChange = (e) => {
    const { name, value } = e.target
    setViviendaData({ ...viviendaData, [name]: value })
  }

  const handlePropietarioChange = (e) => {
    const { name, value } = e.target
    setPropietarioData({ ...propietarioData, [name]: value })
  }

  const addLote = () => {
    setLotes([...lotes, { ...loteData, viviendas: [] }])
    setLoteData({
      id_lote: "",
      medidas_lote_norte: "",
      medidas_lote_sur: "",
      medidas_lote_este: "",
      medidas_lote_oeste: "",
      colindancia_lote_norte: "",
      colindancia_lote_sur: "",
      colindancia_lote_este: "",
      colindancia_lote_oeste: "",
      fecha_registro: "",
      nmro_registro: "",
      viviendas: [],
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
      id_vivienda: "",
      color: "",
      tipo_techo: "",
      area_construccion: "",
      cant_habitaciones: "",
      cant_cocinas: "",
      cant_baños: "",
      cant_area_servicios: "",
      cant_salaEstar: "",
      cant_comedor: "",
      cant_garage: "",
      cant_oficina: "",
      descripcion_piso: "",
      descripcion_paredes: "",
      descripcion_techo: "",
      descripcion_estructura: "",
      descripcion_tuberia: "",
      descripcion_puertas: "",
      descripcion_ventanas: "",
      descripcion_instalacion_electrica: "",
      descripcion_instalacion_sanitaria: "",
      descripcion_acabados: "",
      observaciones_adicionales: "",
    })
    setModalViviendaVisible(false)
  }

  const addPropietario = () => {
    setPropietarios([...propietarios, propietarioData])
    setPropietarioData({
      nombre: "",
      apellido: "",
      identificacion: "",
      porcentaje_propiedad: "",
    })
    setModalPropietarioVisible(false)
  }

  const handleSubmit = () => {
    console.log({ terrenoData, lotes, propietarios })
    alert("Terreno registrado exitosamente!")
    // Aquí iría la lógica para enviar los datos al backend
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
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="id_terreno">ID del Terreno</CFormLabel>
                  <CFormInput
                    id="id_terreno"
                    name="id_terreno"
                    value={terrenoData.id_terreno}
                    onChange={handleTerrenoChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="direccion">Dirección del Terreno</CFormLabel>
                  <CFormInput
                    id="direccion"
                    name="direccion"
                    value={terrenoData.direccion}
                    onChange={handleTerrenoChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="medidas_norte">Medidas Norte</CFormLabel>
                  <CFormInput
                    id="medidas_norte"
                    name="medidas_norte"
                    value={terrenoData.medidas_norte}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="medidas_sur">Medidas Sur</CFormLabel>
                  <CFormInput
                    id="medidas_sur"
                    name="medidas_sur"
                    value={terrenoData.medidas_sur}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="medidas_este">Medidas Este</CFormLabel>
                  <CFormInput
                    id="medidas_este"
                    name="medidas_este"
                    value={terrenoData.medidas_este}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="medidas_oeste">Medidas Oeste</CFormLabel>
                  <CFormInput
                    id="medidas_oeste"
                    name="medidas_oeste"
                    value={terrenoData.medidas_oeste}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="colindancias_norte">Colindancias Norte</CFormLabel>
                  <CFormInput
                    id="colindancias_norte"
                    name="colindancias_norte"
                    value={terrenoData.colindancias_norte}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="colindancias_sur">Colindancias Sur</CFormLabel>
                  <CFormInput
                    id="colindancias_sur"
                    name="colindancias_sur"
                    value={terrenoData.colindancias_sur}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="colindancias_este">Colindancias Este</CFormLabel>
                  <CFormInput
                    id="colindancias_este"
                    name="colindancias_este"
                    value={terrenoData.colindancias_este}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormLabel htmlFor="colindancias_oeste">Colindancias Oeste</CFormLabel>
                  <CFormInput
                    id="colindancias_oeste"
                    name="colindancias_oeste"
                    value={terrenoData.colindancias_oeste}
                    onChange={handleTerrenoChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="foto">Foto del Terreno</CFormLabel>
                  <CFormInput type="file" id="foto" name="foto" onChange={handleFotoChange} accept="image/*" />
                </CCol>
              </CRow>
              <CButton color="primary" onClick={() => setModalLoteVisible(true)} className="me-2">
                Agregar Lote
              </CButton>
              <CButton color="info" onClick={() => setModalPropietarioVisible(true)}>
                Agregar Propietario
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
                <CFormLabel htmlFor="id_lote">ID del Lote</CFormLabel>
                <CFormInput id="id_lote" name="id_lote" value={loteData.id_lote} onChange={handleLoteChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="fecha_registro">Fecha de Registro</CFormLabel>
                <CFormInput
                  id="fecha_registro"
                  name="fecha_registro"
                  type="date"
                  value={loteData.fecha_registro}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="medidas_lote_norte">Medidas Norte</CFormLabel>
                <CFormInput
                  id="medidas_lote_norte"
                  name="medidas_lote_norte"
                  value={loteData.medidas_lote_norte}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="medidas_lote_sur">Medidas Sur</CFormLabel>
                <CFormInput
                  id="medidas_lote_sur"
                  name="medidas_lote_sur"
                  value={loteData.medidas_lote_sur}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="medidas_lote_este">Medidas Este</CFormLabel>
                <CFormInput
                  id="medidas_lote_este"
                  name="medidas_lote_este"
                  value={loteData.medidas_lote_este}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="medidas_lote_oeste">Medidas Oeste</CFormLabel>
                <CFormInput
                  id="medidas_lote_oeste"
                  name="medidas_lote_oeste"
                  value={loteData.medidas_lote_oeste}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="colindancia_lote_norte">Colindancia Norte</CFormLabel>
                <CFormInput
                  id="colindancia_lote_norte"
                  name="colindancia_lote_norte"
                  value={loteData.colindancia_lote_norte}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="colindancia_lote_sur">Colindancia Sur</CFormLabel>
                <CFormInput
                  id="colindancia_lote_sur"
                  name="colindancia_lote_sur"
                  value={loteData.colindancia_lote_sur}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="colindancia_lote_este">Colindancia Este</CFormLabel>
                <CFormInput
                  id="colindancia_lote_este"
                  name="colindancia_lote_este"
                  value={loteData.colindancia_lote_este}
                  onChange={handleLoteChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="colindancia_lote_oeste">Colindancia Oeste</CFormLabel>
                <CFormInput
                  id="colindancia_lote_oeste"
                  name="colindancia_lote_oeste"
                  value={loteData.colindancia_lote_oeste}
                  onChange={handleLoteChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="nmro_registro">Número de Registro</CFormLabel>
                <CFormInput
                  id="nmro_registro"
                  name="nmro_registro"
                  value={loteData.nmro_registro}
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
                <CFormLabel htmlFor="id_vivienda">ID de la Vivienda</CFormLabel>
                <CFormInput
                  id="id_vivienda"
                  name="id_vivienda"
                  value={viviendaData.id_vivienda}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="color">Color</CFormLabel>
                <CFormInput id="color" name="color" value={viviendaData.color} onChange={handleViviendaChange} />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="tipo_techo">Tipo de Techo</CFormLabel>
                <CFormInput
                  id="tipo_techo"
                  name="tipo_techo"
                  value={viviendaData.tipo_techo}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="area_construccion">Área de Construcción</CFormLabel>
                <CFormInput
                  id="area_construccion"
                  name="area_construccion"
                  value={viviendaData.area_construccion}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="cant_habitaciones">Habitaciones</CFormLabel>
                <CFormInput
                  id="cant_habitaciones"
                  name="cant_habitaciones"
                  type="number"
                  value={viviendaData.cant_habitaciones}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="cant_cocinas">Cocinas</CFormLabel>
                <CFormInput
                  id="cant_cocinas"
                  name="cant_cocinas"
                  type="number"
                  value={viviendaData.cant_cocinas}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="cant_baños">Baños</CFormLabel>
                <CFormInput
                  id="cant_baños"
                  name="cant_baños"
                  type="number"
                  value={viviendaData.cant_baños}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="cant_area_servicios">Áreas de Servicio</CFormLabel>
                <CFormInput
                  id="cant_area_servicios"
                  name="cant_area_servicios"
                  type="number"
                  value={viviendaData.cant_area_servicios}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="cant_salaEstar">Salas de Estar</CFormLabel>
                <CFormInput
                  id="cant_salaEstar"
                  name="cant_salaEstar"
                  type="number"
                  value={viviendaData.cant_salaEstar}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="cant_comedor">Comedores</CFormLabel>
                <CFormInput
                  id="cant_comedor"
                  name="cant_comedor"
                  type="number"
                  value={viviendaData.cant_comedor}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="cant_garage">Garajes</CFormLabel>
                <CFormInput
                  id="cant_garage"
                  name="cant_garage"
                  type="number"
                  value={viviendaData.cant_garage}
                  onChange={handleViviendaChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="cant_oficina">Oficinas</CFormLabel>
                <CFormInput
                  id="cant_oficina"
                  name="cant_oficina"
                  type="number"
                  value={viviendaData.cant_oficina}
                  onChange={handleViviendaChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_piso">Descripción del Piso</CFormLabel>
                <CFormTextarea
                  id="descripcion_piso"
                  name="descripcion_piso"
                  value={viviendaData.descripcion_piso}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_paredes">Descripción de las Paredes</CFormLabel>
                <CFormTextarea
                  id="descripcion_paredes"
                  name="descripcion_paredes"
                  value={viviendaData.descripcion_paredes}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_techo">Descripción del Techo</CFormLabel>
                <CFormTextarea
                  id="descripcion_techo"
                  name="descripcion_techo"
                  value={viviendaData.descripcion_techo}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_estructura">Descripción de la Estructura</CFormLabel>
                <CFormTextarea
                  id="descripcion_estructura"
                  name="descripcion_estructura"
                  value={viviendaData.descripcion_estructura}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_tuberia">Descripción de la Tubería</CFormLabel>
                <CFormTextarea
                  id="descripcion_tuberia"
                  name="descripcion_tuberia"
                  value={viviendaData.descripcion_tuberia}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_puertas">Descripción de las Puertas</CFormLabel>
                <CFormTextarea
                  id="descripcion_puertas"
                  name="descripcion_puertas"
                  value={viviendaData.descripcion_puertas}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_ventanas">Descripción de las Ventanas</CFormLabel>
                <CFormTextarea
                  id="descripcion_ventanas"
                  name="descripcion_ventanas"
                  value={viviendaData.descripcion_ventanas}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_instalacion_electrica">
                  Descripción de la Instalación Eléctrica
                </CFormLabel>
                <CFormTextarea
                  id="descripcion_instalacion_electrica"
                  name="descripcion_instalacion_electrica"
                  value={viviendaData.descripcion_instalacion_electrica}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_instalacion_sanitaria">
                  Descripción de la Instalación Sanitaria
                </CFormLabel>
                <CFormTextarea
                  id="descripcion_instalacion_sanitaria"
                  name="descripcion_instalacion_sanitaria"
                  value={viviendaData.descripcion_instalacion_sanitaria}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="descripcion_acabados">Descripción de los Acabados</CFormLabel>
                <CFormTextarea
                  id="descripcion_acabados"
                  name="descripcion_acabados"
                  value={viviendaData.descripcion_acabados}
                  onChange={handleViviendaChange}
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CFormLabel htmlFor="observaciones_adicionales">Observaciones Adicionales</CFormLabel>
                <CFormTextarea
                  id="observaciones_adicionales"
                  name="observaciones_adicionales"
                  value={viviendaData.observaciones_adicionales}
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

      {/* Modal para agregar propietarios */}
      <CModal visible={modalPropietarioVisible} onClose={() => setModalPropietarioVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Agregar Propietario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="nombre">Nombre</CFormLabel>
                <CFormInput
                  id="nombre"
                  name="nombre"
                  value={propietarioData.nombre}
                  onChange={handlePropietarioChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="apellido">Apellido</CFormLabel>
                <CFormInput
                  id="apellido"
                  name="apellido"
                  value={propietarioData.apellido}
                  onChange={handlePropietarioChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="identificacion">Identificación</CFormLabel>
                <CFormInput
                  id="identificacion"
                  name="identificacion"
                  value={propietarioData.identificacion}
                  onChange={handlePropietarioChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="porcentaje_propiedad">Porcentaje de Propiedad</CFormLabel>
                <CFormInput
                  id="porcentaje_propiedad"
                  name="porcentaje_propiedad"
                  type="number"
                  min="0"
                  max="100"
                  value={propietarioData.porcentaje_propiedad}
                  onChange={handlePropietarioChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={addPropietario}>
            Guardar Propietario
          </CButton>
          <CButton color="secondary" onClick={() => setModalPropietarioVisible(false)}>
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
                  <p>ID: {lote.id_lote}</p>
                  <p>
                    Medidas: N {lote.medidas_lote_norte}, S {lote.medidas_lote_sur}, E {lote.medidas_lote_este}, O{" "}
                    {lote.medidas_lote_oeste}
                  </p>
                  <p>Fecha de Registro: {lote.fecha_registro}</p>
                  <h6>Viviendas:</h6>
                  {lote.viviendas.length > 0 ? (
                    lote.viviendas.map((vivienda, vIndex) => (
                      <div key={vIndex} className="ml-4 mb-2">
                        <p>ID: {vivienda.id_vivienda}</p>
                        <p>Color: {vivienda.color}</p>
                        <p>Área: {vivienda.area_construccion}</p>
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

      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>
            <h5>Propietarios Registrados</h5>
          </CCardHeader>
          <CCardBody>
            {propietarios.length > 0 ? (
              propietarios.map((propietario, index) => (
                <div key={index} className="mb-2">
                  <p>
                    Nombre: {propietario.nombre} {propietario.apellido}
                  </p>
                  <p>Identificación: {propietario.identificacion}</p>
                  <p>Porcentaje de Propiedad: {propietario.porcentaje_propiedad}%</p>
                </div>
              ))
            ) : (
              <p>No se han agregado propietarios.</p>
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

export default RegistroTerrenos

