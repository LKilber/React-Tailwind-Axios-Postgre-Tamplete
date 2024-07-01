import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

const PricingForm = () => {
  const [quantity, setQuantity] = useState(0);
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value);

    const newUnits = Array.from({ length: value }, () => ({
      schoolName: '',
      schoolID: '',
      pricingType: '',
      cnpj: '',
      inep: '',
      demandDate: null,
      pricingDate: null,
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
      financialDataType: '',
    }));
    setUnits(newUnits);
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...units];
    newUnits[index][field] = value;
    setUnits(newUnits);
  };

  const handleDateChange = (field, date) => {
    const newUnits = [...units];
    newUnits[field] = date;
    setUnits(newUnits);
  };

  const validate = () => {
    const newErrors = {};
    units.forEach((unit, index) => {
      if (!unit.cnpj) newErrors[`cnpj${index}`] = 'CNPJ é obrigatório';
      if (!unit.unitName)
        newErrors[`unitName${index}`] = 'Nome da Unidade é obrigatório';
      if (!unit.executiveName)
        newErrors[`executiveName${index}`] = 'Nome do Executivo é obrigatório';
      if (!unit.pricingDate)
        newErrors[`pricingDate${index}`] = 'Data de Precificação é obrigatória';
      if (!unit.demandDate)
        newErrors[`demandDate${index}`] = 'Data de Demanda é obrigatória';
      if (!unit.cep) newErrors[`cep${index}`] = 'CEP é obrigatório';
      if (!unit.endereco)
        newErrors[`endereco${index}`] = 'Endereço é obrigatório';
      if (!unit.cidade) newErrors[`cidade${index}`] = 'Cidade é obrigatória';
      if (!unit.uf) newErrors[`uf${index}`] = 'UF é obrigatório';
      ['tir0', 'tir1', 'tir2', 'tir3', 'tir4', 'tir5', 'tir6'].forEach(
        (tir) => {
          if (!unit[tir])
            newErrors[`${tir}${index}`] = `${tir.toUpperCase()} é obrigatório`;
        },
      );
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Form submitted:', { quantity, units });
  };

  const handleFileUpload = (e) => {
    console.log('File uploaded:', e.target.files[0]);
  };

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Formulário de Precificação
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Escola
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID da Escola
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade de Unidade
              </label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Precificação
              </label>
              <input
                type="radio"
                id="option1"
                value="Agrupada"
                checked={selectedValue === 'Agrupada'}
                onChange={() => handleRadioChange('Agrupada')}
              />
              <input
                type="radio"
                id="option2"
                value="Não Agrupada"
                checked={selectedValue === 'Não Agrupada'}
                onChange={() => handleRadioChange('Não Agrupada')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Precificação
              </label>
              <DatePicker
                onChange={(date) => handleDateChange('pricingDate', date)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Selecione a data"
                locale="pt-BR"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Demanda
              </label>
              <DatePicker
                onChange={(date) => handleDateChange('demandDate', date)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Selecione a data"
                locale="pt-BR"
                required
              />
            </div>
          </div>
          {units.map((unit, index) => (
            <div key={index} className="border-t border-gray-300 pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unidade {index + 1}
              </h3>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {['cnpj', 'inep', 'fantasyName', 'companyName'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={unit[field]}
                      onChange={(e) =>
                        handleUnitChange(index, field, e.target.value)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[`${field}${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`${field}${index}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {['cep', 'endereco', 'cidade', 'uf'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={unit[field]}
                      onChange={(e) =>
                        handleUnitChange(index, field, e.target.value)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[`${field}${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`${field}${index}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[
                  'executiveName',
                  'studentsQtt',
                  'discountPct',
                  'ticketAvg',
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={unit[field]}
                      onChange={(e) =>
                        handleUnitChange(index, field, e.target.value)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[`${field}${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`${field}${index}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4 mt-4">
                {['tir0', 'tir1', 'tir2', 'tir3', 'tir4', 'tir5', 'tir6'].map(
                  (tir) => (
                    <div key={tir}>
                      <label className="block text-sm font-medium text-gray-700">
                        {tir.toUpperCase()}
                      </label>
                      <input
                        type="text"
                        value={unit[tir]}
                        onChange={(e) =>
                          handleUnitChange(index, tir, e.target.value)
                        }
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {errors[`${tir}${index}`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`${tir}${index}`]}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Carregar arquivo Excel
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PricingForm;
