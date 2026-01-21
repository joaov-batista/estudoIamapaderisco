// --- CONFIGURAÇÃO DA IA ---
// Sua chave de API
const API_KEY = "AIzaSyB5Z3qufMesqlNhWLWNKL8NDHbmDHqk3JM";

// --- VARIÁVEIS GLOBAIS ---
let userXP = 0;
let currentQuestionIndex = 0;
let score = 0;

// --- DADOS DA TABELA DE RISCOS (NR-5) ---
const riskTableData = [
    { color: 'var(--risk-green)', name: 'Grupo 1 - Físico', ex: 'Ruído, Calor, Vibração' },
    { color: 'var(--risk-red)', name: 'Grupo 2 - Químico', ex: 'Poeiras, Vapores, Gases' },
    { color: 'var(--risk-brown)', name: 'Grupo 3 - Biológico', ex: 'Vírus, Bactérias, Fungos' },
    { color: 'var(--risk-yellow)', name: 'Grupo 4 - Ergonômico', ex: 'Postura inadequada, Esforço físico' },
    { color: 'var(--risk-blue)', name: 'Grupo 5 - Acidentes', ex: 'Arranjo físico, Eletricidade, Máquinas sem proteção' }
];

// --- DADOS: ITENS DO LABORATÓRIO ---
// Uso de crase (`) para evitar erros com aspas no HTML interno
const labItemsData = [
    { 
        name: "Capela de Exaustão", 
        icon: "ph-wind", 
        desc: `<strong>Risco Químico/Acidente:</strong> No estudo de caso, foi encontrada sendo usada como armário de reagentes. Isso é inadequado, pois impede a exaustão de gases e gera risco de explosão.` 
    },
    { 
        name: "Pia e Destilador", 
        icon: "ph-drop", 
        desc: `<strong>Risco Biológico:</strong> Lixo armazenado embaixo da pia causa fungos/bactérias. <strong>Risco Químico:</strong> Armazenamento de rejeitos químicos na pia.` 
    },
    { 
        name: "Extintor", 
        icon: "ph-fire-extinguisher", 
        desc: `<strong>Risco de Acidente:</strong> O extintor estava posicionado incorretamente "embaixo da bancada" e longe da saída, dificultando o acesso em emergências (Violação da NR-23).` 
    },
    { 
        name: "Armário de Ácidos", 
        icon: "ph-warning-octagon", 
        desc: `<strong>Risco Químico:</strong> Ácidos liberam vapores (gases) que corroem dobradiças e rótulos se não houver ventilação adequada.` 
    },
    { 
        name: "Bancada Central", 
        icon: "ph-table", 
        desc: `<strong>Risco Ergonômico:</strong> Altura inadequada exige postura incorreta do trabalhador, causando dores e LER/DORT.` 
    },
    { 
        name: "Quadro Negro", 
        icon: "ph-chalkboard", 
        desc: `<strong>Risco Químico:</strong> O uso de giz gera poeira mineral suspensa no ar, prejudicial à respiração.` 
    },
    { 
        name: "Fiação Elétrica", 
        icon: "ph-plugs", 
        desc: `<strong>Risco de Acidente:</strong> Fios soltos sem isolamento em máquinas geram risco grave de choque elétrico e incêndio.` 
    },
    { 
        name: "Ferramentas", 
        icon: "ph-wrench", 
        desc: `<strong>Risco de Acidente:</strong> Ferramentas manuais inadequadas ou defeituosas aumentam a chance de lesões.` 
    }
];

// --- DADOS: QUIZ ---
const quizQuestions = [
    { q: "Segundo a NR-5 e padronização, qual cor representa Riscos Físicos?", a: ["Verde", "Vermelho", "Amarelo", "Azul"], c: 0, info: "Verde é a cor para riscos físicos como ruído e calor." },
    { q: "Vírus, bactérias e fungos pertencem a qual grupo de risco?", a: ["Químico", "Biológico", "Físico", "Acidente"], c: 1, info: "Grupo 3 - Riscos Biológicos (Cor Marrom)." },
    { q: "Onde se enquadra 'Esforço físico intenso' e 'Postura incorreta'?", a: ["Acidente", "Ergonômico", "Físico", "Biológico"], c: 1, info: "Grupo 4 - Riscos Ergonômicos (Amarelo)." },
    { q: "No estudo de caso, qual risco foi mais frequente no laboratório?", a: ["Ergonômico", "Químico", "Físico", "Biológico"], c: 1, info: "O risco Químico foi o mais encontrado (25%), seguido do Ergonômico." },
    { q: "Qual o problema identificado na 'Capela' do laboratório do estudo?", a: ["Barulho excessivo", "Usada como depósito de reagentes", "Vidro quebrado", "Sem luz"], c: 1, info: "Usar a capela para guardar reagentes é inadequado e perigoso." },
    { q: "O extintor estava posicionado incorretamente onde?", a: ["No teto", "Embaixo da bancada lateral", "Fora da sala", "Na porta"], c: 1, info: "Estava obstruído sob a bancada, violando a NR-23." },
    { q: "O que indica o tamanho do círculo no Mapa de Risco?", a: ["Tipo de risco", "Intensidade do risco", "Tamanho da sala", "Número de pessoas"], c: 1, info: "Círculos representam a intensidade: Pequeno, Médio, Grande." },
    { q: "Fios desencapados e eletricidade são risco de:", a: ["Químico", "Ergonômico", "Acidente", "Físico"], c: 2, info: "Eletricidade é classificada como Risco de Acidente (Azul)." },
    { q: "Poeira de giz no quadro negro é classificada como:", a: ["Físico", "Químico", "Biológico", "Ergonômico"], c: 1, info: "Poeiras são classificadas como Riscos Químicos." },
    { q: "Umidade nas paredes é classificada como risco:", a: ["Químico", "Físico", "Acidente", "Biológico"], c: 1, info: "Umidade é considerada Risco Físico no questionário." },
    { q: "Monotonia e repetitividade pertencem a qual grupo?", a: ["Ergonômico", "Social", "Físico", "Acidente"], c: 0, info: "Fatores psicofisiológicos como monotonia são Riscos Ergonômicos." },
    { q: "Animais peçonhentos representam risco de:", a: ["Biológico", "Acidente", "Químico", "Físico"], c: 1, info: "Animais peçonhentos entram no grupo de Acidentes (Azul)." },
    { q: "Qual a medida de controle mais eficaz na hierarquia?", a: ["Uso de EPI", "Eliminação do Risco", "Sinalização", "EPC"], c: 1, info: "Eliminar o risco é sempre a primeira e mais eficaz medida." },
    { q: "Ferramentas defeituosas são risco de:", a: ["Acidente", "Ergonômico", "Físico", "Químico"], c: 0, info: "Ferramentas inadequadas aumentam o risco de acidentes." },
    { q: "Vibrações de equipamentos são risco:", a: ["Físico", "Ergonômico", "Acidente", "Químico"], c: 0, info: "Vibração é um agente físico (Grupo 1)." },
    { q: "Odores ácidos fortes e gases indicam risco:", a: ["Biológico", "Químico", "Físico", "Ergonômico"], c: 1, info: "Gases e vapores são agentes químicos." },
    { q: "Iluminação inadequada é risco de:", a: ["Acidente", "Químico", "Biológico", "Físico"], c: 0, info: "Iluminação ruim propicia acidentes." },
    { q: "Qual NR trata da CIPA e elaboração do Mapa de Risco?", a: ["NR-6", "NR-5", "NR-10", "NR-35"], c: 1, info: "NR-5 regulamenta a Comissão Interna de Prevenção de Acidentes." },
    { q: "Arranjo físico inadequado (corredores bloqueados) é risco:", a: ["Ergonômico", "Acidente", "Físico", "Químico"], c: 1, info: "Obstruções causam quedas e batidas (Acidente)." },
    { q: "Qual NR padroniza as cores de segurança?", a: ["NR-26", "NR-5", "NR-12", "NR-1"], c: 0, info: "NR-26 define a Sinalização de Segurança e cores." }
];

// --- INICIALIZAÇÃO DO DOM ---
document.addEventListener('DOMContentLoaded', () => {
    renderRiskTable();
    loadLabItems();
    
    // Configurar envio com tecla Enter
    const inputElement = document.getElementById('userInput');
    if (inputElement) {
        inputElement.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') falarComIA();
        });
    }
});

// --- SISTEMA DE NAVEGAÇÃO (SPA) ---
function navTo(id) {
    // Esconder todas as seções
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    
    // Mostrar a seção desejada
    const targetSection = document.getElementById(id);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar menu
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    
    // Encontrar o botão correspondente e ativar
    const buttons = document.querySelectorAll('nav button');
    buttons.forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(id)) {
            btn.classList.add('active');
        }
    });
    
    // Iniciar Quiz se for a seção correta e primeira vez
    if (id === 'quiz-section' && currentQuestionIndex === 0 && score === 0) {
        startQuiz();
    }
}

// --- SISTEMA DE XP ---
function addXP(amount) {
    userXP += amount;
    const xpDisplay = document.getElementById('xpDisplay');
    if (xpDisplay) {
        xpDisplay.innerText = `${userXP} XP`;
    }
}

// --- RENDERIZAÇÃO: TEORIA E RISCOS ---
function renderRiskTable() {
    const container = document.getElementById('riskTable');
    if (!container) return;

    container.innerHTML = ''; // Limpar
    riskTableData.forEach(r => {
        container.innerHTML += `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px; background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; border-left:4px solid ${r.color}">
                <strong style="color:${r.color}">${r.name}</strong>
                <span class="text-sm">${r.ex}</span>
            </div>`;
    });
}

function showTheoryInfo(type) {
    const box = document.getElementById('theoryDetail');
    if (!box) return;

    box.classList.remove('hidden');
    
    const msgs = {
        eliminar: "Solução definitiva. Ex: Parar de usar benzeno (cancerígeno).",
        substituir: "Ex: Trocar tinta com solvente por tinta à base de água.",
        engenharia: "Ex: Usar capela de exaustão, enclausuramento de motor, barreiras.",
        adm: "Ex: Treinamento, redução da jornada, sinalização de segurança.",
        epi: "Medida provisória ou complementar. Ex: Óculos, luvas, respiradores."
    };
    
    box.innerHTML = `<strong>Detalhe:</strong> ${msgs[type] || "Selecione uma opção."}`;
}

// --- RENDERIZAÇÃO: LABORATÓRIO ---
function loadLabItems() {
    const grid = document.getElementById('labGrid');
    if (!grid) return;

    grid.innerHTML = ''; // Limpar antes de popular
    labItemsData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'lab-item';
        div.innerHTML = `<i class="ph ${item.icon}"></i><strong>${item.name}</strong>`;
        div.onclick = () => {
            const detail = document.getElementById('labDetail');
            if (detail) {
                detail.classList.remove('hidden');
                detail.innerHTML = `
                    <h3 style="color:var(--primary)"><i class="ph ${item.icon}"></i> ${item.name}</h3>
                    <p>${item.desc}</p>
                    <button class="btn-primary" style="margin-top:10px; width:auto; padding:8px 16px" onclick="this.parentElement.classList.add('hidden')">Fechar Detalhes</button>
                `;
            }
        };
        grid.appendChild(div);
    });
}

// --- LÓGICA: IA REAL (GEMINI) ---
async function falarComIA() {
    const input = document.getElementById('userInput');
    if (!input) return;

    const textoUsuario = input.value;
    if (!textoUsuario.trim()) return;

    // Adiciona mensagem do usuário
    addUserMsg(textoUsuario);
    input.value = '';
    
    // Adiciona loading
    const loadingId = addBotMsg("🔍 <em>Consultando base de dados da NR-5 e NR-26...</em>");

    // Prompt de Engenharia para a IA
    const promptEngenheiro = `
    Atue como um Engenheiro de Segurança do Trabalho Sênior. O usuário descreverá uma situação de laboratório.
    
    Baseado estritamente na NR-5 (Mapa de Risco) e NR-26 (Sinalização):
    1. Identifique o GRUPO DE RISCO (Físico, Químico, Biológico, Ergonômico ou Acidente).
    2. Defina a INTENSIDADE provável (Pequeno, Médio, Grande) justificando com a gravidade.
    3. Recomende uma ação corretiva imediata.
    
    Seja didático e direto. Use formatação HTML simples (<b>, <br>).
    
    Situação relatada: "${textoUsuario}"
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptEngenheiro }] }]
            })
        });

        const data = await response.json();
        
        // Remove mensagem de loading
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        if (data.candidates && data.candidates[0].content) {
            const respostaIA = data.candidates[0].content.parts[0].text;
            addBotMsg(respostaIA);
            addXP(15); 
        } else {
            addBotMsg("⚠️ Erro na resposta da IA. Tente novamente.");
        }

    } catch (error) {
        console.error("Erro API:", error);
        // Remove loading se houver erro
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();
        addBotMsg("❌ Erro de conexão com a API.");
    }
}

function addBotMsg(htmlText) {
    const win = document.getElementById('chatWindow');
    if (!win) return;

    const msgId = 'msg-' + Date.now();
    win.innerHTML += `
        <div class="msg bot" id="${msgId}">
            <div class="avatar">🤖</div>
            <div class="bubble">${htmlText}</div>
        </div>`;
    win.scrollTop = win.scrollHeight;
    return msgId; // Retorna ID para poder remover se for loading
}

function addUserMsg(text) {
    const win = document.getElementById('chatWindow');
    if (!win) return;

    win.innerHTML += `
        <div class="msg user">
            <div class="avatar">👤</div>
            <div class="bubble">${text}</div>
        </div>`;
    win.scrollTop = win.scrollHeight;
}

// --- LÓGICA: QUIZ ---
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) return endQuiz();
    
    const q = quizQuestions[currentQuestionIndex];
    
    // Atualiza contadores
    const elCount = document.getElementById('qCount');
    if(elCount) elCount.innerText = `Questão ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    
    const elText = document.getElementById('qText');
    if(elText) elText.innerText = q.q;
    
    const elFeedback = document.getElementById('qFeedback');
    if(elFeedback) elFeedback.classList.add('hidden');
    
    const optsDiv = document.getElementById('qOptions');
    if (!optsDiv) return;

    optsDiv.innerHTML = '';
    
    q.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx, btn);
        optsDiv.appendChild(btn);
    });
}

function checkAnswer(idx, btn) {
    // Desabilitar todos os botões
    const all = document.querySelectorAll('.option-btn');
    all.forEach(b => b.disabled = true);
    
    const q = quizQuestions[currentQuestionIndex];
    const elFeedback = document.getElementById('qFeedback');
    
    if (idx === q.c) {
        btn.classList.add('correct');
        addXP(20);
        score++;
        if(elFeedback) elFeedback.innerHTML = `<strong style="color:var(--success)">Correto!</strong> ${q.info}`;
    } else {
        btn.classList.add('wrong');
        // Mostrar a correta
        if(all[q.c]) all[q.c].classList.add('correct');
        if(elFeedback) elFeedback.innerHTML = `<strong style="color:var(--danger)">Errado!</strong> ${q.info}`;
    }
    
    if(elFeedback) elFeedback.classList.remove('hidden');
    
    const nextBtn = document.getElementById('nextBtn');
    if(nextBtn) nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    const nextBtn = document.getElementById('nextBtn');
    if(nextBtn) nextBtn.classList.add('hidden');
    showQuestion();
}

function endQuiz() {
    const container = document.getElementById('quizContainer');
    if (container) {
        container.innerHTML = `
            <div style="text-align:center; padding:30px">
                <i class="ph ph-medal" style="font-size:4rem; color:var(--primary)"></i>
                <h2>Quiz Finalizado!</h2>
                <p>Você acertou ${score} de ${quizQuestions.length} questões.</p>
                <p>Pontuação Total: ${score * 20} XP</p>
                <button class="btn-primary" onclick="location.reload()">Reiniciar Sistema</button>
            </div>
        `;
    }

}
