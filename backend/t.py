from werkzeug.security import generate_password_hash

# Gerar o hash da senha '1234'
hashed_password = generate_password_hash('1234')

print(hashed_password)