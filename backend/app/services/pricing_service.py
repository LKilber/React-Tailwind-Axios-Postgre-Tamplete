from scripts.pricing import pricing, inadim_flow, roll

def process_pricing_file(file):
    df_pricing = pricing(file)
    df_inadim_flow = inadim_flow(file)
    df_roll = roll(file)

    json_pricing = df_pricing.to_dict(orient='records')
    json_inadim_flow = df_inadim_flow.to_dict(orient='records')
    json_roll = df_roll.to_dict(orient='records')

    return {'pricing': json_pricing, 'inadim_flow': json_inadim_flow, 'roll': json_roll, 'status': 'success'}
