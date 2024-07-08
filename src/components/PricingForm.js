import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/PricingForm.css';
import axios from 'axios';

const PricingForm = () => {
  const [formState, setFormState] = useState({
    units: [],
    errors: {},
  });

  const [expandedUnits, setExpandedUnits] = useState([]);

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
    setExpandedUnits(Array.from({ length: quantity }, () => false));
  };

  const handleUnitChange = async (index, field, value) => {
    const newUnits = [...formState.units];
    newUnits[index] = { ...newUnits[index], [field]: value };

    if (field === 'cnpj') {
      newUnits[index].unitId = `U${value}N${index + 1}R`;

      if (value.length === 14) {
        try {
          const response = await axios.get(
            `http://192.168.19.183:5001/api/fetch_cnpj_data/${value}`,
          );

          const data = response.data;
          newUnits[index] = {
            ...newUnits[index],
            fantasyName: data.fantasia,
            companyName: data.nome,
            cep: data.cep,
            endereco: data.logradouro,
            cidade: data.municipio,
            uf: data.uf,
          };
        } catch (error) {
          console.error('Error fetching CNPJ data:', error);
        }
      }
    }

    setFormState({ ...formState, units: newUnits });
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

  const toggleExpandUnit = (index) => {
    setExpandedUnits((prev) => {
      const newExpandedUnits = [...prev];
      newExpandedUnits[index] = !newExpandedUnits[index];
      return newExpandedUnits;
    });
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
    <div className="w-full bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Formulário de Precificação
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Escola"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="schoolName"
              value={formState.schoolName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="ID da Escola"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="schoolID"
              value={formState.schoolID}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="riskAlert"
              value={formState.riskAlert}
              onChange={handleChange}
              required
            >
              <option value="">Alerta de Risco</option>
              <option value="high">Alto</option>
              <option value="medio">Médio</option>
              <option value="low">Baixo</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <input
              type="number"
              placeholder="Quantidade de Unidades"
              name="quantity"
              value={formState.quantity}
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
            <div className="mt-1 flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="selectedValue"
                  value="Agrupada"
                  checked={formState.selectedValue === 'Agrupada'}
                  onChange={handleChange}
                  className="mr-1"
                />
                Agrupada
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="selectedValue"
                  value="Não Agrupada"
                  checked={formState.selectedValue === 'Não Agrupada'}
                  onChange={handleChange}
                  className="mr-1"
                />
                Não Agrupada
              </label>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Observações"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="observations"
              value={formState.observations}
              onChange={handleChange}
            />
          </div>
        </div>

        {units.map((unit, index) => (
          <div key={index} className="border-t border-gray-300 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unidade {index + 1} - U{unit.cnpj}N{index + 1}R
              </h3>
              <FontAwesomeIcon
                icon={faChevronDown}
                onClick={() => toggleExpandUnit(index)}
                className={`text-blue-500 cursor-pointer transform transition-transform duration-200 ${
                  expandedUnits[index] ? 'rotate-180' : ''
                }`}
              />
            </div>
            <div
              className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                expandedUnits[index] ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              <div className="grid grid-cols-4 gap-4 mt-4">
                {['cnpj', 'inep', 'fantasyName', 'companyName'].map((field) => (
                  <div key={field}>
                    <input
                      type="text"
                      placeholder={placeholders[field]}
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
                    <input
                      type="text"
                      placeholder={placeholders[field]}
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
                    <input
                      type="text"
                      placeholder={placeholders[field]}
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
                  (field) => (
                    <div key={field}>
                      <input
                        type="text"
                        placeholder={placeholders[field]}
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
                  ),
                )}
              </div>
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
  );
};

export default PricingForm;
