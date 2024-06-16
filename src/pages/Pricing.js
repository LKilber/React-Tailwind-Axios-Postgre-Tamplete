import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

// Register the locale
registerLocale('pt-BR', ptBR);

const Pricing = () => {
  const [quantity, setQuantity] = useState(0);
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState({});

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value);

    const newUnits = Array.from({ length: value }, () => ({
      cnpj: '',
      unitName: '',
      executiveName: '',
      pricingDate: null,
      demandDate: null,
      cep: '',
      endereco: '',
      cidade: '',
      uf: '',
      tir0: '',
      tir1: '',
      tir2: '',
      tir3: '',
      tir4: '',
      tir5: '',
      tir6: '',
    }));
    setUnits(newUnits);
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...units];
    newUnits[index][field] = value;
    setUnits(newUnits);
  };

  const handleDateChange = (index, field, date) => {
    const newUnits = [...units];
    newUnits[index][field] = date;
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

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Formulário de Precificação
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            {units.map((unit, index) => (
              <div key={index} className="border-t border-gray-300 pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Unidade {index + 1}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={unit.cnpj}
                      onChange={(e) =>
                        handleUnitChange(index, 'cnpj', e.target.value)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[`cnpj${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`cnpj${index}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome da Unidade
                    </label>
                    <input
                      type="text"
                      value={unit.unitName}
                      onChange={(e) =>
                        handleUnitChange(index, 'unitName', e.target.value)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[`unitName${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`unitName${index}`]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome do Executivo
                    </label>
                    <input
                      type="text"
                      value={unit.executiveName}
                      onChange={(e) =>
                        handleUnitChange(index, 'executiveName', e.target.value)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors[`executiveName${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`executiveName${index}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Precificação
                    </label>
                    <DatePicker
                      selected={unit.pricingDate}
                      onChange={(date) =>
                        handleDateChange(index, 'pricingDate', date)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Selecione a data"
                      locale="pt-BR"
                      required
                    />
                    {errors[`pricingDate${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`pricingDate${index}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Demanda
                    </label>
                    <DatePicker
                      selected={unit.demandDate}
                      onChange={(date) =>
                        handleDateChange(index, 'demandDate', date)
                      }
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Selecione a data"
                      locale="pt-BR"
                      required
                    />
                    {errors[`demandDate${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`demandDate${index}`]}
                      </p>
                    )}
                  </div>
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
    </MainLayout>
  );
};

export default Pricing;
