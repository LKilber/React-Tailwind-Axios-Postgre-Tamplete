import React from 'react';
import PropTypes from 'prop-types';

const PricingReport = ({
  apiResponse,
  apiResponseInadimFlow,
  apiResponseRoll,
}) => {
  const formatPercentage = (value) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value) => `R$ ${value.toFixed(2)}`;

  return (
    <div className="pricing-report">
      {apiResponse && (
        <div className="response">
          <h3>Resposta da API Flask - Taxas:</h3>
          <table>
            <thead>
              <tr>
                <th>TIR</th>
                <th>Taxa Kedu</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(apiResponse) &&
                apiResponse.map((item, index) => (
                  <tr key={index}>
                    <td>{formatPercentage(item.tir_objetivo)}</td>
                    <td>{formatPercentage(item.tk_encontrado)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {apiResponseInadimFlow && (
        <div className="response">
          <h3>Resposta da API Flask - Inadim Flow:</h3>
          <table>
            <thead>
              <tr>
                <th>Data Ref.</th>
                <th>Recebíveis (R$)</th>
                <th>Recebíveis Acc. (R$)</th>
                <th>Pagamentos (R$)</th>
                <th>Pagamentos Acc. (R$)</th>
                <th>Inadimplência Acc. (R$)</th>
                <th>Inadimplência (%)</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(apiResponseInadimFlow) &&
                apiResponseInadimFlow.map((item, index) => (
                  <tr key={index}>
                    <td>{item.data_ref}</td>
                    <td>{formatCurrency(item.recebiveis)}</td>
                    <td>{formatCurrency(item.recebiveis_acc)}</td>
                    <td>{formatCurrency(item.pagamentos)}</td>
                    <td>{formatCurrency(item.pagamentos_acc)}</td>
                    <td>{formatCurrency(item.inadim_acc)}</td>
                    <td>{formatPercentage(item.inadim_pct)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {apiResponseRoll && (
        <div className="response">
          <h3>Resposta da API Flask - Rolagem:</h3>
          <table>
            <thead>
              <tr>
                <th>Data Ref.</th>
                <th>Recebíveis (R$)</th>
                <th>D+0 (%)</th>
                <th>D+30 (%)</th>
                <th>D+60 (%)</th>
                <th>D+90 (%)</th>
                <th>D+120 (%)</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(apiResponseRoll) &&
                apiResponseRoll.map((item, index) => (
                  <tr key={index}>
                    <td>{item.data_ref}</td>
                    <td>{formatCurrency(item.recebiveis)}</td>
                    <td>{formatPercentage(item.d0)}</td>
                    <td>{formatPercentage(item.d30)}</td>
                    <td>{formatPercentage(item.d60)}</td>
                    <td>{formatPercentage(item.d90)}</td>
                    <td>{formatPercentage(item.d120)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

PricingReport.propTypes = {
  apiResponse: PropTypes.array,
  apiResponseInadimFlow: PropTypes.array,
  apiResponseRoll: PropTypes.array,
};

export default PricingReport;
