import React, { useState } from 'react';
import api from '../services/axiosConfig';
import '../styles/ViewPricing.css'; // Import CSS for styling

const ViewPricing = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schoolName, setSchoolName] = useState('');
  const [expandedCard, setExpandedCard] = useState(null); // State to manage expanded card

  const fetchPricingData = async () => {
    setLoading(true);
    setError(null);
    console.log(schoolName);
    try {
      const response = await api.get(`/call/pricing_data/${schoolName}`);
      setPricingData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSchoolName(e.target.value);
  };

  const handleSearch = () => {
    if (schoolName.trim() !== '') {
      fetchPricingData();
    } else {
      setError({ message: 'Please enter a school name.' });
    }
  };

  const handleClear = () => {
    setSchoolName('');
    setPricingData([]);
    setError(null);
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="view-pricing">
      <h1>Precificações</h1>
      <div className="search-bar">
        <input
          type="text"
          value={schoolName}
          onChange={handleInputChange}
          placeholder="Nome da Escola..."
        />
        <button onClick={handleSearch}>Procurar</button>
        <button onClick={handleClear} className="clear-btn">
          Limpar
        </button>
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error.message}</p>}
      {!loading && !error && pricingData.length > 0 && (
        <div className="card-container">
          {pricingData.map((item) => (
            <div
              className={`card ${expandedCard === item.id_pricing ? 'expanded' : ''}`}
              key={item.id_pricing}
            >
              <div
                className="card-header"
                onClick={() => toggleExpand(item.id_pricing)}
              >
                <h2>{item.school_name}</h2>
                <p>
                  <strong>ID:</strong> {item.id_school}
                </p>
                <p>
                  <strong>CNPJ:</strong> {item.cnpj}
                </p>
                <p>
                  <strong>INEP:</strong> {item.inep}
                </p>
                <p>
                  <strong>UF:</strong> {item.uf}
                </p>
              </div>
              <div className="card-body">
                <p>
                  <strong>ID Pricing:</strong> {item.id_pricing}
                </p>
                <p>
                  <strong>ID Unit:</strong> {item.id_unit}
                </p>
                <p>
                  <strong>Demand Date:</strong> {item.demand_date}
                </p>
                <p>
                  <strong>Pricing Date:</strong> {item.pricing_date}
                </p>
                <p>
                  <strong>Financial Data Type:</strong>{' '}
                  {item.financial_data_type}
                </p>
                <p>
                  <strong>Students Quantity:</strong> {item.students_qtt}
                </p>
                <p>
                  <strong>Average Ticket:</strong> {item.avg_ticket}
                </p>
                <p>
                  <strong>TIR0:</strong> {item.tir0}
                </p>
                <p>
                  <strong>TIR1:</strong> {item.tir1}
                </p>
                <p>
                  <strong>TIR2:</strong> {item.tir2}
                </p>
                <p>
                  <strong>TIR3:</strong> {item.tir3}
                </p>
                <p>
                  <strong>TIR4:</strong> {item.tir4}
                </p>
                <p>
                  <strong>TIR5:</strong> {item.tir5}
                </p>
                <p>
                  <strong>TIR6:</strong> {item.tir6}
                </p>
                <p>
                  <strong>Grouped Pricing:</strong> {item.grouped_pricing}
                </p>
                <p>
                  <strong>Executive:</strong> {item.executive}
                </p>
                <p>
                  <strong>Discount:</strong> {item.discount}
                </p>
                <p>
                  <strong>SPC Score:</strong> {item.spc_score}
                </p>
                <p>
                  <strong>Risk Level:</strong> {item.risk_level}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && pricingData.length === 0 && (
        <p>Nenhum dado disponível.</p>
      )}
    </div>
  );
};

export default ViewPricing;
