import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CBadge,
  CChart
} from '@coreui/react'

const HistorialTramitesIngenieria = () => {
  const tramitesData = {
    solicitudesObra: 45,
    permisosAprobados: 30,
    permisosRechazados: 10,
    permisosPendientes: 5,
    inspeccionesRealizadas: 28,
  }

  const tramitesPorMes = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Solicitudes",
        backgroundColor: "#321fdb",
        data: [40, 35, 45, 50, 45, 60],
      },
      {
        label: "Aprobados",
        backgroundColor: "#2eb85c",
        data: [30, 25, 35, 40, 35, 45],
      },
    ],
  }

  const tiposTramites = {
    labels: ["Construcción", "Remodelación", "Demolición", "Ampliación", "Otros"],
    datasets: [
      {
        data: [45, 25, 10, 15, 5],
        backgroundColor: ["#321fdb", "#2eb85c", "#e55353", "#f9b115", "#3399ff"],
        hoverBackgroundColor: ["#321fdb", "#2eb85c", "#e55353", "#f9b115", "#3399ff"],
      },
    ],
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Historial de Trámites - Departamento de Ingeniería</h2>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={6}>
                <h4>Resumen de Trámites</h4>
                <CTable bordered responsive>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Solicitudes</td>
                      <td>{tramitesData.solicitudesObra}</td>
                      <td>
                        <CBadge color="primary">Total</CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>Permisos Aprobados</td>
                      <td>{tramitesData.permisosAprobados}</td>
                      <td>
                        <CBadge color="success">Aprobado</CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>Permisos Rechazados</td>
                      <td>{tramitesData.permisosRechazados}</td>
                      <td>
                        <CBadge color="danger">Rechazado</CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>Permisos Pendientes</td>
                      <td>{tramitesData.permisosPendientes}</td>
                      <td>
                        <CBadge color="warning">Pendiente</CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>Inspecciones Realizadas</td>
                      <td>{tramitesData.inspeccionesRealizadas}</td>
                      <td>
                        <CBadge color="info">Completado</CBadge>
                      </td>
                    </tr>
                  </tbody>
                </CTable>
              </CCol>
              <CCol md={6}>
                <h4>Distribución de Tipos de Trámites</h4>
                <div style={{ height: '300px' }}>
                  <CChart
                    type="doughnut"
                    data={tiposTramites}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }}
                  />
                </div>
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CCol xs={12}>
                <h4>Evolución de Trámites por Mes</h4>
                <div style={{ height: '300px' }}>
                  <CChart
                    type="bar"
                    data={tramitesPorMes}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HistorialTramitesIngenieria