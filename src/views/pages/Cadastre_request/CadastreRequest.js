import React from 'react'
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
} from '@coreui/react'

const ConstanciasCatastrales = () => {
  return (
    <CRow>
      {/* Formulario para solicitar constancias */}
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <h5>Solicitud de Constancias Catastrales</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Cédula del Usuario</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Ingrese la cédula"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>ID del Terreno</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Ingrese el ID del terreno"
                  />
                </CCol>
              </CRow>
              <CButton type="submit" color="primary">
                Solicitar Constancia
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Tabla de historial de constancias */}
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
                {/* Ejemplo de filas vacías */}
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    No hay constancias registradas
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ConstanciasCatastrales
