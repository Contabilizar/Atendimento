import json
import os
import re

# Caminhos relativos
data_json_path = os.path.join(os.path.dirname(__file__), '../site/data.json')
fotos_dir = os.path.join(os.path.dirname(__file__), '../fotos')
empresas_dir = os.path.join(os.path.dirname(__file__), '../empresas')

# Ler o data.json
with open(data_json_path, encoding='utf-8') as jsonfile:
    companies = json.load(jsonfile)

# CSS embutido, incluindo estilos do carrossel
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
  .container { max-width: 800px; margin: 0 auto; padding: calc(var(--spacing-unit) * 4); }
  .welcome { font-size: 1.5rem; font-weight: 400; text-align: center; color: #6b7280; margin-bottom: calc(var(--spacing-unit) * 1); }
  .title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: calc(var(--spacing-unit) * 2); background: linear-gradient(90deg, var(--primary), #003087); -webkit-background-clip: text; color: transparent; }
  .carousel { perspective: 1200px; width: 100%; max-width: 600px; margin: 0 auto; }
  .card { width: 100%; padding: calc(var(--spacing-unit) * 2); background: var(--bg-light); border-radius: var(--border-radius); box-shadow: var(--shadow); text-align: center; }
  .card .photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto calc(var(--spacing-unit) * 1.5); display: block; border: 3px solid var(--primary); }
  .card h2 { font-size: 1.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem; color: var(--primary); }
  .card .person { font-size: 1.25rem; color: #4b5563; margin-bottom: calc(var(--spacing-unit) * 1); }
  .card .contact { font-size: 1rem; color: #6b7280; margin: calc(var(--spacing-unit) * 0.5) 0; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
  .card .contact a { color: inherit; text-decoration: none; }
  .card .contact:hover { color: var(--secondary); }
  .card.slide-in { animation: slideIn 0.6s ease forwards; }
  .card.slide-out { animation: slideOut 0.6s ease forwards; }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(100px) rotateY(-15deg) scale(0.95); }
    to { opacity: 1; transform: translateX(0) rotateY(0) scale(1); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0) rotateY(0) scale(1); }
    to { opacity: 0; transform: translateX(-100px) rotateY(15deg) scale(0.95); }
  }
  .navigation { display: flex; align-items: center; justify-content: center; gap: calc(var(--spacing-unit) * 2); margin-top: calc(var(--spacing-unit) * 2); }
  .btn { width: 60px; height: 60px; border: none; background: var(--primary); color: var(--bg-light); border-radius: 50%; cursor: pointer; display: grid; place-items: center; transition: var(--transition); box-shadow: var(--shadow); }
  .btn:hover { background: var(--secondary); color: var(--primary); transform: scale(1.1); }
  .btn i { font-size: 1.75rem; }
  .dots { display: flex; gap: 0.75rem; }
  .dot { width: 12px; height: 12px; background: var(--secondary); border-radius: 50%; cursor: pointer; transition: var(--transition); border: 2px solid var(--primary); }
  .dot.active { background: var(--primary); transform: scale(1.2); }
  .dot:hover { background: var(--primary); }
  .footer { text-align: center; font-size: 0.9rem; color: #6b7280; padding: calc(var(--spacing-unit) * 1); }
</style>
'''

# Função para limpar nomes de arquivos
def sanitize_filename(name):
    name = re.sub(r'[<>:"/\\|?*\n\r]', '', name)
    name = name.strip()
    name = re.sub(r'\s+', '-', name)
    return name[:100]

# Garante que a pasta empresas/ exista
os.makedirs(empresas_dir, exist_ok=True)

# Gerar HTML para cada empresa
for company in companies:
    # Converte departamentos para string JSON para uso no JavaScript
    departments_json = json.dumps(company["departamentos"], ensure_ascii=False)

    html = f'''
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{company["empresa"]}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/brands.min.css">
      {css}
    </head>
    <body>
      <header class="header">
        <div class="header-content">
          <img src="../fotos/logo.png" alt="Logo Contabilizar" class="logo" />
        </div>
      </header>
      <div class="container">
        <p class="welcome">Bem-vindo(a) à</p>
        <h1 class="title">{company["empresa"]}</h1>
        <section class="carousel" aria-label="Carrossel de departamentos">
          <div id="slide" class="card">
            <div class="card-content" role="region" aria-live="polite">
              <!-- Conteúdo preenchido pelo JS -->
            </div>
          </div>
        </section>
        <nav class="navigation">
          <button id="prev-btn" class="btn" aria-label="Departamento anterior">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div id="dots" class="dots" role="tablist"></div>
          <button id="next-btn" class="btn" aria-label="Próximo departamento">
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
      <footer class="footer">
        <p>© 2025 Contabilizar. Todos os direitos reservados.</p>
      </footer>
      <script>
        const departments = {departments_json};

        class Carousel {{
          constructor() {{
            this.index = 0;
            this.slideElement = document.getElementById('slide');
            this.cardContent = this.slideElement.querySelector('.card-content');
            this.prevBtn = document.getElementById('prev-btn');
            this.nextBtn = document.getElementById('next-btn');
            this.dotsContainer = document.getElementById('dots');
            this.dots = [];
            this.init();
          }}

          createDots() {{
            departments.forEach((_, i) => {{
              const dot = document.createElement('div');
              dot.classList.add('dot');
              dot.setAttribute('role', 'tab');
              dot.setAttribute('aria-label', `Departamento ${{departments[i].name}}`);
              dot.addEventListener('click', () => this.goToSlide(i));
              this.dotsContainer.appendChild(dot);
              this.dots.push(dot);
            }});
            this.updateDots();
          }}

          updateDots() {{
            this.dots.forEach((dot, i) => {{
              dot.classList.toggle('active', i === this.index);
              dot.setAttribute('aria-selected', i === this.index);
            }});
          }}

          formatWhatsAppNumber(phone) {{
            return phone.replace(/[^\d]/g, '');
          }}

          updateSlide() {{
            const dept = departments[this.index];
            const whatsappNumber = this.formatWhatsAppNumber(dept.phone);
            const photoSrc = dept.photo ? `../fotos/${{dept.photo}}` : '../fotos/default_photo.jpg';
            this.cardContent.innerHTML = `
              <img src="${{photoSrc}}" alt="Foto de ${{dept.person}}" class="photo">
              <h2><i class="fas ${{dept.icon}}"></i> ${{dept.name}}</h2>
              <p class="person">${{dept.person}}</p>
              <p class="contact"><i class="fas fa-envelope"></i> <a href="mailto:${{dept.email}}">${{dept.email}}</a></p>
              <p class="contact"><i class="fab fa-whatsapp"></i> <a href="https://wa.me/55${{whatsappNumber}}" target="_blank">${{dept.phone}}</a></p>
            `;
            this.slideElement.classList.remove('slide-out', 'slide-in');
            void this.slideElement.offsetWidth;
            this.slideElement.classList.add('slide-in');
            this.updateDots();
          }}

          animateSlide(direction) {{
            this.slideElement.classList.remove('slide-in');
            this.slideElement.classList.add('slide-out');
            
            setTimeout(() => {{
              this.index = direction === 'next' 
                ? (this.index + 1) % departments.length 
                : (this.index - 1 + departments.length) % departments.length;
              this.updateSlide();
            }}, 600);
          }}

          goToSlide(newIndex) {{
            if (newIndex !== this.index) {{
              this.animateSlide(newIndex > this.index ? 'next' : 'prev');
            }}
          }}

          init() {{
            this.createDots();
            this.updateSlide();
            this.prevBtn.addEventListener('click', () => this.animateSlide('prev'));
            this.nextBtn.addEventListener('click', () => this.animateSlide('next'));
            
            document.addEventListener('keydown', (e) => {{
              if (e.key === 'ArrowLeft') this.animateSlide('prev');
              if (e.key === 'ArrowRight') this.animateSlide('next');
            }});
            
            let touchStartX = 0;
            this.slideElement.addEventListener('touchstart', (e) => {{
              touchStartX = e.touches[0].clientX;
            }});
            this.slideElement.addEventListener('touchend', (e) => {{
              const touchEndX = e.changedTouches[0].clientX;
              if (touchStartX - touchEndX > 50) this.animateSlide('next');
              if (touchEndX - touchStartX > 50) this.animateSlide('prev');
            }});
          }}
        }}

        document.addEventListener('DOMContentLoaded', () => {{
          new Carousel();
        }});
      </script>
    </body>
    </html>
    '''
    filename = os.path.join(empresas_dir, f'{sanitize_filename(company["empresa"])}.html')
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Gerado: {filename}")