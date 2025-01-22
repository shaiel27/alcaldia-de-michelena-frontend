import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
  CTextarea,
  CButton,
  CAlert,
  CSpinner,
} from "@coreui/react";

const SellOrTransferProperty = ({ userProperties }) => {
  const [formData, setFormData] = useState({
    propertyId: "",
    transactionType: "sell",
    lotsToSell: "",
    totalLots: 0,
    price: "",
    description: "",
  });
  const [technicalReport, setTechnicalReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", color: "success" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setTechnicalReport(e.target.files[0] || null);
  };

  const handlePropertyChange = (e) => {
    const selectedProperty = userProperties.find((p) => p.id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      propertyId: selectedProperty.id,
      totalLots: selectedProperty.totalLots,
    }));
  };

  const validateForm = () => {
    const { propertyId, lotsToSell, totalLots, price } = formData;
    if (!propertyId || !lotsToSell || !price || !technicalReport) {
      setAlert({ show: true, message: "Please fill in all required fields.", color: "danger" });
      return false;
    }
    if (Number(lotsToSell) > Number(totalLots)) {
      setAlert({ show: true, message: "Lots to sell cannot exceed total lots.", color: "danger" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setAlert({ show: false, message: "", color: "success" });

    try {
      // Simulating API submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAlert({ show: true, message: "Transaction successfully submitted.", color: "success" });
      resetForm();
    } catch {
      setAlert({ show: true, message: "An error occurred. Please try again.", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: "",
      transactionType: "sell",
      lotsToSell: "",
      totalLots: 0,
      price: "",
      description: "",
    });
    setTechnicalReport(null);
  };

  return (
    <CRow>
      <CCol xs="12" lg="8">
        <CCard>
          <CCardHeader>
            <h2>Sell or Transfer Property</h2>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CFormGroup>
                <CLabel htmlFor="propertyId">Select Property</CLabel>
                <CSelect
                  id="propertyId"
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handlePropertyChange}
                >
                  <option value="">-- Select Property --</option>
                  {userProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} (Total Lots: {property.totalLots})
                    </option>
                  ))}
                </CSelect>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="transactionType">Transaction Type</CLabel>
                <CSelect
                  id="transactionType"
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleInputChange}
                >
                  <option value="sell">Sell</option>
                  <option value="transfer">Transfer</option>
                </CSelect>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="lotsToSell">Lots to Sell</CLabel>
                <CInput
                  type="number"
                  id="lotsToSell"
                  name="lotsToSell"
                  placeholder="Enter lots to sell"
                  value={formData.lotsToSell}
                  onChange={handleInputChange}
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="price">Price</CLabel>
                <CInput
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="description">Description</CLabel>
                <CTextarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Add description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="technicalReport">Technical Report</CLabel>
                <CInput
                  type="file"
                  id="technicalReport"
                  name="technicalReport"
                  onChange={handleFileChange}
                />
              </CFormGroup>
              <CButton type="submit" color="primary" disabled={isLoading}>
                {isLoading ? <CSpinner size="sm" /> : "Submit"}
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
    </CRow>
  );
};

export default SellOrTransferProperty;
