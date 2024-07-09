import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PricingReport from './PricingReport';

const UnitForm = ({
  unit,
  index,
  handleUnitChange,
  errors,
  expanded,
  toggleExpandUnit,
}) => {
  const [file, setFile] = useState(null);
  const [json, setJson] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiResponseInadimFlow, setApiResponseInadimFlow] = useState(null);
  const [apiResponseRoll, setApiResponseRoll] = useState(null);
  const [error, setError] = useState(null);
  const [reportExpanded, setReportExpanded] = useState(false); // State to control report expansion

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      setFile(file);
      setJson(json);
      setFileUploaded(true);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx, .xls',
    maxFiles: 1,
  });

  const handleGeneratePricing = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('json', JSON.stringify(json));

      const responseFlask = await axios.post(
        'http://192.168.19.183:5001/api/pricing',
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

      console.log('API Response:', responseFlask.data);
    } catch (err) {
      setError('Erro ao enviar para a API Flask: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-300 pt-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unidade {index + 1} - U{unit.cnpj}N{index + 1}R
        </h3>
        <FontAwesomeIcon
          icon={faChevronDown}
          onClick={() => toggleExpandUnit(index)}
          className={`text-blue-500 cursor-pointer transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>
      <div
        className={`transition-max-height duration-500 ease-in-out overflow-hidden ${expanded ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="grid grid-cols-4 gap-4 mt-4">
          {['cnpj', 'inep', 'fantasyName', 'companyName'].map((field) => (
            <div key={field}>
              <input
                type="text"
                placeholder={field}
                value={unit[field]}
                onChange={(e) => handleUnitChange(index, field, e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors[index]?.[field] && (
                <p className="text-red-500 text-sm">{errors[index][field]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {['cep', 'endereco', 'cidade', 'uf'].map((field) => (
            <div key={field}>
              <input
                type="text"
                placeholder={field}
                value={unit[field]}
                onChange={(e) => handleUnitChange(index, field, e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors[index]?.[field] && (
                <p className="text-red-500 text-sm">{errors[index][field]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {['executiveName', 'studentsQtt', 'discountPct', 'ticketAvg'].map(
            (field) => (
              <div key={field}>
                <input
                  type="text"
                  placeholder={field}
                  value={unit[field]}
                  onChange={(e) =>
                    handleUnitChange(index, field, e.target.value)
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors[index]?.[field] && (
                  <p className="text-red-500 text-sm">{errors[index][field]}</p>
                )}
              </div>
            ),
          )}
        </div>
        <div className="grid grid-cols-7 gap-4 mt-4">
          {['tir0', 'tir1', 'tir2', 'tir3', 'tir4', 'tir5', 'tir6'].map(
            (field) => (
              <div key={field}>
                <input
                  type="text"
                  placeholder={field}
                  value={unit[field]}
                  onChange={(e) =>
                    handleUnitChange(index, field, e.target.value)
                  }
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors[index]?.[field] && (
                  <p className="text-red-500 text-sm">{errors[index][field]}</p>
                )}
              </div>
            ),
          )}
        </div>
        <div
          {...getRootProps({
            className: `dropzone ${fileUploaded ? 'bg-green-200' : ''}`,
          })}
        >
          <input {...getInputProps()} />
          <p>Arraste e solte um arquivo Excel ou clique para selecionar</p>
        </div>
        <button
          type="button"
          onClick={handleGeneratePricing}
          className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-semibold text-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Precificar
        </button>
        {isLoading && (
          <p className="loading">Aguardando resposta do servidor...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {apiResponse && (
          <div>
            <button
              onClick={() => setReportExpanded(!reportExpanded)}
              className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportExpanded ? 'Esconder Relatório' : 'Mostrar Relatório'}
            </button>
            <div
              className={`transition-max-height duration-500 ease-in-out overflow-hidden ${reportExpanded ? 'max-h-screen' : 'max-h-0'}`}
            >
              <PricingReport
                apiResponse={apiResponse}
                apiResponseInadimFlow={apiResponseInadimFlow}
                apiResponseRoll={apiResponseRoll}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

UnitForm.propTypes = {
  unit: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleUnitChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  toggleExpandUnit: PropTypes.func.isRequired,
};

export default UnitForm;
