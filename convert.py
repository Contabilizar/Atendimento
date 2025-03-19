import csv
import json
import os

# Caminho relativo para relatorio.csv e data.json na mesma pasta
csv_path = os.path.join(os.path.dirname(__file__), 'relatorio.csv')
json_path = os.path.join(os.path.dirname(__file__), 'data.json')

# Função para tentar abrir o CSV com diferentes codificações
def open_csv_with_encoding(file_path):
    encodings = ['utf-8', 'iso-8859-1', 'windows-1252']  # Lista de codificações a tentar
    for encoding in encodings:
        try:
            with open(file_path, newline='', encoding=encoding) as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                return list(reader)  # Retorna a lista de linhas se funcionar
        except UnicodeDecodeError:
            continue
    raise Exception("Não foi possível decodificar o arquivo com as codificações testadas.")

# Ler o CSV e organizar por empresa
companies = {}
rows = open_csv_with_encoding(csv_path)
for row in rows:
    empresa = row['Empresa']
    if empresa not in companies:
        companies[empresa] = {"empresa": empresa, "departamentos": []}
    dept = {
        "name": row['Departamento'],
        "person": row[' Resp.'],
        "email": row['Email'],
        "phone": row['Telefone'],
        "icon": row['Icone'],
        "photo": row['Photo']
    }
    companies[empresa]["departamentos"].append(dept)

# Converter para lista e salvar como JSON
company_list = list(companies.values())
with open(json_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(company_list, jsonfile, ensure_ascii=False, indent=2)

print(f"Arquivo {json_path} gerado com sucesso!")