import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const PricingForm = () => {
  const [formState, setFormState] = useState({
    quantity: 0,
    units: [],
    selectedValue: 'Agrupada',
    errors: {},
  });

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
      })),
    }));
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...formState.units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setFormState((prev) => ({ ...prev, units: newUnits }));
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
    console.log('Form submitted:', formState);
    if (validate()) {
      console.log('Form submitted:', formState);
    }
  };

  const { quantity, units, selectedValue, errors } = formState;

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
                name="schoolName"
                value={formState.schoolName}
                onChange={handleChange}
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
                name="schoolID"
                value={formState.schoolID}
                onChange={handleChange}
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
                name="quantity"
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
              <div className="mt-1 flex items-center">
                <label className="mr-2">
                  <input
                    type="radio"
                    name="selectedValue"
                    value="Agrupada"
                    checked={selectedValue === 'Agrupada'}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Agrupada
                </label>
                <label>
                  <input
                    type="radio"
                    name="selectedValue"
                    value="Não Agrupada"
                    checked={selectedValue === 'Não Agrupada'}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Não Agrupada
                </label>
              </div>
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
                    {errors[index]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[index][field]}
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
                    {errors[index]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[index][field]}
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
                    {errors[index]?.[field] && (
                      <p className="text-red-500 text-sm">
                        {errors[index][field]}
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
                      {errors[index]?.[tir] && (
                        <p className="text-red-500 text-sm">
                          {errors[index][tir]}
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
                  onChange={(e) =>
                    console.log('File uploaded:', e.target.files[0])
                  }
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
