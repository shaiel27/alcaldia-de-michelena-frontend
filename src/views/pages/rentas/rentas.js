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
import { CChartBar, CChartDoughnut } from "@coreui/react-chartjs"

const AdministracionRentasMichelena = () => {
  const [ingresos, setIngresos] = useState([
    { id: 1, fecha: "2025-01-15", concepto: "Permiso de construcción", monto: 5000, tipo: "Solicitudes de Obra" },
    { id: 2, fecha: "2025-01-20", concepto: "Registro de propiedad", monto: 2500, tipo: "Trámites de Propiedades" },
    { id: 3, fecha: "2025-01-25", concepto: "Actualización catastral", monto: 1000, tipo: "Solicitudes Catastrales" },
    { id: 4, fecha: "2025-01-28", concepto: "Permiso de remodelación", monto: 3000, tipo: "Solicitudes de Obra" },
    { id: 5, fecha: "2025-02-01", concepto: "Certificado catastral", monto: 800, tipo: "Solicitudes Catastrales" },
  ])

  const [ayudas, setAyudas] = useState([
    { id: 1, fecha: "2025-01-18", beneficiario: "María González", monto: 1500, concepto: "Ayuda médica" },
    { id: 2, fecha: "2025-01-22", beneficiario: "Juan Pérez", monto: 2000, concepto: "Mejora de vivienda" },
    { id: 3, fecha: "2025-01-27", beneficiario: "Ana Rodríguez", monto: 1000, concepto: "Beca estudiantil" },
  ])

  const [showIngresoModal, setShowIngresoModal] = useState(false)
  const [showAyudaModal, setShowAyudaModal] = useState(false)
  const [nuevoIngreso, setNuevoIngreso] = useState({ fecha: "", concepto: "", monto: "", tipo: "Solicitudes de Obra" })
  const [nuevaAyuda, setNuevaAyuda] = useState({ fecha: "", beneficiario: "", monto: "", concepto: "" })

  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0)
  const totalAyudas = ayudas.reduce((sum, ayuda) => sum + ayuda.monto, 0)
  const balance = totalIngresos - totalAyudas

  const handleNuevoIngreso = () => {
    setIngresos([...ingresos, { ...nuevoIngreso, id: ingresos.length + 1, monto: Number(nuevoIngreso.monto) }])
    setShowIngresoModal(false)
    setNuevoIngreso({ fecha: "", concepto: "", monto: "", tipo: "Solicitudes de Obra" })
  }

  const handleNuevaAyuda = () => {
    setAyudas([...ayudas, { ...nuevaAyuda, id: ayudas.length + 1, monto: Number(nuevaAyuda.monto) }])
    setShowAyudaModal(false)
    setNuevaAyuda({ fecha: "", beneficiario: "", monto: "", concepto: "" })
  }

  const ingresosPorTipo = {
    labels: ["Solicitudes de Obra", "Trámites de Propiedades", "Solicitudes Catastrales", "Otros"],
    datasets: [
      {
        data: [
          ingresos.filter((i) => i.tipo === "Solicitudes de Obra").reduce((sum, i) => sum + i.monto, 0),
          ingresos.filter((i) => i.tipo === "Trámites de Propiedades").reduce((sum, i) => sum + i.monto, 0),
          ingresos.filter((i) => i.tipo === "Solicitudes Catastrales").reduce((sum, i) => sum + i.monto, 0),
          ingresos
            .filter(
              (i) => !["Solicitudes de Obra", "Trámites de Propiedades", "Solicitudes Catastrales"].includes(i.tipo),
            )
            .reduce((sum, i) => sum + i.monto, 0),
        ],
        backgroundColor: ["#321fdb", "#2eb85c", "#f9b115", "#3399ff"],
      },
    ],
  }

  const balanceData = {
    labels: ["Ingresos", "Ayudas"],
    datasets: [
      {
        label: "Monto en Bs.",
        backgroundColor: ["#321fdb", "#e55353"],
        data: [totalIngresos, totalAyudas],
      },
    ],
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Administración de Rentas - Alcaldía de Michelena</h2>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={4}>
                <h4>Resumen Financiero</h4>
                <p>
                  <strong>Total Ingresos:</strong> Bs. {totalIngresos.toLocaleString()}
                </p>
                <p>
                  <strong>Total Ayudas:</strong> Bs. {totalAyudas.toLocaleString()}
                </p>
                <p>
                  <strong>Balance:</strong>{" "}
                  <CBadge color={balance >= 0 ? "success" : "danger"}>Bs. {balance.toLocaleString()}</CBadge>
                </p>
              </CCol>
              <CCol md={4}>
                <h4>Ingresos por Tipo</h4>
                <CChartDoughnut
                  data={ingresosPorTipo}
                  options={{
                    aspectRatio: 1,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </CCol>
              <CCol md={4}>
                <h4>Balance de Ingresos y Ayudas</h4>
                <CChartBar
                  data={balanceData}
                  options={{
                    aspectRatio: 1,
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
              <CCol md={6}>
                <h4>Registro de Ingresos</h4>
                <CButton color="primary" onClick={() => setShowIngresoModal(true)} className="mb-3">
                  Registrar Nuevo Ingreso
                </CButton>
                <CTable bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Concepto</CTableHeaderCell>
                      <CTableHeaderCell>Monto (Bs.)</CTableHeaderCell>
                      <CTableHeaderCell>Tipo</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {ingresos.map((ingreso) => (
                      <CTableRow key={ingreso.id}>
                        <CTableDataCell>{ingreso.fecha}</CTableDataCell>
                        <CTableDataCell>{ingreso.concepto}</CTableDataCell>
                        <CTableDataCell>{ingreso.monto.toLocaleString()}</CTableDataCell>
                        <CTableDataCell>{ingreso.tipo}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
              <CCol md={6}>
                <h4>Registro de Ayudas</h4>
                <CButton color="success" onClick={() => setShowAyudaModal(true)} className="mb-3">
                  Registrar Nueva Ayuda
                </CButton>
                <CTable bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Fecha</CTableHeaderCell>
                      <CTableHeaderCell>Beneficiario</CTableHeaderCell>
                      <CTableHeaderCell>Monto (Bs.)</CTableHeaderCell>
                      <CTableHeaderCell>Concepto</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {ayudas.map((ayuda) => (
                      <CTableRow key={ayuda.id}>
                        <CTableDataCell>{ayuda.fecha}</CTableDataCell>
                        <CTableDataCell>{ayuda.beneficiario}</CTableDataCell>
                        <CTableDataCell>{ayuda.monto.toLocaleString()}</CTableDataCell>
                        <CTableDataCell>{ayuda.concepto}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para nuevo ingreso */}
      <CModal visible={showIngresoModal} onClose={() => setShowIngresoModal(false)}>
        <CModalHeader>
          <CModalTitle>Registrar Nuevo Ingreso</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Fecha</CFormLabel>
              <CFormInput
                type="date"
                value={nuevoIngreso.fecha}
                onChange={(e) => setNuevoIngreso({ ...nuevoIngreso, fecha: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Concepto</CFormLabel>
              <CFormInput
                type="text"
                value={nuevoIngreso.concepto}
                onChange={(e) => setNuevoIngreso({ ...nuevoIngreso, concepto: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Monto (Bs.)</CFormLabel>
              <CFormInput
                type="number"
                value={nuevoIngreso.monto}
                onChange={(e) => setNuevoIngreso({ ...nuevoIngreso, monto: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Tipo</CFormLabel>
              <CFormSelect
                value={nuevoIngreso.tipo}
                onChange={(e) => setNuevoIngreso({ ...nuevoIngreso, tipo: e.target.value })}
              >
                <option value="Solicitudes de Obra">Solicitudes de Obra</option>
                <option value="Trámites de Propiedades">Trámites de Propiedades</option>
                <option value="Solicitudes Catastrales">Solicitudes Catastrales</option>
                <option value="Otros">Otros</option>
              </CFormSelect>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowIngresoModal(false)}>
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleNuevoIngreso}>
            Guardar Ingreso
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal para nueva ayuda */}
      <CModal visible={showAyudaModal} onClose={() => setShowAyudaModal(false)}>
        <CModalHeader>
          <CModalTitle>Registrar Nueva Ayuda</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>Fecha</CFormLabel>
              <CFormInput
                type="date"
                value={nuevaAyuda.fecha}
                onChange={(e) => setNuevaAyuda({ ...nuevaAyuda, fecha: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Beneficiario</CFormLabel>
              <CFormInput
                type="text"
                value={nuevaAyuda.beneficiario}
                onChange={(e) => setNuevaAyuda({ ...nuevaAyuda, beneficiario: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Monto (Bs.)</CFormLabel>
              <CFormInput
                type="number"
                value={nuevaAyuda.monto}
                onChange={(e) => setNuevaAyuda({ ...nuevaAyuda, monto: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Concepto</CFormLabel>
              <CFormInput
                type="text"
                value={nuevaAyuda.concepto}
                onChange={(e) => setNuevaAyuda({ ...nuevaAyuda, concepto: e.target.value })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAyudaModal(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={handleNuevaAyuda}>
            Guardar Ayuda
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AdministracionRentasMichelena

