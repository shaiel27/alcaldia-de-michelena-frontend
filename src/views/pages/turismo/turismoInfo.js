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
import plaza from "../../../img/plza.jpg"
import cancha from "../../../img/cancha.jpg"
import castillo from "../../../img/castillo.jpg"

const TurismoInformacion = () => {
  const lugaresTouristicos = [
    {
      id: 1,
      nombre: "Plaza Bolívar de Michelena",
      descripcion: "Plaza principal del municipio, punto de encuentro histórico y cultural.",
      imagen: plaza 
    },
    {
      id: 2,
      nombre: "Estadio Municipal de Santa Rita",
      descripcion: "Centro Deportivo del pueblo.",
      imagen: cancha,
    },
    {
      id: 3,
      nombre: "Castillo Pellizzari",
      descripcion: "impresionante estructura que se erige en los rincones del páramo de Boca de Monte.",
      imagen: castillo
    },
  ]

  const informacionMunicipal = {
    historia: `Michelena fue fundada el 14 de enero de 1849 por el Pbro. Gabriel Gómez. El municipio fue nombrado en honor al prócer de la independencia Santos Michelena. En 1872 fue elevada a la categoría de Parroquia Civil y Eclesiástica del Distrito Lobatera. La historia de Michelena está estrechamente ligada al desarrollo agrícola y comercial de la región andina venezolana.`,
    ubicacion: `Michelena está ubicada en la región andina de Venezuela, en el estado Táchira. Limita al norte con el municipio Lobatera, al sur con el municipio Ayacucho, al este con el municipio Andrés Bello y al oeste con el municipio Libertad. Su capital es la ciudad de Michelena, situada a una altitud aproximada de 1.100 metros sobre el nivel del mar.`,
    economia: `La economía de Michelena se basa principalmente en la agricultura. Los cultivos más importantes incluyen café, caña de azúcar, cambur (plátano), y hortalizas. La ganadería, aunque en menor escala, también juega un papel en la economía local. En los últimos años, se ha fomentado el desarrollo del turismo rural como una fuente adicional de ingresos para el municipio.`,
    cultura: `Michelena es rica en tradiciones y manifestaciones culturales. Las Ferias y Fiestas de Michelena, celebradas en enero, son uno de los eventos más importantes del municipio. Estas fiestas incluyen actividades religiosas, culturales y deportivas. La devoción a la Virgen del Carmen es central en la vida religiosa de la comunidad. Además, Michelena es conocida por su artesanía local, especialmente los trabajos en madera y tejidos.`,
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>Bienvenidos a Michelena</h2>
          </CCardHeader>
          <CCardBody>
            <CCarousel controls indicators>
              {lugaresTouristicos.map((lugar) => (
                <CCarouselItem key={lugar.id}>
                  <CCardImage className="d-block w-100" src={lugar.imagen} alt={lugar.nombre} style={{ width: '10px', height: '800px' }} />
                  <CCarouselCaption className="d-none d-md-block">
                    <h1 className="text-white">  {lugar.nombre}</h1>
                    <h5 className="text-white">{lugar.descripcion}</h5>
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

