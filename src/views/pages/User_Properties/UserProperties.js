import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CCard, CCardBody, CCardHeader, CCol, CRow, CListGroup, CListGroupItem, CSpinner, CAlert } from "@coreui/react"
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
      // 1. Obtener los registros de Dueños activos para esta cédula
      const duenosResponse = await api.get(`Dueños?Cedula=${cedula}&Status=Activo`)

      if (!duenosResponse || duenosResponse.error || duenosResponse.length === 0) {
        setProperties([])
        setError("No se encontraron propiedades para este usuario.")
        return
      }

      // 2. Obtener los terrenos correspondientes
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h5>Mis Propiedades</h5>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger">{error}</CAlert>}
            {properties.length > 0 ? (
              <CListGroup>
                {properties.map((property) => (
                  <CListGroupItem key={property.id || property.ID_Terreno}>
                    <h6>Terreno {property.ID_Terreno}</h6>
                    <p>
                      <strong>Medidas:</strong>
                      <br />
                      Norte: {property.Medidas_Norte || "N/A"}
                      <br />
                      Sur: {property.Medidas_Sur || "N/A"}
                      <br />
                      Este: {property.Medidas_Este || "N/A"}
                      <br />
                      Oeste: {property.Medidas_Oeste || "N/A"}
                    </p>
                    <p>
                      <strong>Colindancias:</strong>
                      <br />
                      Norte: {property.Colindancias_Norte || "N/A"}
                      <br />
                      Sur: {property.Colindancias_Sur || "N/A"}
                      <br />
                      Este: {property.Colindancias_Este || "N/A"}
                      <br />
                      Oeste: {property.Colindancias_Oeste || "N/A"}
                    </p>
                    {property.Lote && property.Lote.length > 0 && (
                      <>
                        <h6 className="mt-3">Lotes:</h6>
                        <CListGroup>
                          {property.Lote.map((lote) => (
                            <CListGroupItem key={lote.ID_Lote}>
                              <h6>Lote {lote.ID_Lote}</h6>
                              <p>
                                <strong>Medidas del Lote:</strong>
                                <br />
                                Norte: {lote.Medidas_Lote_Norte || "N/A"}
                                <br />
                                Sur: {lote.Medidas_Lote_Sur || "N/A"}
                                <br />
                                Este: {lote.Medidas_Lote_Este || "N/A"}
                                <br />
                                Oeste: {lote.Medidas_Lote_Oeste || "N/A"}
                              </p>
                              {lote.Vivienda && lote.Vivienda.length > 0 && (
                                <>
                                  <h6 className="mt-3">Viviendas:</h6>
                                  <CListGroup>
                                    {lote.Vivienda.map((vivienda) => (
                                      <CListGroupItem key={vivienda.ID_Vivienda}>
                                        <h6>Vivienda {vivienda.ID_Vivienda}</h6>
                                        <p>
                                          <strong>Detalles:</strong>
                                          <br />
                                          Color: {vivienda.Color || "N/A"}
                                          <br />
                                          Tipo de Techo: {vivienda.Tipo_Techo || "N/A"}
                                          <br />
                                          Área de Construcción: {vivienda.Area_Construccion || "N/A"}
                                        </p>
                                      </CListGroupItem>
                                    ))}
                                  </CListGroup>
                                </>
                              )}
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </>
                    )}
                  </CListGroupItem>
                ))}
              </CListGroup>
            ) : (
              <p>No tienes propiedades registradas.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserProperties

