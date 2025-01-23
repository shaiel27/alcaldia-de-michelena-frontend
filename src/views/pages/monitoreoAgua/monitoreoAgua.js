import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CBadge,
  CProgress,
  CListGroup,
  CListGroupItem,
  CChart,
} from '@coreui/react'

const MonitoreoCalidadAgua = () => {
  const calidadData = {
    ph: 7.2,
    turbidez: 85,
    cloro: 90,
    bacterias: 95,
    minerales: 88,
  }

  const medicionesDiarias = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    datasets: [
      {
        label: "pH",
        backgroundColor: "rgba(50, 31, 219, 0.5)",
        borderColor: "#321fdb",
        pointBackgroundColor: "#321fdb",
        pointBorderColor: "#fff",
        data: [7.1, 7.2, 7.0, 7.3, 7.2, 7.1, 7.2],
        fill: true,
      },
      {
        label: "Cloro Residual",
        backgroundColor: "rgba(46, 184, 92, 0.5)",
        borderColor: "#2eb85c",
        pointBackgroundColor: "#2eb85c",
        pointBorderColor: "#fff",
        data: [0.8, 0.9, 0.85, 0.95, 0.9, 0.88, 0.92],
        fill: true,
      },
    ],
  }

  const distribucionCalidad = {
    labels: ["Excelente", "Buena", "Regular", "Necesita Atención"],
    datasets: [
      {
        data: [60, 25, 10, 5],
        backgroundColor: ["#2eb85c", "#39f", "#f9b115", "#e55353"],
        hoverBackgroundColor: ["#2eb85c", "#39f", "#f9b115", "#e55353"],
      },
    ],
  }

  const getStatusColor = (value) => {
    if (value >= 90) return "success"
    if (value >= 70) return "info"
    if (value >= 50) return "warning"
    return "danger"
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Monitoreo de Calidad del Agua</h2>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <h4>Indicadores de Calidad</h4>
                <CListGroup className="mb-4">
                  {[
                    { label: "pH del Agua (7.2)", value: calidadData.ph },
                    { label: "Turbidez", value: calidadData.turbidez },
                    { label: "Nivel de Cloro", value: calidadData.cloro },
                    { label: "Control Bacteriológico", value: calidadData.bacterias },
                    { label: "Minerales Esenciales", value: calidadData.minerales }
                  ].map(({ label, value }, index) => (
                    <CListGroupItem key={index}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>{label}</span>
                        <CBadge color={getStatusColor(value)}>{value}%</CBadge>
                      </div>
                      <CProgress 
                        value={value} 
                        color={getStatusColor(value)} 
                        height={10} 
                      />
                    </CListGroupItem>
                  ))}
                </CListGroup>
              </CCol>
              <CCol md={6}>
                <h4>Distribución de Calidad por Zonas</h4>
                <div style={{ height: "300px" }}>
                  <CChart
                    type="pie"
                    data={distribucionCalidad}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol xs={12}>
                <h4>Mediciones Diarias</h4>
                <div style={{ height: "300px" }}>
                  <CChart
                    type="line"
                    data={medicionesDiarias}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                        },
                      },
                    }}
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol xs={12}>
                <h4>Últimas Mediciones</h4>
                <CTable bordered responsive>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>pH</th>
                      <th>Turbidez</th>
                      <th>Cloro Residual</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { fecha: "23/01/2025", ph: "7.2", turbidez: "0.5 NTU", cloro: "0.9 mg/L", estado: "success" },
                      { fecha: "22/01/2025", ph: "7.1", turbidez: "0.6 NTU", cloro: "0.85 mg/L", estado: "success" },
                      { fecha: "21/01/2025", ph: "7.3", turbidez: "0.8 NTU", cloro: "0.8 mg/L", estado: "info" }
                    ].map((medicion, index) => (
                      <tr key={index}>
                        <td>{medicion.fecha}</td>
                        <td>{medicion.ph}</td>
                        <td>{medicion.turbidez}</td>
                        <td>{medicion.cloro}</td>
                        <td>
                          <CBadge color={medicion.estado}>
                            {medicion.estado === "success" ? "Óptimo" : "Bueno"}
                          </CBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </CTable>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MonitoreoCalidadAgua