"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  CSpinner,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import { cilLockLocked, cilUser } from "@coreui/icons"
import { helpFetch } from "../../../api/helpfetch"

const Login = () => {
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const api = helpFetch()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!cedula || !password) {
      setError("Por favor ingrese cédula y contraseña")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const users = await api.get("Usuarios")

      if (users?.err) {
        throw new Error("Error al conectar con el servidor")
      }

      const user = users.find((u) => u.Cedula === cedula && u.Contraseña === password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))

        if (user.Rol === "Administrador") {
          navigate("/admin-dashboard")
        } else {
          navigate("/dashboard")
        }
      } else {
        setError("Cédula o contraseña incorrectos")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Error al iniciar sesión. Verifique la conexión.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-medium-emphasis">Ingrese a su cuenta</p>

                    {error && <CAlert color="danger">{error}</CAlert>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Cédula"
                        autoComplete="username"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        disabled={isLoading}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Ingresando...
                            </>
                          ) : (
                            "Ingresar"
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          ¿Olvidó su contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: "44%" }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Registrarse</h2>
                    <p>¿No tiene una cuenta? Regístrese para acceder a los servicios municipales.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        ¡Registrarse Ahora!
                      </CButton>
                    </Link>
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
