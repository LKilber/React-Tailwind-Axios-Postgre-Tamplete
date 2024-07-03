import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PricingForm = ({ excelData }) => {
  const [formState, setFormState] = useState({
    units: [],
    errors: {},
    financialData: excelData,
    pricingDate: new Date(),
    demandDate: new Date(),
  });

  useEffect(() => {
    if (excelData) {
      setFormState((prev) => ({ ...prev, financialData: excelData }));
    }
  }, [excelData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    setFormState((prev) => ({
      ...prev,
      quantity,
      units: Array.from({ length: quantity }, () => ({
        unitId: '',
        cnpj: '',
        inep: '',
        fantasyName: '',
        companyName: '',
        cep: '',
        endereco: '',
        cidade: '',
        uf: '',
        executiveName: '',
        studentsQtt: '',
        discountPct: '',
        ticketAvg: '',
        tir0: '',
        tir1: '',
        tir2: '',
        tir3: '',
        tir4: '',
        tir5: '',
        tir6: '',
      })),
    }));
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...formState.units];
    newUnits[index] = { ...newUnits[index], [field]: value };

    if (field === 'cnpj') {
      newUnits[index].unitId = `U${value}N${index + 1}R`;
    }

    setFormState((prev) => ({ ...prev, units: newUnits }));
  };

  const handleDateChange = (date, name) => {
    setFormState((prev) => ({ ...prev, [name]: date }));
  };

  const validate = () => {
    const errors = {};
    formState.units.forEach((unit, index) => {
      const unitErrors = {};
      const requiredFields = [
        'cnpj',
        'schoolName',
        'executiveName',
        'pricingDate',
        'demandDate',
        'cep',
        'endereco',
        'cidade',
        'uf',
        'tir0',
        'tir1',
        'tir2',
        'tir3',
        'tir4',
        'tir5',
        'tir6',
      ];
      requiredFields.forEach((field) => {
        if (!unit[field]) {
          unitErrors[field] = `${field.toUpperCase()} é obrigatório`;
        }
      });
      if (Object.keys(unitErrors).length) {
        errors[index] = unitErrors;
      }
    });
    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
    if (validate()) {
      console.log('Form submitted:', formState);
    }
  };

  const { units, errors } = formState;

  const placeholders = {
    cnpj: 'CNPJ',
    inep: 'INEP',
    fantasyName: 'Nome Fantasia',
    companyName: 'Razão Social',
    cep: 'CEP',
    endereco: 'Endereço',
    cidade: 'Cidade',
    uf: 'UF',
    executiveName: 'Nome do Executivo',
    studentsQtt: 'Quantidade de Alunos',
    discountPct: 'Porcentagem de Desconto',
    ticketAvg: 'Média do Ticket',
    tir0: 'TIR 0',
    tir1: 'TIR 1',
    tir2: 'TIR 2',
    tir3: 'TIR 3',
    tir4: 'TIR 4',
    tir5: 'TIR 5',
    tir6: 'TIR 6',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Formulário de Precificação
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escola
              </label>
              <input
                type="text"
                placeholder="Escola"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="schoolName"
                value={formState.schoolName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID da Escola
              </label>
              <input
                type="text"
                placeholder="ID da Escola"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="schoolID"
                value={formState.schoolID}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alerta de Risco
              </label>
              <select
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="riskAlert"
                value={formState.riskAlert}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                <option value="high">Alto</option>
                <option value="medium">Médio</option>
                <option value="low">Baixo</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade de Unidades
              </label>
              <input
                type="number"
                placeholder="Quantidade de Unidades"
                name="quantity"
                value={formState.quantity}
                onChange={handleQuantityChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div className="relative flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="selectedValue"
                  value="Agrupada"
                  checked={formState.selectedValue === 'Agrupada'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Agrupada
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="selectedValue"
                  value="Não Agrupada"
                  checked={formState.selectedValue === 'Não Agrupada'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Não Agrupada
                </span>
              </label>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <input
                type="text"
                placeholder="Observações"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                name="observations"
                value={formState.observations}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Precificação
              </label>
              <DatePicker
                selected={formState.pricingDate}
                onChange={(date) => handleDateChange(date, 'pricingDate')}
                dateFormat="dd/MM/yyyy"
                placeholderText="Data de Precificação"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Demanda
              </label>
              <DatePicker
                selected={formState.demandDate}
                onChange={(date) => handleDateChange(date, 'demandDate')}
                dateFormat="dd/MM/yyyy"
                placeholderText="Data de Demanda"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {units.map((unit, index) => (
            <div key={index} className="border-t border-gray-300 pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unidade {index + 1} - U{unit.cnpj}N{index + 1}R
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['cnpj', 'inep', 'fantasyName', 'companyName'].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type="text"
                      placeholder={placeholders[field]}
                      value={unit[field]}
                      onChange={(e) =>
                        handleUnitChange(index, field, e.target.value)
                      }
                      className="mt-1 block w-full pl-2 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[index]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[index][field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {['cep', 'endereco', 'cidade', 'uf'].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type="text"
                      placeholder={placeholders[field]}
                      value={unit[field]}
                      onChange={(e) =>
                        handleUnitChange(index, field, e.target.value)
                      }
                      className="mt-1 block w-full pl-2 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[index]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[index][field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {[
                  'executiveName',
                  'studentsQtt',
                  'discountPct',
                  'ticketAvg',
                ].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type="text"
                      placeholder={placeholders[field]}
                      value={unit[field]}
                      onChange={(e) =>
                        handleUnitChange(index, field, e.target.value)
                      }
                      className="mt-1 block w-full pl-2 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[index]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[index][field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-4">
                {['tir0', 'tir1', 'tir2', 'tir3', 'tir4', 'tir5', 'tir6'].map(
                  (field) => (
                    <div key={field} className="relative">
                      <input
                        type="text"
                        placeholder={placeholders[field]}
                        value={unit[field]}
                        onChange={(e) =>
                          handleUnitChange(index, field, e.target.value)
                        }
                        className="mt-1 block w-full pl-2 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {errors[index]?.[field] && (
                        <p className="text-red-500 text-sm">
                          {errors[index][field]}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-center hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

PricingForm.propTypes = {
  excelData: PropTypes.array,
};

export default PricingForm;
