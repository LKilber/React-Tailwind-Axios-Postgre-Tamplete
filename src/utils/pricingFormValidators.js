const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

export const validatePricingForm = (formState) => {
  let errors = {};

  if (!formState.schoolName) {
    errors.schoolName = 'Nome da escola é obrigatório';
  }

  if (!formState.schoolID) {
    errors.schoolID = 'ID da escola é obrigatório';
  }

  if (!formState.riskAlert) {
    errors.riskAlert = 'Alerta de risco é obrigatório';
  }

  if (formState.quantity <= 0) {
    errors.quantity = 'Quantidade de unidades deve ser maior que zero';
  }

  if (!formState.pricingType) {
    errors.pricingType = 'Tipo de precificação é obrigatório';
  }

  if (!formState.demandDate) {
    errors.demandDate = 'Data da demanda é obrigatória';
  }

  if (!formState.pricingDate) {
    errors.pricingDate = 'Data da precificação é obrigatória';
  }

  formState.units.forEach((unit, index) => {
    if (unit.cnpj.length !== 14) {
      errors[`units[${index}].cnpj`] = 'CNPJ deve ter 14 caracteres';
    } else if (!validateCNPJ(unit.cnpj)) {
      errors[`units[${index}].cnpj`] = 'CNPJ inválido';
    }

    if (unit.inep.length !== 8) {
      errors[`units[${index}].inep`] = 'INEP deve ter 8 dígitos';
    }

    if (isNaN(unit.spcScore)) {
      errors[`units[${index}].spcScore`] = 'SPC Score deve ser um número';
    }

    if (!unit.fantasyName) {
      errors[`units[${index}].fantasyName`] = 'Nome fantasia é obrigatório';
    }

    if (!unit.companyName) {
      errors[`units[${index}].companyName`] = 'Nome da empresa é obrigatório';
    }

    if (unit.cep.length !== 8) {
      errors[`units[${index}].cep`] = 'CEP deve ter 8 dígitos';
    }

    if (!unit.endereco) {
      errors[`units[${index}].endereco`] = 'Endereço é obrigatório';
    }

    if (!unit.cidade) {
      errors[`units[${index}].cidade`] = 'Cidade é obrigatória';
    }

    if (!unit.uf) {
      errors[`units[${index}].uf`] = 'UF é obrigatório';
    }

    if (!unit.executiveName) {
      errors[`units[${index}].executiveName`] =
        'Nome do executivo é obrigatório';
    }

    if (isNaN(unit.studentsQtt)) {
      errors[`units[${index}].studentsQtt`] =
        'Quantidade de estudantes deve ser um número';
    }

    if (isNaN(unit.discountPct)) {
      errors[`units[${index}].discountPct`] =
        'Percentual de desconto deve ser um número';
    }

    if (isNaN(unit.ticketAvg)) {
      errors[`units[${index}].ticketAvg`] = 'Ticket médio deve ser um número';
    }
  });

  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
