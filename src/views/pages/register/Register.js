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
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { get, post } = helpFetch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const response = await get("Usuario")
      if (response.error) throw new Error(response.statusText)
      const users = response

      const cedulaExists = users.some((user) => user.Cedula === formData.cedula)
      if (cedulaExists) {
        setError("Ya existe un usuario con esta cédula")
        setIsLoading(false)
        return
      }

      const emailExists = users.some((user) => user.Correo === formData.correo)
      if (emailExists) {
        setError("Ya existe un usuario con este correo electrónico")
        setIsLoading(false)
        return
      }

      const newUser = {
        Cedula: formData.cedula,
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        Direccion: formData.direccion,
        Correo: formData.correo,
        Password: formData.password,
      }

      const registerResponse = await post("Usuario", { body: newUser })
      if (registerResponse.error) throw new Error(registerResponse.statusText)

      console.log("Usuario registrado exitosamente")
      navigate("/login")
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
            <CCard className="mx-4 bg-distortion">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1 className="mb-4 text-center">Registro</h1>
                  <p className="text-medium-emphasis text-center mb-4">Crea tu cuenta</p>
                  {error && <CAlert color="danger">{error}</CAlert>}
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Cédula"
                          name="cedula"
                          value={formData.cedula}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Apellido"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Correo Electrónico"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={12}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilLocationPin} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Dirección"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Contraseña"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-4">
                        <CInputGroupText className="bg-distortion">
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Repetir contraseña"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="bg-distortion"
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={12}>
                      <div className="d-grid">
                        <CButton color="success" type="submit" disabled={isLoading}>
                          {isLoading ? "Registrando..." : "Crear Cuenta"}
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

