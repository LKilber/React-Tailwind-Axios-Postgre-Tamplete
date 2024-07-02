import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';

const PricingForm = () => {
  const [formState, setFormState] = useState({
    units: [],
    errors: {},
    percentages: {
      lessThanZero: 0,
      zeroToThirty: 0,
      greaterThanThirty: 0,
    },
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
        financialDataType: '',
        financialData: null,
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

  const parseExcelDate = (serial) => {
    const excelStartDate = new Date(1899, 11, 30);
    const date = new Date(excelStartDate.getTime() + serial * 86400000);
    return date;
  };

  const handleFileChange = (index, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = json[0];
      const responsibleIndex = headers.indexOf('responsible');
      const paymentDateIndex = headers.indexOf('payment_date');
      const dueDateIndex = headers.indexOf('due_date');

      if (
        responsibleIndex !== -1 &&
        paymentDateIndex !== -1 &&
        dueDateIndex !== -1
      ) {
        const paymentData = {};

        json.slice(1).forEach((row) => {
          const responsible = row[responsibleIndex];
          const paymentDate = parseExcelDate(row[paymentDateIndex]);
          const dueDate = parseExcelDate(row[dueDateIndex]);

          if (!isNaN(paymentDate) && !isNaN(dueDate)) {
            const daysDiff = (paymentDate - dueDate) / (1000 * 60 * 60 * 24); // Difference in days
            if (!paymentData[responsible]) {
              paymentData[responsible] = [];
            }
            paymentData[responsible].push(daysDiff);
          }
        });

        const averagePayments = Object.keys(paymentData).map((responsible) => {
          const total = paymentData[responsible].reduce(
            (acc, val) => acc + val,
            0,
          );
          return {
            responsible,
            averagePayment: total / paymentData[responsible].length,
          };
        });

        const percentages = {
          lessThanZero: 0,
          zeroToThirty: 0,
          greaterThanThirty: 0,
        };
        const totalResponsibles = averagePayments.length;

        averagePayments.forEach(({ averagePayment }) => {
          if (averagePayment < 0) {
            percentages.lessThanZero += 1;
          } else if (averagePayment >= 0 && averagePayment <= 30) {
            percentages.zeroToThirty += 1;
          } else if (averagePayment > 30) {
            percentages.greaterThanThirty += 1;
          }
        });

        percentages.lessThanZero =
          (percentages.lessThanZero / totalResponsibles) * 100;
        percentages.zeroToThirty =
          (percentages.zeroToThirty / totalResponsibles) * 100;
        percentages.greaterThanThirty =
          (percentages.greaterThanThirty / totalResponsibles) * 100;

        // Update the state with the parsed data and percentages
        const newUnits = [...formState.units];
        newUnits[index] = { ...newUnits[index], financialData: json };
        setFormState((prev) => ({ ...prev, units: newUnits, percentages }));
      } else {
        console.error(
          'Columns responsible, payment_date, or due_date not found in the Excel file.',
        );
      }
    };
    reader.readAsArrayBuffer(file);
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

  const { units, errors, percentages } = formState;

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unidade {index + 1} - U{unit.cnpj}N{index + 1}R
              </h3>
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
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Precificação
                  </label>
                  <div className="mt-1 flex items-center">
                    {['Consolidado', 'Detalhado'].map((type) => (
                      <label key={type} className="mr-2">
                        <input
                          type="radio"
                          name={`selectedValue-${index}`}
                          value={type}
                          checked={unit.financialDataType === type}
                          onChange={(e) =>
                            handleUnitChange(
                              index,
                              'financialDataType',
                              e.target.value,
                            )
                          }
                          className="mr-1"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h2>Percentages</h2>
                <p>
                  Percentage of responsible persons with average payment 0:{' '}
                  {percentages.lessThanZero}%
                </p>
                <p>
                  Percentage of responsible persons with average payment between
                  0 and 30: {percentages.zeroToThirty}%
                </p>
                <p>
                  Percentage of responsible persons with average payment 30:{' '}
                  {percentages.greaterThanThirty}%
                </p>
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
