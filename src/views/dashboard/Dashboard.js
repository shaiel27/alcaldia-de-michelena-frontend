import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';

const DashboardMunicipal = () => {
  // Datos de ejemplo
  const engineeringProjects = [
    { id: 1, name: 'Construcción de Carretera', status: 'En Progreso', budget: 500000 },
    { id: 2, name: 'Reparación de Puente', status: 'Planificado', budget: 250000 },
    { id: 3, name: 'Renovación de Parque', status: 'Completado', budget: 100000 },
    { id: 4, name: 'Ampliación de Acueducto', status: 'En Progreso', budget: 350000 },
    { id: 5, name: 'Construcción de Escuela', status: 'Planificado', budget: 450000 },
  ];

  const monthlyProcedures = [
    { month: 'Enero', count: 150 },
    { month: 'Febrero', count: 180 },
    { month: 'Marzo', count: 200 },
    { month: 'Abril', count: 170 },
    { month: 'Mayo', count: 220 },
    { month: 'Junio', count: 190 },
  ];

  const constructionRequests = [
    { id: 1, type: 'Residencial', status: 'Aprobado', requestDate: '2023-07-01' },
    { id: 2, type: 'Comercial', status: 'Pendiente', requestDate: '2023-07-03' },
    { id: 3, type: 'Industrial', status: 'Rechazado', requestDate: '2023-07-05' },
    { id: 4, type: 'Residencial', status: 'Aprobado', requestDate: '2023-07-07' },
    { id: 5, type: 'Comercial', status: 'Pendiente', requestDate: '2023-07-09' },
  ];

  const cadastralCertificates = [
    { id: 1, type: 'Propiedad', issueDate: '2023-07-01' },
    { id: 2, type: 'Linderos', issueDate: '2023-07-02' },
    { id: 3, type: 'Avalúo', issueDate: '2023-07-03' },
    { id: 4, type: 'Propiedad', issueDate: '2023-07-04' },
    { id: 5, type: 'Linderos', issueDate: '2023-07-05' },
  ];

  const cadastralStats = {
    registeredLands: 1500,
    updatedProperties: 250,
    taxCollection: 750000,
  };

  const financialStatus = {
    income: 2000000,
    expenses: 1800000,
    annualBudget: 5000000,
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('es-VE', { style: 'currency', currency: 'VES' });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <h1 className="mb-4">Dashboard Municipal de Michelena</h1>
      </CCol>
      
      {/* Sección de Proyectos de Ingeniería */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            Proyectos de Ingeniería
            <CButton color="link" className="card-header-action">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CChart
              type="bar"
              data={{
                labels: engineeringProjects.map(project => project.name),
                datasets: [
                  {
                    label: 'Presupuesto',
                    backgroundColor: '#321fdb',
                    data: engineeringProjects.map(project => project.budget),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Presupuesto (Bs)',
                    },
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Trámites Mensuales */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Trámites Mensuales</CCardHeader>
          <CCardBody>
            <CChart
              type="line"
              data={{
                labels: monthlyProcedures.map(item => item.month),
                datasets: [
                  {
                    label: 'Cantidad de Trámites',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: 'rgba(75,192,192,1)',
                    pointBorderColor: '#fff',
                    data: monthlyProcedures.map(item => item.count),
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cantidad',
                    },
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Solicitudes de Construcción */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Solicitudes de Construcción</CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {constructionRequests.map((request, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                    <CTableDataCell>{request.type}</CTableDataCell>
                    <CTableDataCell>{request.status}</CTableDataCell>
                    <CTableDataCell>{request.requestDate}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Constancias Catastrales */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Constancias Catastrales Emitidas</CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Fecha de Emisión</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {cadastralCertificates.map((certificate, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">{certificate.id}</CTableHeaderCell>
                    <CTableDataCell>{certificate.type}</CTableDataCell>
                    <CTableDataCell>{certificate.issueDate}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Estadísticas Catastrales */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Estadísticas Catastrales</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Terrenos Registrados</div>
                <strong>{cadastralStats.registeredLands}</strong>
              </CCol>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Propiedades Actualizadas</div>
                <strong>{cadastralStats.updatedProperties}</strong>
              </CCol>
            </CRow>
            <div className="mt-3">
              <div className="text-medium-emphasis">Recaudación de Impuestos</div>
              <strong>{formatCurrency(cadastralStats.taxCollection)}</strong>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Sección de Estado Financiero */}
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Estado Financiero</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Ingresos</div>
                <strong>{formatCurrency(financialStatus.income)}</strong>
              </CCol>
              <CCol xs={12} md={6} className="mb-sm-2 mb-0">
                <div className="text-medium-emphasis">Gastos</div>
                <strong>{formatCurrency(financialStatus.expenses)}</strong>
              </CCol>
            </CRow>
            <div className="mt-3">
              <div className="text-medium-emphasis">Presupuesto Anual</div>
              <strong>{formatCurrency(financialStatus.annualBudget)}</strong>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DashboardMunicipal;

