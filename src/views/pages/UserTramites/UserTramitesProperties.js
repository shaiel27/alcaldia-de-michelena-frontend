import React, { useState, useEffect } from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CAlert,
  CSpinner,
  CTable,
  CBadge,
} from "@coreui/react"
import { helpFetch } from "../../../api/helpfetch"

const UserTramitesProperties = () => {
  const [formData, setFormData] = useState({
    propertyId: "",
    transactionType: "sell",
    lotsToSell: "",
    totalLots: 0,
    price: "",
    description: "",
  })
  const [technicalReport, setTechnicalReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", color: "success" })
  const [userProperties, setUserProperties] = useState([])
  const [userTramites, setUserTramites] = useState([])
  const api = helpFetch()

  useEffect(() => {
    fetchUserProperties()
    fetchUserTramites()
  }, [])

  const fetchUserProperties = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"))
      if (!user || !user.Cedula) {
        throw new Error("User not found")
      }

      const duenosResponse = await api.get(`Duenos?Cedula=${user.Cedula}&Status=Activo`)
      if (!duenosResponse || duenosResponse.error) {
        throw new Error("Error fetching user properties")
      }

      const propertiesPromises = duenosResponse.map((dueno) =>
        api.get(`Terreno?ID_Terreno=${dueno.ID_Terreno}`)
      )
      const propertiesResponses = await Promise.all(propertiesPromises)
      const properties = propertiesResponses
        .filter((response) => response && !response.error && response.length > 0)
        .map((response) => response[0])

      setUserProperties(properties)
    } catch (error) {
      console.error("Error fetching user properties:", error)
      setAlert({
        show: true,
        message: "Error al cargar las propiedades. Por favor, intente de nuevo.",
        color: "danger",
      })
    }
  }

  const fetchUserTramites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"))
      if (!user || !user.Cedula) {
        throw new Error("User not found")
      }

      const tramitesResponse = await api.get(`Solicitud_de_obra?Cedula=${user.Cedula}`)
      if (!tramitesResponse || tramitesResponse.error) {
        throw new Error("Error fetching user tramites")
      }

      setUserTramites(tramitesResponse)
    } catch (error) {
      console.error("Error fetching user tramites:", error)
      setAlert({
        show: true,
        message: "Error al cargar los trámites. Por favor, intente de nuevo.",
        color: "danger",
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setTechnicalReport(e.target.files[0] || null)
  }

  const handlePropertyChange = (e) => {
    const selectedPropertyId = e.target.value
    if (!selectedPropertyId) {
      setFormData(prev => ({
        ...prev,
        propertyId: "",
        totalLots: 0
      }))
      return
    }

    const selectedProperty = userProperties.find(p => p.ID_Terreno.toString() === selectedPropertyId)
    if (selectedProperty) {
      setFormData(prev => ({
        ...prev,
        propertyId: selectedProperty.ID_Terreno,
        totalLots: selectedProperty.Lote ? selectedProperty.Lote.length : 0
      }))
    }
  }

  const validateForm = () => {
    const { propertyId, lotsToSell, totalLots, price } = formData
    if (!propertyId || !lotsToSell || !price || !technicalReport) {
      setAlert({ show: true, message: "Por favor, complete todos los campos requeridos.", color: "danger" })
      return false
    }
    if (Number(lotsToSell) > Number(totalLots)) {
      setAlert({ show: true, message: "Los lotes a vender no pueden exceder el total de lotes.", color: "danger" })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setAlert({ show: false, message: "", color: "success" })

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]))
      formDataToSend.append("technicalReport", technicalReport)

      const response = await api.post("Solicitud_Venta", { body: formDataToSend })
      if (response.error) {
        throw new Error(response.statusText || "Error al enviar la solicitud")
      }

      setAlert({ show: true, message: "Solicitud enviada exitosamente.", color: "success" })
      resetForm()
      fetchUserTramites()
    } catch (error) {
      console.error("Error submitting transaction:", error)
      setAlert({ show: true, message: "Ocurrió un error. Por favor, intente de nuevo.", color: "danger" })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      propertyId: "",
      transactionType: "sell",
      lotsToSell: "",
      totalLots: 0,
      price: "",
      description: "",
    })
    setTechnicalReport(null)
  }

  return (
    <CRow>
      <CCol xs={12} lg={6}>
        <CCard>
          <CCardHeader>
            <h2>Vender o Transferir Propiedad</h2>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="propertyId">Seleccionar Propiedad</CFormLabel>
                <CFormSelect
                  id="propertyId"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handlePropertyChange}
                >
                  <option value="">-- Seleccionar Propiedad --</option>
                  {userProperties.map((property) => (
                    <option key={property.ID_Terreno} value={property.ID_Terreno}>
                      Terreno {property.ID_Terreno} (Lotes: {property.Lote ? property.Lote.length : 0})
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="transactionType">Tipo de Transacción</CFormLabel>
                <CFormSelect
                  id="transactionType"
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleInputChange}
                >
                  <option value="sell">Vender</option>
                  <option value="transfer">Transferir</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="lotsToSell">Lotes a Vender</CFormLabel>
                <CFormInput
                  type="number"
                  id="lotsToSell"
                  name="lotsToSell"
                  placeholder="Ingrese la cantidad de lotes a vender"
                  value={formData.lotsToSell}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="price">Precio</CFormLabel>
                <CFormInput
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Ingrese el precio"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="description">Descripción</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Agregue una descripción"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="technicalReport">Informe Técnico</CFormLabel>
                <CFormInput
                  type="file"
                  id="technicalReport"
                  name="technicalReport"
                  onChange={handleFileChange}
                />
              </div>
              <CButton type="submit" color="primary" disabled={isLoading}>
                {isLoading ? <CSpinner size="sm" /> : "Enviar"}
              </CButton>
            </CForm>
            {alert.show && (
              <CAlert color={alert.color} className="mt-3">
                {alert.message}
              </CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} lg={6}>
        <CCard>
          <CCardHeader>
            <h2>Mis Trámites</h2>
          </CCardHeader>
          <CCardBody>
            <CTable
              items={userTramites}
              responsive
              bordered
              hover
              striped
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {userTramites.map((tramite) => (
                  <tr key={tramite.ID_Solicitud_de_obra}>
                    <td>{tramite.ID_Solicitud_de_obra}</td>
                    <td>{tramite.Fecha}</td>
                    <td>{tramite.Descripcion}</td>
                    <td>
                      <CBadge color={
                        tramite.Estatus === 'Aprobado' ? 'success' :
                        tramite.Estatus === 'Pendiente' ? 'warning' :
                        tramite.Estatus === 'Rechazado' ? 'danger' : 'primary'
                      }>
                        {tramite.Estatus}
                      </CBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserTramitesProperties