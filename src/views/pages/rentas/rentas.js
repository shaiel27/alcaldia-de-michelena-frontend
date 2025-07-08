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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CAlert,
  CSpinner,
} from "@coreui/react"
import { CChartBar, CChartDoughnut } from "@coreui/react-chartjs"
import { helpFetch } from "../../../api/helpfetch"

const AdministracionRentasMichelena = () => {
  const [ingresos, setIngresos] = useState([])
  const [ayudas, setAyudas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    concepto: "",
    monto: "",
    tipo: "",
    fecha: "",
  })

  const api = helpFetch()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [ingresosResponse, ayudasResponse] = await Promise.all([api.get("Ingresos"), api.get("Ayudas_Registradas")])

      // Handle ingresos response with proper error checking
      const safeIngresos = Array.isArray(ingresosResponse) && !ingresosResponse.err ? ingresosResponse : []

      // Handle ayudas response with proper error checking
      const safeAyudas = Array.isArray(ayudasResponse) && !ayudasResponse.err ? ayudasResponse : []

      setIngresos(safeIngresos)
      setAyudas(safeAyudas)

      if (ingresosResponse?.err || ayudasResponse?.err) {
        setError("Algunos datos no pudieron cargarse completamente")
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los datos. Verifique que el servidor esté funcionando.")
      setIngresos([])
      setAyudas([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.concepto || !formData.monto || !formData.tipo) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    try {
      const dataToSend = {
        ...formData,
        monto: Number.parseFloat(formData.monto),
        fecha: formData.fecha || new Date().toISOString().split("T")[0],
      }

      if (editingItem) {
        await api.put("Ingresos", { body: dataToSend }, editingItem.id)
      } else {
        await api.post("Ingresos", { body: dataToSend })
      }

      setModalVisible(false)
      setEditingItem(null)
      setFormData({ concepto: "", monto: "", tipo: "", fecha: "" })
      fetchData()
    } catch (err) {
      console.error("Error saving data:", err)
      setError("Error al guardar los datos")
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      concepto: item.concepto || "",
      monto: item.monto?.toString() || "",
      tipo: item.tipo || "",
      fecha: item.fecha || "",
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este registro?")) {
      try {
        await api.del("Ingresos", id)
        fetchData()
      } catch (err) {
        console.error("Error deleting data:", err)
        setError("Error al eliminar el registro")
      }
    }
  }

  // Calculate totals safely
  const totalIngresos = ingresos.reduce((sum, item) => sum + (Number.parseFloat(item.monto) || 0), 0)
  const totalAyudas = ayudas.reduce((sum, item) => sum + (Number.parseFloat(item.monto) || 0), 0)

  // Chart data
  const chartData = {
    labels: ["Ingresos", "Ayudas Otorgadas"],
    datasets: [
      {
        data: [totalIngresos, totalAyudas],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  }

  const barChartData = {
    labels: ingresos.map((item) => item.concepto?.substring(0, 20) + "..." || "Sin concepto"),
    datasets: [
      {
        label: "Montos",
        backgroundColor: "#f87979",
        data: ingresos.map((item) => Number.parseFloat(item.monto) || 0),
      },
    ],
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando datos...</span>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Administración de Rentas - Michelena</h2>
            <CButton
              color="primary"
              onClick={() => {
                setEditingItem(null)
                setFormData({ concepto: "", monto: "", tipo: "", fecha: "" })
                setModalVisible(true)
              }}
            >
              Agregar Ingreso
            </CButton>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError(null)}>
                {error}
              </CAlert>
            )}

            {/* Resumen de estadísticas */}
            <CRow className="mb-4">
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-primary">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">Bs. {totalIngresos.toLocaleString()}</div>
                    <div>Total Ingresos</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-success">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">{ingresos.length}</div>
                    <div>Registros de Ingresos</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-warning">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">Bs. {totalAyudas.toLocaleString()}</div>
                    <div>Total Ayudas</div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm={6} lg={3}>
                <CCard className="text-white bg-info">
                  <CCardBody>
                    <div className="fs-4 fw-semibold">{ayudas.length}</div>
                    <div>Ayudas Registradas</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Gráficos */}
            <CRow className="mb-4">
              <CCol md={6}>
                <CCard>
                  <CCardHeader>Distribución de Fondos</CCardHeader>
                  <CCardBody>
                    <CChartDoughnut data={chartData} />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md={6}>
                <CCard>
                  <CCardHeader>Ingresos por Concepto</CCardHeader>
                  <CCardBody>
                    <CChartBar data={barChartData} />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            {/* Tabla de ingresos */}
            <CCard>
              <CCardHeader>
                <h5>Registro de Ingresos</h5>
              </CCardHeader>
              <CCardBody>
                {ingresos.length > 0 ? (
                  <CTable bordered responsive hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Fecha</CTableHeaderCell>
                        <CTableHeaderCell>Concepto</CTableHeaderCell>
                        <CTableHeaderCell>Tipo</CTableHeaderCell>
                        <CTableHeaderCell>Monto</CTableHeaderCell>
                        <CTableHeaderCell>Acciones</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {ingresos.map((ingreso) => (
                        <CTableRow key={ingreso.id}>
                          <CTableDataCell>{ingreso.fecha || "N/A"}</CTableDataCell>
                          <CTableDataCell>{ingreso.concepto || "Sin concepto"}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color="info">{ingreso.tipo || "Sin tipo"}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            Bs. {(Number.parseFloat(ingreso.monto) || 0).toLocaleString()}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(ingreso)}>
                              Editar
                            </CButton>
                            <CButton color="danger" size="sm" onClick={() => handleDelete(ingreso.id)}>
                              Eliminar
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <div className="text-center py-4">
                    <h5 className="text-muted">No hay ingresos registrados</h5>
                    <p className="text-muted">Agregue el primer registro de ingreso.</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para agregar/editar */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editingItem ? "Editar Ingreso" : "Agregar Ingreso"}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Concepto *</CFormLabel>
              <CFormInput
                type="text"
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                placeholder="Descripción del ingreso"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Monto *</CFormLabel>
              <CFormInput
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo *</CFormLabel>
              <CFormSelect
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Solicitudes de Obra">Solicitudes de Obra</option>
                <option value="Trámites de Propiedades">Trámites de Propiedades</option>
                <option value="Solicitudes Catastrales">Solicitudes Catastrales</option>
                <option value="Multas">Multas</option>
                <option value="Otros">Otros</option>
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Fecha</CFormLabel>
              <CFormInput
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" type="submit">
              {editingItem ? "Actualizar" : "Guardar"}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </CRow>
  )
}

export default AdministracionRentasMichelena
