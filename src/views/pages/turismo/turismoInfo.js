import React from "react"
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
} from "@coreui/react"

const TurismoInformacion = () => {
  const lugaresTouristicos = [
    {
      id: 1,
      nombre: "Plaza Bolívar de Michelena",
      descripcion: "Plaza principal del municipio, punto de encuentro histórico y cultural.",
      imagen: "/placeholder.svg?height=400&width=800",
    },
    {
      id: 2,
      nombre: "Iglesia San Juan Bautista",
      descripcion: "Templo histórico y centro espiritual de la comunidad michelenera.",
      imagen: "/placeholder.svg?height=400&width=800",
    },
    {
      id: 3,
      nombre: "Parque Nacional El Tamá",
      descripcion: "Área natural protegida con rica biodiversidad y hermosos paisajes.",
      imagen: "/placeholder.svg?height=400&width=800",
    },
  ]

  const informacionMunicipal = {
    historia: `Michelena es un municipio del estado Táchira, Venezuela. Fue fundado en 1849 y nombrado en honor al prócer de la independencia Santos Michelena. Se caracteriza por su rica historia, tradiciones culturales y hermosos paisajes andinos.`,
    ubicacion: `Ubicado en la región andina de Venezuela, en el estado Táchira. Limita con los municipios Lobatera, Ayacucho y otros municipios importantes de la región.`,
    economia: `La economía se basa principalmente en la agricultura, con cultivos de café, cambur, yuca y otros rubros. También destaca la ganadería y el turismo rural.`,
    cultura: `Rica en tradiciones folklóricas, festividades religiosas y manifestaciones culturales. Las Ferias y Fiestas de Michelena son una de sus celebraciones más importantes.`,
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Bienvenidos a Michelena</h2>
          </CCardHeader>
          <CCardBody>
            <CCarousel controls indicators dark>
              {lugaresTouristicos.map((lugar) => (
                <CCarouselItem key={lugar.id}>
                  <CCardImage className="d-block w-100" src={lugar.imagen} alt={lugar.nombre} />
                  <CCarouselCaption className="d-none d-md-block">
                    <h5>{lugar.nombre}</h5>
                    <p>{lugar.descripcion}</p>
                  </CCarouselCaption>
                </CCarouselItem>
              ))}
            </CCarousel>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} lg={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>Información Municipal</h3>
          </CCardHeader>
          <CCardBody>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>Historia</CAccordionHeader>
                <CAccordionBody>{informacionMunicipal.historia}</CAccordionBody>
              </CAccordionItem>
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>Ubicación</CAccordionHeader>
                <CAccordionBody>{informacionMunicipal.ubicacion}</CAccordionBody>
              </CAccordionItem>
              <CAccordionItem itemKey={3}>
                <CAccordionHeader>Economía</CAccordionHeader>
                <CAccordionBody>{informacionMunicipal.economia}</CAccordionBody>
              </CAccordionItem>
              <CAccordionItem itemKey={4}>
                <CAccordionHeader>Cultura y Tradiciones</CAccordionHeader>
                <CAccordionBody>{informacionMunicipal.cultura}</CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12} lg={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>Sitios de Interés</h3>
          </CCardHeader>
          <CCardBody>
            {lugaresTouristicos.map((lugar) => (
              <CCard key={lugar.id} className="mb-3">
                <CCardImage orientation="top" src={lugar.imagen} />
                <CCardBody>
                  <CCardTitle>{lugar.nombre}</CCardTitle>
                  <CCardText>{lugar.descripcion}</CCardText>
                </CCardBody>
              </CCard>
            ))}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default TurismoInformacion

