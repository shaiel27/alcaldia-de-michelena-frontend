"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  CSpinner,
  CAlert,
  CButton,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilBuilding, cilLocationPin } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const UserProperties = () => {
  const [properties, setProperties] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const api = helpFetch()

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      const user = JSON.parse(userString)
      setCurrentUser(user)
      if (user.Cedula) {
        fetchUserProperties(user.Cedula)
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchUserProperties = async (cedula) => {
    try {
      setLoading(true)
      setError(null)

      // Obtener terrenos del usuario
      const terrenosResponse = await api.get("Terrenos")

      if (terrenosResponse?.err) {
        throw new Error("Error al obtener propiedades del usuario")
      }

      const safeTerrenos = Array.isArray(terrenosResponse) ? terrenosResponse : []
      const userProperties = safeTerrenos.filter((terreno) => terreno.Propietario === cedula)

      setProperties(userProperties)

      if (userProperties.length === 0) {
        setError("No se encontraron propiedades para este usuario.")
      }
    } catch (err) {
      console.error("Error fetching properties:", err)
      setError("Error al cargar las propiedades. Por favor, intente de nuevo.")
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "ocupado":
        return "success"
      case "disponible":
        return "info"
      case "en proceso":
        return "warning"
      default:
        return "secondary"
    }
  }

  const getUsoBadgeColor = (uso) => {
    switch (uso?.toLowerCase()) {
      case "residencial":
        return "primary"
      case "comercial":
        return "warning"
      case "industrial":
        return "danger"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <CSpinner color="primary" />
        <span className="ms-2">Cargando propiedades...</span>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h2>
                <CIcon icon={cilBuilding} className="me-2" />
                Mis Propiedades
              </h2>
              <CButton color="primary" onClick={() => fetchUserProperties(currentUser?.Cedula)}>
                Actualizar
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="warning" dismissible onClose={() => setError(null)}>
                {error}
              </CAlert>
            )}

            {properties.length > 0 ? (
              <>
                {/* Resumen */}
                <CRow className="mb-4">
                  <CCol sm={6} lg={3}>
                    <CCard className="text-white bg-primary">
                      <CCardBody>
                        <div className="fs-4 fw-semibold">{properties.length}</div>
                        <div>Total Propiedades</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CCard className="text-white bg-success">
                      <CCardBody>
                        <div className="fs-4 fw-semibold">
                          {properties
                            .reduce((sum, p) => sum + Number.parseFloat(p.Area?.replace(/[^\d.]/g, "") || 0), 0)
                            .toFixed(0)}{" "}
                          m²
                        </div>
                        <div>Área Total</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CCard className="text-white bg-info">
                      <CCardBody>
                        <div className="fs-4 fw-semibold">
                          Bs.{" "}
                          {properties
                            .reduce((sum, p) => sum + (Number.parseFloat(p.Valor_Catastral) || 0), 0)
                            .toLocaleString()}
                        </div>
                        <div>Valor Catastral Total</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol sm={6} lg={3}>
                    <CCard className="text-white bg-warning">
                      <CCardBody>
                        <div className="fs-4 fw-semibold">
                          {properties.filter((p) => p.Estado === "Ocupado").length}
                        </div>
                        <div>Propiedades Ocupadas</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>

                {/* Tabla de propiedades */}
                <CTable bordered responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID Terreno</CTableHeaderCell>
                      <CTableHeaderCell>Ubicación</CTableHeaderCell>
                      <CTableHeaderCell>Área</CTableHeaderCell>
                      <CTableHeaderCell>Uso</CTableHeaderCell>
                      <CTableHeaderCell>Estado</CTableHeaderCell>
                      <CTableHeaderCell>Valor Catastral</CTableHeaderCell>
                      <CTableHeaderCell>Zona</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {properties.map((property) => (
                      <CTableRow key={property.ID_Terreno}>
                        <CTableDataCell>
                          <strong>{property.ID_Terreno}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilLocationPin} className="me-1 text-muted" />
                            {property.Ubicacion || "No especificada"}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>{property.Area || "N/A"}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getUsoBadgeColor(property.Uso)}>{property.Uso || "No especificado"}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getEstadoBadgeColor(property.Estado)}>
                            {property.Estado || "No especificado"}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          Bs. {(Number.parseFloat(property.Valor_Catastral) || 0).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>{property.zona_catastral || "N/A"}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {/* Detalles adicionales */}
                <CRow className="mt-4">
                  {properties.map((property) => (
                    <CCol md={6} lg={4} key={property.ID_Terreno} className="mb-3">
                      <CCard>
                        <CCardHeader>
                          <h6 className="mb-0">
                            <CIcon icon={cilBuilding} className="me-2" />
                            Terreno {property.ID_Terreno}
                          </h6>
                        </CCardHeader>
                        <CCardBody>
                          <div className="mb-2">
                            <strong>Coordenadas GPS:</strong> {property.coordenadas_gps || "N/A"}
                          </div>
                          <div className="mb-2">
                            <strong>Manzana:</strong> {property.manzana || "N/A"}
                          </div>
                          <div className="mb-2">
                            <strong>Parcela:</strong> {property.parcela || "N/A"}
                          </div>
                          <div className="mb-2">
                            <strong>Servicios:</strong> {property.servicios_disponibles || "N/A"}
                          </div>
                          <div className="mb-2">
                            <strong>Topografía:</strong> {property.topografia || "N/A"}
                          </div>
                          <div className="mb-2">
                            <strong>Tipo de Suelo:</strong> {property.tipo_suelo || "N/A"}
                          </div>
                          {property.observaciones_especiales && (
                            <div className="mt-3">
                              <strong>Observaciones:</strong>
                              <p className="text-muted small">{property.observaciones_especiales}</p>
                            </div>
                          )}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </>
            ) : (
              <div className="text-center py-5">
                <CIcon icon={cilBuilding} size="3xl" className="text-muted mb-3" />
                <h5 className="text-muted">No hay propiedades registradas</h5>
                <p className="text-muted">No se encontraron propiedades asociadas a su cuenta.</p>
                <CButton color="primary" onClick={() => fetchUserProperties(currentUser?.Cedula)}>
                  Recargar
                </CButton>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserProperties
