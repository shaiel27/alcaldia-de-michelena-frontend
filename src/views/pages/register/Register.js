"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilUser, cilLockLocked, cilEnvelopeClosed, cilLocationPin } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const Register = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    direccion: "",
    correo: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const api = helpFetch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (
      !formData.cedula ||
      !formData.nombre ||
      !formData.apellido ||
      !formData.direccion ||
      !formData.correo ||
      !formData.password
    ) {
      setError("Todos los campos son obligatorios")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correo)) {
      setError("Por favor ingrese un correo electrónico válido")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Verificar si ya existe un usuario con la misma cédula o correo
      const existingUsers = await api.get("Usuarios")

      if (existingUsers.err) {
        throw new Error("Error al verificar usuarios existentes")
      }

      const users = existingUsers || []

      const cedulaExists = users.some((user) => user.Cedula === formData.cedula)
      if (cedulaExists) {
        setError("Ya existe un usuario con esta cédula")
        return
      }

      const emailExists = users.some((user) => user.Correo === formData.correo)
      if (emailExists) {
        setError("Ya existe un usuario con este correo electrónico")
        return
      }

      // Crear nuevo usuario
      const newUser = {
        Cedula: formData.cedula,
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        Direccion: formData.direccion,
        Correo: formData.correo,
        Contraseña: formData.password,
        Fecha_Registro: new Date().toISOString().split("T")[0],
        Estado: "Activo",
        Rol: "Usuario",
      }

      const registerResponse = await api.post("Usuarios", { body: newUser })

      if (registerResponse.err) {
        throw new Error(registerResponse.err)
      }

      setSuccess("Usuario registrado exitosamente. Redirigiendo al login...")

      // Limpiar formulario
      setFormData({
        cedula: "",
        nombre: "",
        apellido: "",
        direccion: "",
        correo: "",
        password: "",
        confirmPassword: "",
      })

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setError("Ocurrió un error durante el registro. Por favor, intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} lg={10} xl={8}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1 className="mb-4 text-center">Registro</h1>
                  <p className="text-medium-emphasis text-center mb-4">Crea tu cuenta</p>

                  {error && <CAlert color="danger">{error}</CAlert>}
                  {success && <CAlert color="success">{success}</CAlert>}

                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Cédula"
                          name="cedula"
                          value={formData.cedula}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Apellido"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Correo Electrónico"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={12}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLocationPin} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Dirección"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Contraseña"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Repetir contraseña"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12}>
                      <div className="d-grid">
                        <CButton color="success" type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Registrando...
                            </>
                          ) : (
                            "Crear Cuenta"
                          )}
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
