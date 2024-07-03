import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';
import '../styles/Pricing.css';
import PricingForm from '../components/PricingForm';

const Pricing = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [apiResponseInadimFlow, setApiResponseInadimFlow] = useState(null);
  const [apiResponseRoll, setApiResponseRoll] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      setExcelData(json);

      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('json', JSON.stringify(json));

        const responseFlask = await axios.post(
          'http://localhost:5001/api/pricing',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        setApiResponse(responseFlask.data.pricing);
        setApiResponseInadimFlow(responseFlask.data.inadim_flow);
        setApiResponseRoll(responseFlask.data.roll);
      } catch (err) {
        console.error('Erro ao enviar para a API Flask:', err.message);
        setApiResponse(null);
        setApiResponseInadimFlow(null);
        setApiResponseRoll(null);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx, .xls',
  });

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatPercentage = (value) => {
    return (
      (value * 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + '%'
    );
  };

  return (
    <div className="Pricing">
      <PricingForm excelData={excelData} />
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Arraste e solte um arquivo Excel ou clique para selecionar</p>
      </div>

      {isLoading && (
        <p className="loading">Aguardando resposta do servidor...</p>
      )}

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

export default Pricing;
