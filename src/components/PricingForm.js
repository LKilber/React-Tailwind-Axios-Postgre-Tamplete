import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PricingForm.css';
import UnitForm from './UnitForm';
import { validatePricingForm, hasErrors } from '../utils/pricingFormValidators';
import Modal from './Modal';

const PricingForm = () => {
  const [formState, setFormState] = useState({
    units: [],
    errors: {},
    schoolName: '',
    schoolID: '',
    riskAlert: '',
    quantity: 0,
    pricingType: '',
    observations: '',
    demandDate: '',
    pricingDate: '',
  });

  const [expandedUnits, setExpandedUnits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
        spcScore: '',
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
        unitData: '',
        unitDataType: '',
        pricingId: '',
      })),
    }));
    setExpandedUnits(Array.from({ length: quantity }, () => false));
  };

  const handleUnitChange = async (index, field, value) => {
    const newUnits = [...formState.units];
    newUnits[index] = { ...newUnits[index], [field]: value };

    if (field === 'cnpj') {
      newUnits[index].unitId = `U${value}N${index + 1}R`;

      const formattedDate = formState.pricingDate.replace(/-/g, '');
      newUnits[index].pricingId = `${newUnits[index].unitId}${formattedDate}P`;

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

  const handleUnitDataChange = (index, json) => {
    const dataType = json.some((item) =>
      Object.prototype.hasOwnProperty.call(item, 'student_name'),
    )
      ? 'DETALHADO'
      : 'CONSOLIDADO';

    console.log(dataType);
    setFormState((prevState) => {
      const newUnits = [...prevState.units];
      newUnits[index] = {
        ...newUnits[index],
        unitData: json,
        unitDataType: dataType,
      };
      return { ...prevState, units: newUnits };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validatePricingForm(formState);
    setFormState((prev) => ({ ...prev, errors }));

    if (hasErrors(errors)) {
      console.log('Form contains errors:', errors);
      return;
    }

    console.log(formState);

    axios
      .post('http://192.168.19.183:5001/api/submit_pricing_form', formState)
      .then((response) => {
        console.log('Form submitted successfully:', response.data);
        setSuccessMessage('Dados enviados com sucesso!');
        setIsSuccessModalOpen(true);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        setSuccessMessage(
          'Erro ao enviar os dados. Por favor, tente novamente.',
        );
        setIsSuccessModalOpen(true);
      });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://192.168.19.183:5001/api/fetch_school_name/${formState.schoolName}`,
      );
      setSearchResults(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar a escola:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchResults([]);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const toggleExpandUnit = (index) => {
    setExpandedUnits((prev) => {
      const newExpandedUnits = [...prev];
      newExpandedUnits[index] = !newExpandedUnits[index];
      return newExpandedUnits;
    });
  };

  const { units, errors } = formState;

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Formulário de Precificação
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative floating-label">
            <input
              type="text"
              placeholder=" "
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="schoolName"
              value={formState.schoolName}
              onChange={handleChange}
              required
            />
            <label>Escola</label>
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-0 top-0 mt-1 py-3 px-4 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Buscar
            </button>
            {errors.schoolName && (
              <p className="text-red-600">{errors.schoolName}</p>
            )}
          </div>
          <div className="relative floating-label">
            <input
              type="text"
              placeholder=" "
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="schoolID"
              value={formState.schoolID}
              onChange={handleChange}
              required
            />
            <label>ID da Escola</label>
            {errors.schoolID && (
              <p className="text-red-600">{errors.schoolID}</p>
            )}
          </div>
          <div className="relative floating-label">
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="riskAlert"
              value={formState.riskAlert}
              onChange={handleChange}
              required
            >
              <option value="">Alerta de Risco</option>
              <option value="high">Alto</option>
              <option value="medium">Médio</option>
              <option value="low">Baixo</option>
            </select>
            {errors.riskAlert && (
              <p className="text-red-600">{errors.riskAlert}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="relative floating-label">
            <input
              type="number"
              placeholder=" "
              name="quantity"
              value={formState.quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
            />
            <label>Quantidade de Unidades</label>
            {errors.quantity && (
              <p className="text-red-600">{errors.quantity}</p>
            )}
          </div>
          <div className="relative floating-label">
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              name="pricingType"
              value={formState.pricingType}
              onChange={handleChange}
              required
            >
              <option value="">Tipo de Precificação</option>
              <option value="Agrupada">Agrupada</option>
              <option value="Não Agrupada">Não Agrupada</option>
            </select>
            {errors.pricingType && (
              <p className="text-red-600">{errors.pricingType}</p>
            )}
          </div>
          <div className="relative floating-label">
            <input
              type="date"
              name="demandDate"
              value={formState.demandDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <label>Data da Demanda</label>
            {errors.demandDate && (
              <p className="text-red-600">{errors.demandDate}</p>
            )}
          </div>
          <div className="relative floating-label">
            <input
              type="date"
              name="pricingDate"
              value={formState.pricingDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <label>Data da Precificação</label>
            {errors.pricingDate && (
              <p className="text-red-600">{errors.pricingDate}</p>
            )}
          </div>
        </div>
        <div className="relative floating-label">
          <input
            type="text"
            placeholder=" "
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            name="observations"
            value={formState.observations}
            onChange={handleChange}
          />
          <label>Observações</label>
        </div>

        {units.map((unit, index) => (
          <UnitForm
            key={index}
            unit={unit}
            index={index}
            handleUnitChange={handleUnitChange}
            handleUnitDataChange={handleUnitDataChange}
            errors={errors}
            expanded={expandedUnits[index]}
            toggleExpandUnit={toggleExpandUnit}
          />
        ))}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Enviar
        </button>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl mb-4">Resultados da Pesquisa</h2>
        <ul>
          {searchResults.map((result) => (
            <li key={result.id} className="mb-2">
              Nome da Escola: {result.school_name} - ID da Escola:{' '}
              {result.id_school} - CNPJ: {result.cnpj}
            </li>
          ))}
        </ul>
      </Modal>
      <Modal isOpen={isSuccessModalOpen} onClose={closeSuccessModal}>
        <h2 className="text-xl mb-4">{successMessage}</h2>
        <button
          onClick={closeSuccessModal}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fechar
        </button>
      </Modal>
    </div>
  );
};

export default PricingForm;
