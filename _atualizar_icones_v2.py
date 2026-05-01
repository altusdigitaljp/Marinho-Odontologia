"""Substitui SVGs antigos por ícones profissionais do Tabler."""
import os
import re
from pathlib import Path

os.chdir(r'C:\Users\Patrick Alves\Downloads\Claude code\Projetos\marinho-odontologia')

# SVGs profissionais do Tabler Icons (MIT licensed)
# Path simplificado (só o conteúdo do <svg>) — o atributo viewBox e estilos vêm do CSS
TABLER = {
    'dental': '<path d="M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5"/><path d="M12 5.5l3 1.5"/>',
    'mood-smile': '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 10l.01 0"/><path d="M15 10l.01 0"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>',
    'braces': '<path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2"/><path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2"/>',
    'user-heart': '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h.5"/><path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296"/>',
    'vaccine': '<path d="M17 3l4 4"/><path d="M19 5l-4.5 4.5"/><path d="M11.5 6.5l6 6"/><path d="M16.5 11.5l-6.5 6.5h-4v-4l6.5 -6.5"/><path d="M7.5 12.5l1.5 1.5"/><path d="M10.5 9.5l1.5 1.5"/><path d="M3 21l3 -3"/>',
    'first-aid-kit': '<path d="M8 8v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"/><path d="M4 10a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -8"/><path d="M10 14h4"/><path d="M12 12v4"/>',
    'heartbeat': '<path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572"/><path d="M3 13h2l2 3l2 -6l1 3h3"/>',
    'stethoscope': '<path d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1"/><path d="M8 15a6 6 0 1 0 12 0v-3"/><path d="M11 3v2"/><path d="M6 3v2"/><path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>',
}

def svg(name):
    """Retorna um SVG completo pronto pra inline."""
    return f'<svg viewBox="0 0 24 24" aria-hidden="true">{TABLER[name]}</svg>'

# Mapeamento Especialidade -> ícone profissional
ESPECIALIDADE_ICONE = {
    'Implantodontia': svg('dental'),
    'Estética dental': svg('mood-smile'),
    'Ortodontia': svg('braces'),
    'Odontopediatria': svg('user-heart'),
    'Canal': svg('vaccine'),
    'Cirurgia oral': svg('first-aid-kit'),
    'Emergência': svg('heartbeat'),
    'Periodontia': svg('stethoscope'),
}

# Pattern atual: <div class="especialidade"><span class="icone-svg">...</span>NOME</div>
# Precisamos substituir o conteúdo de icone-svg pelo novo
PATTERN = re.compile(
    r'(<div class="especialidade"><span class="icone-svg">)(.*?)(</span>)([^<]+)(</div>)',
    re.DOTALL
)

def substituir(match):
    pre, _antigo, mid, nome, end = match.groups()
    nome_clean = nome.strip()
    novo_svg = ESPECIALIDADE_ICONE.get(nome_clean)
    if not novo_svg:
        return match.group(0)
    return f'{pre}{novo_svg}{mid}{nome}{end}'

for u in ['mangabeira', 'epitacio', 'geisel', 'centro', 'campina-grande']:
    arq = Path(f'institucional/{u}/index.html')
    content = arq.read_text(encoding='utf-8')
    novo = PATTERN.sub(substituir, content)
    if novo != content:
        arq.write_text(novo, encoding='utf-8')
        print(f'OK {arq}')
    else:
        print(f'SEM_MUDANCA {arq}')
