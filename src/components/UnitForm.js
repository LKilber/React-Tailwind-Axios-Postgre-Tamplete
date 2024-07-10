import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PricingReport from './PricingReport';

const executiveOptions = [
  'Allacy Silva',
  'Anne Hidaka',
  'Antonio Claudio',
  'Antonio Staub',
  'Carolina Figueiredo',
  'Cristiano Franco',
  'Edivania de Oliveira do Nascimento',
  'Fábio Sena',
  'Gabriel Francisco',
  'Gutemberg Gomes',
  'Igor Sampaio',
  'Jailson Paiva',
  'Janaina Castro',
  'Mario Sergio',
  'Nicolas Teixeira',
  'Niedson Falcão',
  'Rafaela Ribeiro',
  'Talison Machado',
  'Warly Bernardino',
];

const UnitForm = ({
  unit,
  index,
  handleUnitChange,
  handleUnitDataChange,
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
  const [reportExpanded, setReportExpanded] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      let json = XLSX.utils.sheet_to_json(worksheet);

      json = json.map((record) => ({
        year_ref: parseInt(record['year_ref']),
        student_name: record['student_name'],
        financial_resp: record['financial_resp'],
        due_date: isValidExcelDate(record['due_date'])
          ? formatExcelDate(record['due_date'])
          : null,
        original_value: parseFloat(record['original_value']),
        discount: parseFloat(record['discount']),
        payment_value: parseFloat(record['payment_value']),
        payment_date: isValidExcelDate(record['payment_date'])
          ? formatExcelDate(record['payment_date'])
          : null,
      }));

      setFile(file);
      setJson(json);
      setFileUploaded(true);

      handleUnitDataChange(index, json);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const formatExcelDate = (excelDate) => {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  };

  const isValidExcelDate = (value) => {
    return !isNaN(value) && Number.isInteger(value) && value > 0;
  };

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
        <div className="grid grid-cols-5 gap-4 mt-4">
          {[
            { field: 'cnpj', label: 'CNPJ' },
            { field: 'inep', label: 'INEP' },
            { field: 'spcScore', label: 'SPC Score' },
            { field: 'fantasyName', label: 'Nome Fantasia' },
            { field: 'companyName', label: 'Razão Social' },
          ].map(({ field, label }) => (
            <div key={field} className="floating-label">
              <input
                type="text"
                id={`unit-${index}-${field}`}
                placeholder=" "
                value={unit[field]}
                onChange={(e) => handleUnitChange(index, field, e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors[`units[${index}].${field}`]
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              <label htmlFor={`unit-${index}-${field}`}>{label}</label>
              {errors[`units[${index}].${field}`] && (
                <p className="text-red-600">
                  {errors[`units[${index}].${field}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { field: 'cep', label: 'CEP' },
            { field: 'endereco', label: 'Endereço' },
            { field: 'cidade', label: 'Cidade' },
            { field: 'uf', label: 'UF' },
          ].map(({ field, label }) => (
            <div key={field} className="floating-label">
              <input
                type="text"
                id={`unit-${index}-${field}`}
                placeholder=" "
                value={unit[field]}
                onChange={(e) => handleUnitChange(index, field, e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors[`units[${index}].${field}`]
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              <label htmlFor={`unit-${index}-${field}`}>{label}</label>
              {errors[`units[${index}].${field}`] && (
                <p className="text-red-600">
                  {errors[`units[${index}].${field}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { field: 'executiveName', label: 'Nome do Executivo' },
            { field: 'studentsQtt', label: 'Quantidade de Alunos' },
            { field: 'discountPct', label: 'Percentual de Desconto' },
            { field: 'ticketAvg', label: 'Ticket Médio' },
          ].map(({ field, label }) => (
            <div key={field} className="floating-label">
              {field === 'executiveName' ? (
                <>
                  <select
                    id={`unit-${index}-${field}`}
                    value={unit[field]}
                    onChange={(e) =>
                      handleUnitChange(index, field, e.target.value)
                    }
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors[`units[${index}].${field}`]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    required
                  >
                    <option value="" disabled>
                      {label}
                    </option>
                    {executiveOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors[`units[${index}].${field}`] && (
                    <p className="text-red-600">
                      {errors[`units[${index}].${field}`]}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    id={`unit-${index}-${field}`}
                    placeholder=" "
                    value={unit[field]}
                    onChange={(e) =>
                      handleUnitChange(index, field, e.target.value)
                    }
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors[`units[${index}].${field}`]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  <label htmlFor={`unit-${index}-${field}`}>{label}</label>
                  {errors[`units[${index}].${field}`] && (
                    <p className="text-red-600">
                      {errors[`units[${index}].${field}`]}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4 mt-4">
          {[
            { field: 'tir0', label: 'TIR 0' },
            { field: 'tir1', label: 'TIR 1' },
            { field: 'tir2', label: 'TIR 2' },
            { field: 'tir3', label: 'TIR 3' },
            { field: 'tir4', label: 'TIR 4' },
            { field: 'tir5', label: 'TIR 5' },
            { field: 'tir6', label: 'TIR 6' },
          ].map(({ field, label }) => (
            <div key={field} className="floating-label">
              <input
                type="text"
                id={`unit-${index}-${field}`}
                placeholder=" "
                value={unit[field]}
                onChange={(e) => handleUnitChange(index, field, e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors[`units[${index}].${field}`]
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              <label htmlFor={`unit-${index}-${field}`}>{label}</label>
              {errors[`units[${index}].${field}`] && (
                <p className="text-red-600">
                  {errors[`units[${index}].${field}`]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <div
            {...getRootProps({
              className: `dropzone flex-grow ${fileUploaded ? 'bg-green-200' : ''}`,
            })}
          >
            <input {...getInputProps()} />
            <p>
              {fileUploaded
                ? file.name
                : 'Arraste e solte um arquivo Excel ou clique para selecionar'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleGeneratePricing}
            className="ml-4 py-7 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Precificar
          </button>
        </div>
        {isLoading && (
          <p className="loading">Aguardando resposta do servidor...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      {apiResponse && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setReportExpanded(!reportExpanded)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {reportExpanded ? 'Fechar Relatório' : 'Expandir Relatório'}
            <FontAwesomeIcon
              icon={reportExpanded ? faChevronUp : faChevronDown}
              className="ml-2"
            />
          </button>
          {reportExpanded && (
            <PricingReport
              apiResponse={apiResponse}
              apiResponseInadimFlow={apiResponseInadimFlow}
              apiResponseRoll={apiResponseRoll}
            />
          )}
        </div>
      )}
    </div>
  );
};

UnitForm.propTypes = {
  unit: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleUnitChange: PropTypes.func.isRequired,
  handleUnitDataChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  toggleExpandUnit: PropTypes.func.isRequired,
};

export default UnitForm;
