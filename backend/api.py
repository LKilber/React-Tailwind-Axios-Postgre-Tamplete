from app import create_app

app = create_app()

with app.app_context():
    print("Listing all routes:")
    for rule in app.url_map.iter_rules():
        methods = ', '.join(rule.methods)
        print(f"{rule.endpoint}: {rule} [{methods}]")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)