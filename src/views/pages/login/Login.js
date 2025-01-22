import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import { cilLockLocked, cilEnvelopeClosed } from "@coreui/icons"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:3004/Usuario")
      const users = await response.json()
      const user = users.find((u) => u.Correo === email && u.Password === password)

      if (user) {
        // Eliminar la contraseña antes de almacenar en localStorage
        const { Password, ...userWithoutPassword } = user
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
        localStorage.setItem("isAuthenticated", "true")
        navigate("/dashboard")
      } else {
        setError("Correo electrónico o contraseña inválidos")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center login">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 bg-distortion">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-medium-emphasis">Accede a tu cuenta</p>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-distortion">
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Correo Electrónico"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-distortion"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText className="bg-distortion">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-distortion"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={isLoading}>
                          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0" onClick={() => navigate("/forgot-password")}>
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 bg-distortion" style={{ width: "44%" }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Regístrate</h2>
                    <p>Únete a nuestro sistema de gestión de propiedades y solicitudes de obras.</p>
                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      tabIndex={-1}
                      onClick={() => navigate("/register")}
                    >
                      ¡Regístrate ahora!
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

