"use client"

import { useState, useEffect } from "react"
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
  CSpinner,
  CAlert,
  CFormTextarea,
} from "@coreui/react"
import { CChartDoughnut, CChartBar } from "@coreui/react-chartjs"
import { helpFetch } from "../../../api/helpfetch"

const GestionInspeccionesIngenieria = () => {
  const [inspecciones, setInspecciones] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [nuevaInspeccion, setNuevaInspeccion] = useState({
    fecha: "",
    tipo: "Construcción",
    direccion: "",
    inspector: "",
    estado: "Pendiente",
    resultado: "Pendiente",
    descripcion: "",
  })

  const api = helpFetch()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [inspeccionesData, empleadosData] = await Promise.all([api.get("Inspeccion"), api.get("Empleado")])

      if (inspeccionesData && !inspeccionesData.error) {
        // Transform inspections data to match component structure
        const transformedInspecciones = inspeccionesData.map((insp) => ({
          id: insp.ID_Inspeccion,
          fecha: insp.Fecha_Inspeccion,
          tipo: insp.Descripcion_Problematica?.includes("Construcción")
            ? "Construcción"
            : insp.Descripcion_Problematica?.includes("Remodelación")
              ? "Remodelación"
              : insp.Descripcion_Problematica?.includes("Demolición")
                ? "Demolición"
                : "Otros",
          direccion: `Inspección ${insp.ID_Inspeccion}`,
          inspector: insp.Inspector || "No asignado",
          estado: insp.Estado || "Pendiente",
          resultado: insp.Estado === "Completada" ? "Aprobada" : "Pendiente",
          descripcion: insp.Descripcion_Problematica || "",
        }))
        setInspecciones(transformedInspecciones)
      }

      if (empleadosData && !empleadosData.error) {
        setEmpleados(empleadosData)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleNuevaInspeccion = async () => {
    try {
      setLoading(true)

      // Get next ID
      const nextId = Math.max(...inspecciones.map((i) => Number.parseInt(i.id) || 0), 0) + 1

      const nuevaInspeccionData = {
        ID_Inspeccion: nextId.toString(),
        Fecha_Inspeccion: nuevaInspeccion.fecha,
        Descripcion_Problematica: `${nuevaInspeccion.tipo}: ${nuevaInspeccion.descripcion}`,
        Estado: nuevaInspeccion.estado,
        Inspector: nuevaInspeccion.inspector,
        Detalle: "1", // Default detail reference
      }

      const response = await api.post("Inspeccion", { body: nuevaInspeccionData })

      if (response && !response.error) {
        setSuccess("Inspección registrada exitosamente")
        setShowModal(false)
        setNuevaInspeccion({
          fecha: "",
          tipo: "Construcción",
          direccion: "",
          inspector: "",
          estado: "Pendiente",
          resultado: "Pendiente",
          descripcion: "",
        })
        fetchData() // Refresh data
      } else {
        throw new Error("Error al registrar la inspección")
      }
    } catch (err) {
      console.error("Error creating inspection:", err)
      setError("Error al registrar la inspección")
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Gestión de Inspecciones - Departamento de Ingeniería</h2>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {success && <CAlert color="success">{success}</CAlert>}

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
              <CFormSelect
                value={nuevaInspeccion.inspector}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, inspector: e.target.value })}
              >
                <option value="">Seleccionar Inspector</option>
                {empleados.map((empleado) => (
                  <option key={empleado.ID_Empleado} value={`${empleado.Nombre} ${empleado.Apellido}`}>
                    {empleado.Nombre} {empleado.Apellido}
                  </option>
                ))}
              </CFormSelect>
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
              <CFormLabel>Descripción</CFormLabel>
              <CFormTextarea
                rows={3}
                value={nuevaInspeccion.descripcion}
                onChange={(e) => setNuevaInspeccion({ ...nuevaInspeccion, descripcion: e.target.value })}
                placeholder="Descripción de la inspección"
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleNuevaInspeccion} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : "Guardar Inspección"}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default GestionInspeccionesIngenieria
