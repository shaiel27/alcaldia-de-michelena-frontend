import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CRow,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';

const ConstructionRequestForm = () => {
  const [formData, setFormData] = useState({
    cedula: '',
    idVivienda: '',
    idTerreno: '',
    fecha: '',
    descripcion: '',
    observacion: '',
    ubicacion: '',
    tiempoObra: '',
    monto: '',
    fotos: [],
  });

  const [terrenos, setTerrenos] = useState([]);
  const [selectedTerreno, setSelectedTerreno] = useState(null);

  useEffect(() => {
    // Aquí normalmente harías una llamada a tu API para obtener los terrenos del usuario
    // Por ahora, usaremos datos de ejemplo
    const terrenosEjemplo = [
      {
        id: 1,
        medidaNorte: '50 metros',
        medidaSur: '50 metros',
        medidaOeste: '30 metros',
        colindanciaNorte: 'Calle 1',
        colindanciaEste: 'Calle 2',
        colindanciaOeste: 'Propiedad privada',
        lotes: [
          { id: 1, medidaNorte: '25 metros', medidaSur: '25 metros', medidaEste: '15 metros', medidaOeste: '15 metros' },
          { id: 2, medidaNorte: '25 metros', medidaSur: '25 metros', medidaEste: '15 metros', medidaOeste: '15 metros' },
        ]
      },
      {
        id: 2,
        medidaNorte: '60 metros',
        medidaSur: '60 metros',
        medidaOeste: '40 metros',
        colindanciaNorte: 'Avenida Principal',
        colindanciaEste: 'Parque',
        colindanciaOeste: 'Calle 3',
        lotes: [
          { id: 3, medidaNorte: '30 metros', medidaSur: '30 metros', medidaEste: '20 metros', medidaOeste: '20 metros' },
          { id: 4, medidaNorte: '30 metros', medidaSur: '30 metros', medidaEste: '20 metros', medidaOeste: '20 metros' },
        ]
      },
    ];
    setTerrenos(terrenosEjemplo);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTerrenoChange = (e) => {
    const terrenoId = parseInt(e.target.value);
    const terreno = terrenos.find(t => t.id === terrenoId);
    setSelectedTerreno(terreno);
    setFormData(prevState => ({
      ...prevState,
      idTerreno: terrenoId,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      fotos: [...prevState.fotos, ...files],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí enviarías los datos a tu backend
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Solicitud de Obra</strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel htmlFor="idTerreno">Terreno</CFormLabel>
              <CFormSelect
                id="idTerreno"
                name="idTerreno"
                value={formData.idTerreno}
                onChange={handleTerrenoChange}
                required
              >
                <option value="">Seleccione un terreno</option>
                {terrenos.map(terreno => (
                  <option key={terreno.id} value={terreno.id}>
                    Terreno {terreno.id}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="fecha">Fecha</CFormLabel>
              <CFormInput
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>
          {selectedTerreno && (
            <CRow className="mt-3">
              <CCol md={12}>
                <CCard>
                  <CCardHeader>Información del Terreno</CCardHeader>
                  <CCardBody>
                    <p><strong>Medida Norte:</strong> {selectedTerreno.medidaNorte}</p>
                    <p><strong>Medida Sur:</strong> {selectedTerreno.medidaSur}</p>
                    <p><strong>Medida Oeste:</strong> {selectedTerreno.medidaOeste}</p>
                    <p><strong>Colindancia Norte:</strong> {selectedTerreno.colindanciaNorte}</p>
                    <p><strong>Colindancia Este:</strong> {selectedTerreno.colindanciaEste}</p>
                    <p><strong>Colindancia Oeste:</strong> {selectedTerreno.colindanciaOeste}</p>
                    <CCard>
                      <CCardHeader>Lotes del Terreno</CCardHeader>
                      <CCardBody>
                        <CListGroup>
                          {selectedTerreno.lotes.map(lote => (
                            <CListGroupItem key={lote.id}>
                              <h6>Lote {lote.id}</h6>
                              <p><strong>Medida Norte:</strong> {lote.medidaNorte}</p>
                              <p><strong>Medida Sur:</strong> {lote.medidaSur}</p>
                              <p><strong>Medida Este:</strong> {lote.medidaEste}</p>
                              <p><strong>Medida Oeste:</strong> {lote.medidaOeste}</p>
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          )}
          <CRow className="mt-3">
            <CCol md={12}>
              <CFormLabel htmlFor="descripcion">Descripción</CFormLabel>
              <CFormTextarea
                id="descripcion"
                name="descripcion"
                rows={3}
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              ></CFormTextarea>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel htmlFor="observacion">Observación</CFormLabel>
              <CFormInput
                type="text"
                id="observacion"
                name="observacion"
                value={formData.observacion}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="ubicacion">Ubicación</CFormLabel>
              <CFormInput
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormLabel htmlFor="tiempoObra">Tiempo de Obra</CFormLabel>
              <CFormInput
                type="text"
                id="tiempoObra"
                name="tiempoObra"
                value={formData.tiempoObra}
                onChange={handleInputChange}
                required
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={12}>
              <CFormLabel htmlFor="fotos">Fotos del Terreno</CFormLabel>
              <CFormInput 
                type="file"
                id="fotos"
                name="fotos"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CCol md={12}>
              <CButton type="submit" color="primary">
                Enviar Solicitud
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ConstructionRequestForm;

