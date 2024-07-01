# pricing.py

import pandas as pd
import numpy_financial as npf
from datetime import datetime, timedelta
import numpy as np
from dateutil.relativedelta import relativedelta

def pricing(file):
    try:
        df = pd.read_excel(file)
        df_final = pd.DataFrame()
    except Exception as err:
        print(err)

    df['Vencimento'] = pd.to_datetime(df['Vencimento'])
    df['DataPagamento'] = pd.to_datetime(df['DataPagamento'])
    df['Valor Total'] = df['Valor Total'].astype(float)
    df['Valor Pago'] = df['Valor Pago'].astype(float)
    df['Ano'] = df['Ano'].astype(int)
    df = df[df['Ano'] == 2023]

    def data_vencimento_ref(row):
        ano_vencimento = row['Vencimento'].year
        ano_competencia = row['Ano']
        if ano_vencimento < ano_competencia:
            return datetime(ano_competencia, 1, 1)
        elif ano_vencimento > ano_competencia:
            return datetime(ano_competencia, 12, 1)
        else:
            return datetime(ano_vencimento, row['Vencimento'].month, 1)

    df['data_vencimento_ref'] = df.apply(data_vencimento_ref, axis=1)

    def data_pagamento_ref(row):
        if pd.isna(row['DataPagamento']):
            return None
        
        data_pagamento_ajustada = pd.to_datetime(row['DataPagamento'].strftime('%Y-%m-01'))
        data_vencimento_ref = row['data_vencimento_ref']

        if data_pagamento_ajustada < data_vencimento_ref:
            return data_vencimento_ref
        else:
            return data_pagamento_ajustada
        
    df['data_pagamento_ref'] = df.apply(data_pagamento_ref, axis=1)

    df_recebiveis = df.groupby('data_vencimento_ref').agg(recebiveis=('Valor Total', 'sum')).reset_index()
    df_recebiveis['recebiveis acc'] = df_recebiveis['recebiveis'].cumsum()

    df_pagamentos = df.groupby('data_pagamento_ref').agg(pagamentos=('Valor Total', 'sum')).reset_index()
    df_pagamentos['pagamentos acc'] = df_pagamentos['pagamentos'].cumsum()

    df_financ = pd.merge(df_recebiveis, df_pagamentos, left_on='data_vencimento_ref', right_on='data_pagamento_ref', how='outer')
    df_financ['mes operacao'] = df_financ.index + 1

    df_tk = pd.DataFrame({'mes operacao': range(1, 19)})
    df_tk = pd.merge(df_tk, df_financ[['recebiveis', 'recebiveis acc', 'pagamentos', 'pagamentos acc', 'mes operacao']], on='mes operacao', how='left')

    df_tk['recebiveis'] = df_tk['recebiveis'].fillna(0)
    df_tk['recebiveis acc'] = df_tk['recebiveis acc'].fillna(max(df_tk['recebiveis acc']))
    df_tk['pagamentos'] = df_tk['pagamentos'].fillna(0)
    df_tk['pagamentos acc'] = df_tk['pagamentos acc'].fillna(max(df_tk['pagamentos acc']))

    custo_capital_am = 0.015
    tirs_objetivo = [0.00, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06]

    def calcular_exposicao(row, df, exposicao_capital):
        index = row.name

        if row['cash flow acc'] == exposicao_capital:
            return row['cash flow acc']
        elif df.loc[:index, 'cash flow acc'].min() == exposicao_capital:
            return row['cash flow']
        else:
            return 0

    def calcular_aq_capital(row, exposicao_capital, custo_capital_am, df):
        index = row.name

        if row['cash flow acc'] == exposicao_capital:
            return row['cash flow acc'] * custo_capital_am
        elif df.loc[:index, 'cash flow acc'].min() == exposicao_capital:
            return 0
        else:
            return row['cash flow acc'] * custo_capital_am

    def calcular_tir(tk, df_tk):
        df_tk['repasse'] = df_tk['recebiveis'] * (1 - tk)
        df_tk['cash flow'] = df_tk['pagamentos'].shift(1) - df_tk['repasse']
        df_tk.loc[0, 'cash flow'] = -df_tk.loc[0, 'repasse']
        df_tk['cash flow acc'] = df_tk['cash flow'].cumsum()
        exposicao_capital = min(df_tk['cash flow acc'])
        
        df_tk['fluxo exposicao'] = df_tk.apply(calcular_exposicao, axis=1, df=df_tk, exposicao_capital=exposicao_capital)
        df_tk['custo aq. capital'] = df_tk.apply(calcular_aq_capital, axis=1, exposicao_capital=exposicao_capital, custo_capital_am=custo_capital_am, df=df_tk)
        
        df_tk['a'] = np.where(df_tk['fluxo exposicao'] < 0, df_tk['fluxo exposicao'], 0)
        df_tk['b'] = np.where(df_tk['fluxo exposicao'] > 0, df_tk['fluxo exposicao'], 0)
        df_tk.loc[0, 'b'] = df_tk['custo aq. capital'].sum() + df_tk['a'].sum()
        
        flow = df_tk['b'].to_list()
        tir_calculada = npf.irr(flow)
        
        return tir_calculada

    def derivada_tir(tk, df_tk):
        h = 0.04
        tir_mais_h = calcular_tir(tk + h, df_tk)
        tir = calcular_tir(tk, df_tk)
        derivada = (tir_mais_h - tir) / h
        return derivada

    def encontrar_tk(tir_objetivo, df_tk, max_iter=1000, tol=0.001):
        tk = 0.0
        iter_count = 0
        
        while iter_count < max_iter:
            tir_atual = calcular_tir(tk, df_tk)
            erro = tir_atual - tir_objetivo
            
            if abs(erro) < tol:
                return tk
            
            derivada = derivada_tir(tk, df_tk)
            tk = tk - erro / derivada
            
            iter_count += 1
        return tk

    for tir_objetivo in tirs_objetivo:
        tk_encontrado = encontrar_tk(tir_objetivo, df_tk)
        inadim = 1 - (max(df_tk['pagamentos acc']) / max(df_tk['recebiveis acc']))

        df_result = pd.DataFrame({
            'inadim_considerada': [inadim],
            'tk_encontrado': [tk_encontrado],
            'tir_objetivo': [tir_objetivo]
        })
        
        df_final = pd.concat([df_final, df_result], ignore_index=True)

    return df_final

def inadim_flow(file):
    try:
        df = pd.read_excel(file)
    except Exception as err:
        print(err)

    df['Vencimento'] = pd.to_datetime(df['Vencimento'])
    df['DataPagamento'] = pd.to_datetime(df['DataPagamento'])
    df['Valor Total'] = df['Valor Total'].astype(float)
    df['Valor Pago'] = df['Valor Pago'].astype(float)
    df['Ano'] = df['Ano'].astype(int)
    df = df[df['Ano'] == 2023]

    def data_vencimento_ref(row):
        ano_vencimento = row['Vencimento'].year
        ano_competencia = row['Ano']
        if ano_vencimento < ano_competencia:
            return datetime(ano_competencia, 1, 1)
        elif ano_vencimento > ano_competencia:
            return datetime(ano_competencia, 12, 1)
        else:
            return datetime(ano_vencimento, row['Vencimento'].month, 1)

    df['data_vencimento_ref'] = df.apply(data_vencimento_ref, axis=1)

    def data_pagamento_ref(row):
        if pd.isna(row['DataPagamento']):
            return None
        
        data_pagamento_ajustada = pd.to_datetime(row['DataPagamento'].strftime('%Y-%m-01'))
        data_vencimento_ref = row['data_vencimento_ref']

        if data_pagamento_ajustada < data_vencimento_ref:
            return data_vencimento_ref
        else:
            return data_pagamento_ajustada
        
    df['data_pagamento_ref'] = df.apply(data_pagamento_ref, axis=1)

    df_recebiveis = df.groupby('data_vencimento_ref').agg(recebiveis=('Valor Total', 'sum')).reset_index()
    df_recebiveis['recebiveis_acc'] = df_recebiveis['recebiveis'].cumsum()

    df_pagamentos = df.groupby('data_pagamento_ref').agg(pagamentos=('Valor Total', 'sum')).reset_index()
    df_pagamentos['pagamentos_acc'] = df_pagamentos['pagamentos'].cumsum()

    df_financ = pd.merge(df_recebiveis, df_pagamentos, left_on='data_vencimento_ref', right_on='data_pagamento_ref', how='outer')

    df_financ = df_financ.rename(columns={'data_vencimento_ref': 'data_ref'})
    df_financ = df_financ.drop(columns=['data_pagamento_ref'])

    df_financ['recebiveis'] = df_financ['recebiveis'].fillna(0)
    df_financ['recebiveis_acc'] = df_financ['recebiveis_acc'].fillna(max(df_financ['recebiveis_acc']))
    df_financ['data_ref'] = df_financ['data_ref'].fillna(max(df_financ['data_ref']))


    df_financ['inadim_acc'] = df_financ['recebiveis_acc'] - df_financ['pagamentos_acc']
    df_financ['inadim_pct'] = df_financ['inadim_acc']/df_financ['recebiveis_acc']

    df_financ['data_ref'] = df_financ['data_ref'].dt.strftime("%m/%Y")
    return df_financ

def roll(file):
    try:
        df = pd.read_excel(file)
    except Exception as err:
        print(err)

    df['Vencimento'] = pd.to_datetime(df['Vencimento'])
    df['DataPagamento'] = pd.to_datetime(df['DataPagamento'])
    df['Valor Total'] = df['Valor Total'].astype(float)
    df['Valor Pago'] = df['Valor Pago'].astype(float)
    df['Desconto'] = df['Desconto'].astype(float)
    df['totalcomdesconto'] = df['Valor Total'] - df['Desconto']
    df['Ano'] = df['Ano'].astype(int)

    def data_vencimento_ref(row):
        ano_vencimento = row['Vencimento'].year
        ano_competencia = row['Ano']
        if ano_vencimento < ano_competencia:
            return datetime(ano_competencia, 1, 1)
        elif ano_vencimento > ano_competencia:
            return datetime(ano_competencia, 12, 1)
        else:
            return datetime(ano_vencimento, row['Vencimento'].month, 1)
        
    df['data_ref'] = df.apply(data_vencimento_ref, axis=1)

    conditions = [
    df['DataPagamento'].notna(),
    df['DataPagamento'].isna()
    ]
    choices = [
        (df['DataPagamento'] - df['Vencimento']).dt.days,
        (datetime.now().date() - df['Vencimento'].dt.date).apply(lambda x: x.days)
    ]
    df['atraso'] = np.select(conditions, choices, default='No data')
    df['atraso'] = df['atraso'].astype(float)

    def calculate_inadim(df, atraso):
        datavencimento_com_atraso = df['Vencimento'] + timedelta(days=atraso)

        tpv_vencido = df[(df['Vencimento'] < datetime.now())]
        tpv_vencido = tpv_vencido['totalcomdesconto'].sum()

        tpv_inadimplente = df[
            (df['Vencimento'] < datetime.now()) &
            ((df['DataPagamento'].isna()) | (df['DataPagamento'] > datavencimento_com_atraso)) &
            (df['atraso'] >= atraso)
        ]
        
        tpv_inadimplente = tpv_inadimplente['totalcomdesconto'].sum()
        
        inadimplencia = tpv_inadimplente / tpv_vencido

        return inadimplencia

    result_rolagem = df.groupby('data_ref').agg(
        recebiveis=('totalcomdesconto', 'sum'),
        d0=('totalcomdesconto', lambda x: calculate_inadim(df.loc[x.index], 0)),
        d30=('totalcomdesconto', lambda x: calculate_inadim(df.loc[x.index], 30)),
        d60=('totalcomdesconto', lambda x: calculate_inadim(df.loc[x.index], 60)),
        d90=('totalcomdesconto', lambda x: calculate_inadim(df.loc[x.index], 90)),
        d120=('totalcomdesconto', lambda x: calculate_inadim(df.loc[x.index], 120)),
    ).reset_index()

    result_rolagem = result_rolagem[result_rolagem['data_ref'].dt.date < datetime.now().date().replace(day=1)]
    result_rolagem = result_rolagem.tail(15)

    colunas_para_formatar = ['d0', 'd30', 'd60', 'd90', 'd120']
    for coluna in colunas_para_formatar:
        result_rolagem[coluna] = np.where(result_rolagem[coluna] == 0, "-", (round(result_rolagem[coluna] * 100, 1)).astype(str) + "%")

    result_rolagem['data_ref'] = result_rolagem['data_ref'].dt.strftime("%m/%Y")
    return result_rolagem
