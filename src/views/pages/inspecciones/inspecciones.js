import { useState } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react"
import { CChartDoughnut, CChartBar } from "@coreui/react-chartjs"

const GestionInspeccionesIngenieria = () => {
  const [inspecciones, setInspecciones] = useState([
    {
      id: 1,
      fecha: "2025-01-15",
      tipo: "Construcción",
      direccion: "Calle Principal #123",
      inspector: "Juan Pérez",
      estado: "Completada",
      resultado: "Aprobada",
    },
    {
      id: 2,
      fecha: "2025-01-18",
      tipo: "Remodelación",
      direccion: "Av. Central #456",
      inspector: "María Gómez",
      estado: "Pendiente",
      resultado: "Pendiente",
    },
    {
      id: 3,
      fecha: "2025-01-20",
      tipo: "Demolición",
      direccion: "Carrera 7 #789",
      inspector: "Carlos Rodríguez",
      estado: "En Proceso",
      resultado: "Pendiente",
    },
    {
      id: 4,
      fecha: "2025-01-22",
      tipo: "Construcción",
      direccion: "Calle 10 #234",
      inspector: "Ana Martínez",
      estado: "Completada",
      resultado: "Rechazada",
    },
    {
      id: 5,
      fecha: "2025-01-25",
      tipo: "Remodelación",
      direccion: "Av. Libertador #567",
      inspector: "Juan Pérez",
      estado: "Completada",
      resultado: "Aprobada",
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [nuevaInspeccion, setNuevaInspeccion] = useState({
    fecha: "",
    tipo: "Construcción",
    direccion: "",
    inspector: "",
    estado: "Pendiente",
    resultado: "Pendiente",
  })

  const handleNuevaInspeccion = () => {
    setInspecciones([...inspecciones, { ...nuevaInspeccion, id: inspecciones.length + 1 }])
    setShowModal(false)
    setNuevaInspeccion({
      fecha: "",
      tipo: "Construcción",
      direccion: "",
      inspector: "",
      estado: "Pendiente",
      resultado: "Pendiente",
    })
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Completada":
        return "success"
      case "En Proceso":
        return "warning"
      case "Pendiente":
        return "info"
      default:
        return "primary"
    }
  }

  const getResultColor = (resultado) => {
    switch (resultado) {
      case "Aprobada":
        return "success"
      case "Rechazada":
        return "danger"
      case "Pendiente":
        return "info"
      default:
        return "primary"
    }
  }

  const inspeccionesPorTipo = {
    labels: ["Construcción", "Remodelación", "Demolición", "Otros"],
    datasets: [
      {
        data: [
          inspecciones.filter((i) => i.tipo === "Construcción").length,
          inspecciones.filter((i) => i.tipo === "Remodelación").length,
          inspecciones.filter((i) => i.tipo === "Demolición").length,
          inspecciones.filter((i) => !["Construcción", "Remodelación", "Demolición"].includes(i.tipo)).length,
        ],
        backgroundColor: ["#321fdb", "#2eb85c", "#f9b115", "#3399ff"],
      },
    ],
  }

  const inspeccionesPorEstado = {
    labels: ["Completada", "En Proceso", "Pendiente"],
    datasets: [
      {
        label: "Número de Inspecciones",
        backgroundColor: ["#2eb85c", "#f9b115", "#3399ff"],
        data: [
          inspecciones.filter((i) => i.estado === "Completada").length,
          inspecciones.filter((i) => i.estado === "En Proceso").length,
          inspecciones.filter((i) => i.estado === "Pendiente").length,
        ],
      },
    ],
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Gestión de Inspecciones - Departamento de Ingeniería</h2>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <h4>Inspecciones por Tipo</h4>
                <CChartDoughnut
                  data={inspeccionesPorTipo}
                  options={{
                    aspectRatio: 2,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </CCol>
              <CCol md={6}>
                <h4>Inspecciones por Estado</h4>
                <CChartBar
                  data={inspeccionesPorEstado}
                  options={{
                    aspectRatio: 2,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <CCol xs={12}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>Registro de Inspecciones</h4>
                  <CButton color="primary" onClick={() => setShowModal(true)}>
                    Nueva Inspección
                  </CButton>
                </div>
                <CTable bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Tipo</CTableHeaderCell>
                      <CTableHeaderCell>Dirección</CTableHeaderCell>
                      <CTableHeaderCell>Inspector</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Resultado</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {inspecciones.map((inspeccion) => (
                      <CTableRow key={inspeccion.id}>
                        <CTableDataCell>{inspeccion.fecha}</CTableDataCell>
                        <CTableDataCell>{inspeccion.tipo}</CTableDataCell>
                        <CTableDataCell>{inspeccion.direccion}</CTableDataCell>
                        <CTableDataCell>{inspeccion.inspector}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusColor(inspeccion.estado)}>{inspeccion.estado}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getResultColor(inspeccion.resultado)}>{inspeccion.resultado}</CBadge>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>Registrar Nueva Inspección</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Fecha</CFormLabel>
              <CFormInput
                type="date"
                value={nuevaInspeccion.fecha}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, fecha: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo</CFormLabel>
              <CFormSelect
                value={nuevaInspeccion.tipo}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, tipo: e.target.value })}
              >
                <option value="Construcción">Construcción</option>
                <option value="Remodelación">Remodelación</option>
                <option value="Demolición">Demolición</option>
                <option value="Otros">Otros</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Dirección</CFormLabel>
              <CFormInput
                type="text"
                value={nuevaInspeccion.direccion}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, direccion: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Inspector</CFormLabel>
              <CFormInput
                type="text"
                value={nuevaInspeccion.inspector}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, inspector: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Estado</CFormLabel>
              <CFormSelect
                value={nuevaInspeccion.estado}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, estado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Resultado</CFormLabel>
              <CFormSelect
                value={nuevaInspeccion.resultado}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, resultado: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleNuevaInspeccion}>
            Guardar Inspección
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default GestionInspeccionesIngenieria

