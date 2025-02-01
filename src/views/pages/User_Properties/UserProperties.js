import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CSpinner,
  CAlert,
  CButton,
  CBadge,
  CProgress,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilHome, cilLayers, cilBuilding, cilPencil } from "@coreui/icons"
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
      const duenosResponse = await api.get(`Dueños?Cedula=${cedula}&Status=Activo`)

      if (!duenosResponse || duenosResponse.error || duenosResponse.length === 0) {
        setProperties([])
        setError("No se encontraron propiedades para este usuario.")
        return
      }

      const terrenosPromises = duenosResponse.map((dueno) => api.get(`Terreno?ID_Terreno=${dueno.ID_Terreno}`))
      const terrenosResponses = await Promise.all(terrenosPromises)
      const terrenosValidos = terrenosResponses
        .filter((response) => response && !response.error && response.length > 0)
        .map((response) => response[0])

      setProperties(terrenosValidos)
      setError(null)
    } catch (err) {
      console.error("Error fetching properties:", err)
      setError("Error al cargar las propiedades. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const renderMedidasTable = (medidas, title) => (
    <CCard className="mb-3">
      <CCardHeader>
        <h6 className="mb-0">{title}</h6>
      </CCardHeader>
      <CCardBody>
        <CTable small bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Dirección</CTableHeaderCell>
              <CTableHeaderCell>Medida</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>Norte</CTableDataCell>
              <CTableDataCell>{medidas.Norte || "N/A"}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Sur</CTableDataCell>
              <CTableDataCell>{medidas.Sur || "N/A"}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Este</CTableDataCell>
              <CTableDataCell>{medidas.Este || "N/A"}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Oeste</CTableDataCell>
              <CTableDataCell>{medidas.Oeste || "N/A"}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )

  const renderColindanciasTable = (colindancias) => (
    <CCard className="mb-3">
      <CCardHeader>
        <h6 className="mb-0">Colindancias</h6>
      </CCardHeader>
      <CCardBody>
        <CTable small bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Dirección</CTableHeaderCell>
              <CTableHeaderCell>Colindancia</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell>Norte</CTableDataCell>
              <CTableDataCell>{colindancias.Norte || "N/A"}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Sur</CTableDataCell>
              <CTableDataCell>{colindancias.Sur || "N/A"}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Este</CTableDataCell>
              <CTableDataCell>{colindancias.Este || "N/A"}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell>Oeste</CTableDataCell>
              <CTableDataCell>{colindancias.Oeste || "N/A"}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )

  const renderViviendaDetails = (vivienda) => (
    <CCard className="mb-3">
      <CCardHeader>
        <h6 className="mb-0">
          <CIcon icon={cilBuilding} className="me-2" />
          Vivienda {vivienda.ID_Vivienda}
        </h6>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={12} md={6}>
            <CTable small bordered responsive>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableDataCell>{vivienda.Color || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Tipo de Techo</CTableHeaderCell>
                  <CTableDataCell>{vivienda.Tipo_Techo || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Área de Construcción</CTableHeaderCell>
                  <CTableDataCell>{vivienda.Area_Construccion || "N/A"}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
          <CCol xs={12} md={6}>
            <CTable small bordered responsive>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Habitaciones</CTableHeaderCell>
                  <CTableDataCell>{vivienda.Cant_Habitaciones || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Baños</CTableHeaderCell>
                  <CTableDataCell>{vivienda.Cant_Baños || "N/A"}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Pisos</CTableHeaderCell>
                  <CTableDataCell>{vivienda.Descripcion_Piso || "N/A"}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol xs={12}>
            <h6>Estado de la Vivienda</h6>
            <CProgress className="mb-3" height={20}>
              <CProgress value={75} color="success">
                Completado 75%
              </CProgress>
            </CProgress>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CButton color="primary" size="sm">
              <CIcon icon={cilPencil} className="me-2" />
              Editar Detalles
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4 className="mb-0">Mis Propiedades</h4>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {properties.length > 0 ? (
              <CAccordion alwaysOpen activeItemKey={1}>
                {properties.map((property, index) => (
                  <CAccordionItem key={property.id || property.ID_Terreno} itemKey={index + 1}>
                    <CAccordionHeader>
                      <CIcon icon={cilHome} className="me-2" />
                      Terreno {property.ID_Terreno}
                      <CBadge color="info" className="ms-2">
                        {property.Lote ? property.Lote.length : 0} Lotes
                      </CBadge>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <CRow>
                        <CCol xs={12} md={6}>
                          {renderMedidasTable(
                            {
                              Norte: property.Medidas_Norte,
                              Sur: property.Medidas_Sur,
                              Este: property.Medidas_Este,
                              Oeste: property.Medidas_Oeste,
                            },
                            "Medidas del Terreno",
                          )}
                        </CCol>
                        <CCol xs={12} md={6}>
                          {renderColindanciasTable({
                            Norte: property.Colindancias_Norte,
                            Sur: property.Colindancias_Sur,
                            Este: property.Colindancias_Este,
                            Oeste: property.Colindancias_Oeste,
                          })}
                        </CCol>
                      </CRow>
                      {property.Lote && property.Lote.length > 0 && (
                        <CAccordion className="mt-4" flush alwaysOpen>
                          {property.Lote.map((lote) => (
                            <CAccordionItem key={lote.ID_Lote}>
                              <CAccordionHeader>
                                <CIcon icon={cilLayers} className="me-2" />
                                Lote {lote.ID_Lote}
                                <CBadge color="success" className="ms-2">
                                  {lote.Vivienda ? lote.Vivienda.length : 0} Viviendas
                                </CBadge>
                              </CAccordionHeader>
                              <CAccordionBody>
                                <CRow>
                                  <CCol xs={12} md={6}>
                                    {renderMedidasTable(
                                      {
                                        Norte: lote.Medidas_Lote_Norte,
                                        Sur: lote.Medidas_Lote_Sur,
                                        Este: lote.Medidas_Lote_Este,
                                        Oeste: lote.Medidas_Lote_Oeste,
                                      },
                                      "Medidas del Lote",
                                    )}
                                  </CCol>
                                  <CCol xs={12} md={6}>
                                    <CCard className="mb-3">
                                      <CCardHeader>
                                        <h6 className="mb-0">Información Adicional</h6>
                                      </CCardHeader>
                                      <CCardBody>
                                        <CTable small bordered responsive>
                                          <CTableBody>
                                            <CTableRow>
                                              <CTableHeaderCell>Fecha de Registro</CTableHeaderCell>
                                              <CTableDataCell>{lote.Fecha_Registro || "N/A"}</CTableDataCell>
                                            </CTableRow>
                                            <CTableRow>
                                              <CTableHeaderCell>Número de Registro</CTableHeaderCell>
                                              <CTableDataCell>{lote.Nmro_Registro || "N/A"}</CTableDataCell>
                                            </CTableRow>
                                          </CTableBody>
                                        </CTable>
                                      </CCardBody>
                                    </CCard>
                                  </CCol>
                                </CRow>
                                {lote.Vivienda && lote.Vivienda.length > 0 && (
                                  <div className="mt-3">
                                    <h6>Viviendas en este Lote</h6>
                                    {lote.Vivienda.map((vivienda) => renderViviendaDetails(vivienda))}
                                  </div>
                                )}
                              </CAccordionBody>
                            </CAccordionItem>
                          ))}
                        </CAccordion>
                      )}
                    </CAccordionBody>
                  </CAccordionItem>
                ))}
              </CAccordion>
            ) : (
              <CAlert color="warning">
                No tienes propiedades registradas.
                <CButton color="primary" className="ms-3">
                  <CIcon icon={cilPencil} className="me-2" />
                  Registrar Propiedad
                </CButton>
              </CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserProperties

