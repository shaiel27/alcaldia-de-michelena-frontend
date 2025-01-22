import React, { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CFormSelect,
  CButton,
  CListGroup,
  CListGroupItem,
  CBadge,
  CProgress,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilHouse, cilLayers, cilSearch } from "@coreui/icons"

const VisualizacionPropiedades = () => {
  const [filtro, setFiltro] = useState("")
  const [tipoPropiedad, setTipoPropiedad] = useState("todos")

  // Datos de ejemplo
  const propiedades = [
    { id: 1, tipo: "terreno", nombre: "Terreno A", direccion: "Calle 123, Ciudad", area: 1000, unidades: 2 },
    { id: 2, tipo: "vivienda", nombre: "Casa 1", direccion: "Avenida 456, Ciudad", habitaciones: 3, banos: 2 },
    { id: 3, tipo: "terreno", nombre: "Terreno B", direccion: "Carrera 789, Ciudad", area: 1500, unidades: 0 },
    { id: 4, tipo: "vivienda", nombre: "Apartamento 1", direccion: "Calle 101, Ciudad", habitaciones: 2, banos: 1 },
  ]

  const propiedadesFiltradas = propiedades.filter(
    (propiedad) =>
      (tipoPropiedad === "todos" || propiedad.tipo === tipoPropiedad) &&
      (propiedad.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        propiedad.direccion.toLowerCase().includes(filtro.toLowerCase())),
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4 className="mb-0">Mis Propiedades</h4>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  type="text"
                  placeholder="Buscar por nombre o dirección"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect value={tipoPropiedad} onChange={(e) => setTipoPropiedad(e.target.value)}>
                  <option value="todos">Todos los tipos</option>
                  <option value="terreno">Terrenos</option>
                  <option value="vivienda">Viviendas</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CButton color="primary" className="w-100">
                  <CIcon icon={cilSearch} className="me-2" />
                  Buscar
                </CButton>
              </CCol>
            </CRow>

            <CListGroup>
              {propiedadesFiltradas.map((propiedad) => (
                <CListGroupItem key={propiedad.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      {propiedad.tipo === "terreno" ? (
                        <CIcon icon={cilLayers} className="me-2" />
                      ) : (
                        <CIcon icon={cilHouse} className="me-2" />
                      )}
                      {propiedad.nombre}
                    </h5>
                    <p className="mb-1">{propiedad.direccion}</p>
                    {propiedad.tipo === "terreno" ? (
                      <small>
                        Área: {propiedad.area} m² | Unidades: {propiedad.unidades}
                      </small>
                    ) : (
                      <small>
                        Habitaciones: {propiedad.habitaciones} | Baños: {propiedad.banos}
                      </small>
                    )}
                  </div>
                  <div className="text-end">
                    <CBadge color={propiedad.tipo === "terreno" ? "primary" : "success"} className="mb-2">
                      {propiedad.tipo === "terreno" ? "Terreno" : "Vivienda"}
                    </CBadge>
                    {propiedad.tipo === "terreno" && (
                      <CProgress className="mt-2" height={10}>
                        <CProgress color="info" variant="striped" animated value={(propiedad.unidades / 5) * 100} />
                      </CProgress>
                    )}
                  </div>
                </CListGroupItem>
              ))}
            </CListGroup>

            {propiedadesFiltradas.length === 0 && (
              <div className="text-center mt-4">
                <h5>No se encontraron propiedades</h5>
                <p>Intente con otros criterios de búsqueda</p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default VisualizacionPropiedades

