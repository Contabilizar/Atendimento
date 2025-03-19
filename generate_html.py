import json
import os
import re

# Caminhos relativos na mesma pasta
data_json_path = os.path.join(os.path.dirname(__file__), 'data.json')
empresas_dir = os.path.dirname(__file__)

# Ler o data.json
with open(data_json_path, encoding='utf-8') as jsonfile:
    companies = json.load(jsonfile)

# CSS embutido
css = '''
<style>
  :root {
    --primary: #000051;
    --secondary: #e5e5e5;
    --bg-light: #ffffff;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
    --spacing-unit: 1rem;
    --border-radius: 1.5rem;
    --header-height: 80px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: var(--bg-light); color: var(--primary); line-height: 1.6; padding-top: var(--header-height); }
  .header { position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; background: var(--primary); min-height: var(--header-height); border-bottom: 2px solid var(--bg-light); box-shadow: var(--shadow); display: flex; align-items: center; }
  .header-content { max-width: 1200px; margin: 0 auto; padding: 0 calc(var(--spacing-unit) * 1); display: flex; align-items: center; justify-content: center; width: 100%; }
  .logo { max-height: 60px; width: auto; object-fit: contain; }
  .container { max-width: 1200px; margin: 0 auto; padding: calc(var(--spacing-unit) * 4); }
  .title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: calc(var(--spacing-unit) * 1); background: linear-gradient(90deg, var(--primary), #003087); -webkit-background-clip: text; color: transparent; }
  .subtitle { font-size: 1.25rem; text-align: center; color: #4b5563; margin-bottom: calc(var(--spacing-unit) * 3); }
  .departments-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: calc(var(--spacing-unit) * 2); }
  .card { position: relative; width: 100%; height: 350px; perspective: 1000px; }
  .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
  .card:hover .card-inner { transform: rotateY(180deg); }
  .card-front, .card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; padding: calc(var(--spacing-unit) * 2); background: var(--bg-light); border-radius: var(--border-radius); box-shadow: var(--shadow); text-align: center; }
  .card-back { transform: rotateY(180deg); background: var(--primary); color: #ffffff; display: flex; flex-direction: column; justify-content: center; }
  .card-front .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 0 auto calc(var(--spacing-unit) * 1); display: block; border: 3px solid var(--primary); }
  .card-front h2 { font-size: 1.2rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .card-front .person { font-size: 1.25rem; color: #4b5563; margin-bottom: calc(var(--spacing-unit) * 0.5); }
  .card-front .contact, .card-back .contact { font-size: 0.9rem; margin: calc(var(--spacing-unit) * 0.5) 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .card-front .contact { color: #6b7280; } /* Apenas texto na frente, sem link */
  .card-back .contact a { color: #ffffff; text-decoration: none; }
  .card-back .contact a:hover { text-decoration: underline; }
  .card-back .description { font-size: 0.9rem; margin: calc(var(--spacing-unit) * 1) 0; padding: 0 calc(var(--spacing-unit) * 1); }
  .footer { text-align: center; font-size: 0.9rem; color: #6b7280; padding: calc(var(--spacing-unit) * 1); margin-top: calc(var(--spacing-unit) * 3); }
</style>
'''

# Função para limpar nomes de arquivos
def sanitize_filename(name):
    name = re.sub(r'[<>:"/\\|?*\n\r]', '', name)  # Remove caracteres inválidos
    name = name.strip()  # Remove espaços extras
    name = re.sub(r'\s+', '-', name)  # Substitui espaços por hífens
    return name[:100]

# Descrições e ícones dos departamentos
department_descriptions = {
    "Departamento Pessoal": {"description": "Departamento responsável pela gestão das rotinas trabalhistas, incluem mas não se limita a admissão e demissão de funcionários, processamento da folha de pagamento, cálculo de encargos sociais, apuração de impostos como FGTS, INSS e IRRF, e atendimento às obrigações acessórias.", "icon": "fa-users"},
    "Departamento Fiscal": {"description": "Departamento encarregado do cálculo de impostos e entrega de declarações fiscais, suporte na emissão de notas fiscais e garantia de conformidade com as normas tributárias vigentes.", "icon": "fa-file-invoice"},
    "Departamento Contábil": {"description": "Departamento responsável por manter a contabilidade atualizada, elaborar balanços patrimoniais e produzir relatórios financeiros detalhados para suporte à gestão.", "icon": "fa-calculator"},
    "Departamento Financeiro": {"description": "Departamento dedicado ao envio de honorários, assegurando a comunicação eficiente e o cumprimento pontual das obrigações financeiras com os clientes.", "icon": "fa-money-bill-wave"},
    "Recepcionista": {"description": "Responsável por acolher os clientes, coordenar atendimentos e realizar agendamentos com organização e cordialidade.", "icon": "fa-concierge-bell"},
    "Departamento Paralegal": {"description": "Departamento responsável por gerenciar processos legais, viabilizando o funcionamento da empresa por meio de alvarás municipais, licenças dos bombeiros e outros documentos necessários.", "icon": "fa-balance-scale"}
}

# Garante que a pasta esteja correta
os.makedirs(empresas_dir, exist_ok=True)

# Gerar HTML para cada empresa
for company in companies:
    departments_html = ''
    for dept in company["departamentos"]:
        whatsapp_number = dept["phone"].replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
        photo_src = dept["photo"] if dept["photo"] else 'default_photo.jpg'
        dept_info = department_descriptions.get(dept["name"], {"description": "Atendimento e suporte para a empresa.", "icon": "fa-headset"})
        description = dept_info["description"]
        icon = dept["icon"] if dept["icon"] else dept_info["icon"]
        departments_html += f'''
          <div class="card">
            <div class="card-inner">
              <div class="card-front">
                <img src="{photo_src}" alt="Foto de {dept['person']}" class="photo">
                <h2><i class="fas {icon}"></i> {dept['name']}</h2>
                <p class="person">{dept['person']}</p>
                <p class="contact"><i class="fas fa-envelope"></i> {dept['email']}</p>
                <p class="contact"><i class="fab fa-whatsapp"></i> {dept['phone']}</p>
              </div>
              <div class="card-back">
                <p class="description">{description}</p>
                <p class="contact"><i class="fas fa-envelope"></i> <a href="mailto:{dept['email']}">{dept['email']}</a></p>
                <p class="contact"><i class="fab fa-whatsapp"></i> <a href="https://wa.me/55{whatsapp_number}" target="_blank">{dept['phone']}</a></p>
              </div>
            </div>
          </div>
        '''

    # URL da página da empresa (sem uso agora, mas mantida por consistência)
    company_filename = sanitize_filename(company["empresa"])
    company_url = f"https://contabilizar.github.io/Atendimento/{company_filename}.html"

    html = f'''
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{company["empresa"]} - Atendimento</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/brands.min.css">
      {css}
    </head>
    <body>
      <header class="header">
        <div class="header-content">
          <img src="logo.png" alt="Logo Contabilizar" class="logo" />
        </div>
      </header>
      <div class="container">
        <h1 class="title">Bem-vindo(a) ao Atendimento Contabilizar</h1>
        <p class="subtitle">Segue abaixo o contato dos atendentes para {company["empresa"]}.</p>
        <section class="departments-grid">
          {departments_html}
        </section>
      </div>
      <footer class="footer">
        <p>© 2025 Contabilizar. Todos os direitos reservados.</p>
      </footer>
    </body>
    </html>
    '''
    filename = os.path.join(empresas_dir, f'{company_filename}.html')
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Gerado: {filename}")