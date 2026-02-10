// ===== CONFIGURAÇÕES GLOBAIS =====
const STORAGE_KEY = 'l7_treino_pacientes';



// ===== INSIGHTS: membros fora do padrão (para exibir "boxes" extras) =====
function normalizeLesaoLabel(raw) {
    if (!raw) return 'Geral';
    const s = String(raw).trim();
    if (!s) return 'Geral';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function addReason(map, joint, reason) {
    if (!joint) return;
    const k = String(joint).trim();
    if (!k) return;
    if (!map[k]) map[k] = [];
    map[k].push(reason);
}
function computeExtraJointsFromSession(paciente, sessao) {
    const reasonsByJoint = {};
    const primary = normalizeLesaoLabel(paciente?.localLesao || paciente?.lesao || 'Geral');

    if (!sessao) return { primary, extras: [] };

    // MMII — Lunge (tornozelo)
    const lE = Number(sessao.lungeE || 0);
    const lD = Number(sessao.lungeD || 0);
    if (lE > 0 && (lE < 35 || lE > 45)) addReason(reasonsByJoint, 'Tornozelo', `Lunge Esq fora (${lE}°)`);
    if (lD > 0 && (lD < 35 || lD > 45)) addReason(reasonsByJoint, 'Tornozelo', `Lunge Dir fora (${lD}°)`);

    // MMII — Rotadores (quadril)
    const rE = Number(sessao.rotE || 0);
    const rD = Number(sessao.rotD || 0);
    if (rE > 0 && (rE < 30 || rE > 40)) addReason(reasonsByJoint, 'Quadril', `Rotadores Esq fora (${rE}°)`);
    if (rD > 0 && (rD < 30 || rD > 40)) addReason(reasonsByJoint, 'Quadril', `Rotadores Dir fora (${rD}°)`);

    // MMII — Y Test inferior (score < 90) -> tornozelo/joelho/quadril
    const yE = Number(sessao.scoreY_MmiiE || 0);
    const yD = Number(sessao.scoreY_MmiiD || 0);
    if (yE > 0 && yE < 90) { addReason(reasonsByJoint, 'Tornozelo', 'Y-Test MMII Esq < 90'); addReason(reasonsByJoint, 'Joelho', 'Y-Test MMII Esq < 90'); addReason(reasonsByJoint, 'Quadril', 'Y-Test MMII Esq < 90'); }
    if (yD > 0 && yD < 90) { addReason(reasonsByJoint, 'Tornozelo', 'Y-Test MMII Dir < 90'); addReason(reasonsByJoint, 'Joelho', 'Y-Test MMII Dir < 90'); addReason(reasonsByJoint, 'Quadril', 'Y-Test MMII Dir < 90'); }

    // MMII — Hop (LSI < 90) -> joelho
    const hE = Number(sessao.hopE || 0);
    const hD = Number(sessao.hopD || 0);
    if (hE > 0 && hD > 0) {
        const max = Math.max(hE, hD);
        const min = Math.min(hE, hD);
        const lsi = (min / max) * 100;
        if (lsi < 90) addReason(reasonsByJoint, 'Joelho', `Hop LSI < 90% (${lsi.toFixed(1)}%)`);
    }

    // MMII — CMJ/SJ (heurística) -> quadril/joelho
    const cmj = Number(sessao.cmj || 0);
    const sj  = Number(sessao.sj  || 0);
    if (cmj > 0 && sj > 0) {
        const diffPct = ((cmj - sj) / sj) * 100;
        if (sj < 25 && cmj < 25) { addReason(reasonsByJoint, 'Quadril', 'Potência baixa'); addReason(reasonsByJoint, 'Joelho', 'Potência baixa'); }
        else if (diffPct < 10) { addReason(reasonsByJoint, 'Quadril', `Explosão baixa (${diffPct.toFixed(1)}%)`); addReason(reasonsByJoint, 'Joelho', `Explosão baixa (${diffPct.toFixed(1)}%)`); }
    }

    // MMSS — Y Test superior (score < 80) -> ombro
    const ySupE = Number(sessao.scoreY_MmssE || 0);
    const ySupD = Number(sessao.scoreY_MmssD || 0);
    if (ySupE > 0 && ySupE < 80) addReason(reasonsByJoint, 'Ombro', 'Y-Test MMSS Esq < 80');
    if (ySupD > 0 && ySupD < 80) addReason(reasonsByJoint, 'Ombro', 'Y-Test MMSS Dir < 80');

    // MMSS — Goniometria (flex/abd < 180) -> ombro
    const gFlex = Number(sessao.gonioFlexMmss || 0);
    const gAbd  = Number(sessao.gonioAbdMmss || 0);
    if (gFlex > 0 && gFlex < 180) addReason(reasonsByJoint, 'Ombro', `Flex < 180 (${gFlex}°)`);
    if (gAbd  > 0 && gAbd  < 180) addReason(reasonsByJoint, 'Ombro', `Abd < 180 (${gAbd}°)`);

    // MMSS — MCC (heurística) -> ombro
    const mcc = Number(sessao.mcc || 0);
    if (mcc > 0 && mcc < 20) addReason(reasonsByJoint, 'Ombro', `MCC baixo (${mcc})`);

    const all = Object.keys(reasonsByJoint);
    const extras = all.filter(j => j && j !== primary).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a.localeCompare(b));
    return { primary, extras };
}

// ===== VARIÁVEIS GLOBAIS =====
let currentPatient = null;
let currentFilter = 'all';

// ===== FUNÇÕES DE ARMAZENAMENTO =====

/**
 * Carrega a lista de pacientes do localStorage
 */
function loadPatients() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        return [];
    }
}

/**
 * Busca um paciente por ID
 */
function getPatientById(patientId) {
    const patients = loadPatients();
    return patients.find(p => p.id === patientId);
}

// ===== FUNÇÕES DE INTERFACE =====

/**
 * Mostra o estado de carregamento
 */
function showLoadingState() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('error-state').style.display = 'none';
    document.getElementById('workout-content').style.display = 'none';
}

/**
 * Mostra o estado de erro
 */
function showErrorState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('workout-content').style.display = 'none';
}

/**
 * Mostra o conteúdo da ficha
 */
function showWorkoutContent() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'none';
    document.getElementById('workout-content').style.display = 'block';
}

/**
 * Renderiza as informações do paciente
 */
function renderPatientInfo(patient) {
    // Nome do paciente
    const patientNameElement = document.getElementById('patient-name');
    patientNameElement.querySelector('span').textContent = patient.nome;
    
    // Local da Lesão
    const patientLocationElement = document.getElementById('patient-location');
    const locationDisplay = patient.localLesao 
        ? patient.localLesao.charAt(0).toUpperCase() + patient.localLesao.slice(1) // Capitaliza a primeira letra
        : 'Não Informado';
    patientLocationElement.innerHTML = (() => {
        const sessao = (patient.historicoAvaliacoes && patient.historicoAvaliacoes.length)
            ? patient.historicoAvaliacoes[patient.historicoAvaliacoes.length - 1]
            : null;
        const joints = computeExtraJointsFromSession(patient, sessao);
        const list = [joints.primary, ...(joints.extras || [])].filter(Boolean);
        const tags = list.map(j => `<span class="location-tag">${j}</span>`).join(' ');
        return `<strong>Local da Lesão:</strong> ${tags}`;
    })();
    // Focos de treino
    const patientFocusElement = document.getElementById('patient-focus');
    const focusTags = patient.focoTreino.map(foco => 
        `<span class="focus-tag">${foco}</span>`
    ).join('');
    
    patientFocusElement.innerHTML = `
        <strong>Foco do Treino:</strong>
        <div class="focus-tags">
            ${focusTags}
        </div>
    `;
}

/**
 * Renderiza os botões de filtro
 */
function renderFilterButtons(patientFocus) {
    const filterButtonsContainer = document.getElementById('filter-buttons');
    
    // Botão "Todos"
    let buttonsHTML = `
        <button class="filter-btn active" data-filter="all">
            <i class="fas fa-th"></i>
            Todos
        </button>
    `;
    
    // Botões para cada foco do paciente
    const focusIcons = {
        'Mobilidade': 'fas fa-expand-arrows-alt',
        'Estabilidade': 'fas fa-balance-scale',
        'Mobilidade sobre Estabilidade': 'fas fa-sync-alt',
        'Potencia': 'fas fa-bolt',
        'Força': 'fas fa-dumbbell',
        'Habilidade': 'fas fa-running'
    };
    
    patientFocus.forEach(foco => {
        const icon = focusIcons[foco] || 'fas fa-dumbbell';
        buttonsHTML += `
            <button class="filter-btn" data-filter="${foco}">
                <i class="${icon}"></i>
                ${foco}
            </button>
        `;
    });
    
    filterButtonsContainer.innerHTML = buttonsHTML;
    
    // Adicionar event listeners aos botões
    const filterButtons = filterButtonsContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Atualizar filtro atual
            currentFilter = this.dataset.filter;
            
            // Filtrar exercícios
            filterExercises();
        });
    });
}

/**
 * Cria um card de exercício
 */
function createExerciseCard(exercise) {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.dataset.focus = exercise.foco;
    
    card.innerHTML = `
        <div class="exercise-video">
            <iframe 
                src="${exercise.videoUrl}" 
                title="${exercise.nome}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
        <div class="exercise-info">
            <h3 class="exercise-title">${exercise.nome}</h3>
            <span class="exercise-focus">${exercise.foco}</span>
            <p class="exercise-description">${exercise.descricao}</p>
            <div class="exercise-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${exercise.duracao}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-signal"></i>
                    <span>${exercise.dificuldade}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tools"></i>
                    <span>${exercise.equipamentos}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Renderiza os exercícios divididos por categorias (Carrossel Horizontal)
 */
function renderExercises(allFilteredExercises) {
    const container = document.getElementById('exercise-grid'); // Usamos o mesmo container pai
    const emptyExercises = document.getElementById('empty-exercises');
    
    // Limpar tudo antes de começar
    container.innerHTML = '';
    
    if (allFilteredExercises.length === 0) {
        container.style.display = 'none';
        emptyExercises.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyExercises.style.display = 'none';

    // A ordem exata que você pediu
    const categoriasOrdem = [
        "Mobilidade", 
        "Estabilidade", 
        "Mobilidade sobre Estabilidade", 
        "Força", 
        "Potencia", // Sem acento no código se o ID for sem acento
        "Habilidade",
        "Velocidade" // Adicionei velocidade caso use
    ];

    // Para cada categoria, criamos uma seção
    categoriasOrdem.forEach(categoria => {
        // Filtra os exercícios dessa categoria específica
        const exerciciosDaCategoria = allFilteredExercises.filter(ex => ex.foco === categoria);

        // Só desenha a seção se tiver exercícios nela
        if (exerciciosDaCategoria.length > 0) {
            
            // 1. Cria o Título da Seção
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'category-title';
            sectionTitle.textContent = categoria; // O nome que aparece na tela
            
            // 2. Cria o Container de Rolagem Horizontal
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'horizontal-scroll';

            // 3. Adiciona os Cards dentro do Container
            exerciciosDaCategoria.forEach(exercise => {
                const card = createExerciseCard(exercise);
                scrollContainer.appendChild(card);
            });

            // 4. Cria a Seção completa e adiciona na tela
            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = 'category-section';
            
            sectionWrapper.appendChild(sectionTitle);
            sectionWrapper.appendChild(scrollContainer);
            
            container.appendChild(sectionWrapper);
        }
    });
}

/**
 * Filtra os exercícios baseado no filtro atual
 */
function filterExercises() {
    let exercises;
    
    // O filtro principal agora usa a nova função de filtro duplo
    const focusArray = currentFilter === 'all' ? currentPatient.focoTreino : [currentFilter];
    const injuryLocation = currentPatient.localLesao;
    
    // Usar a nova função de filtro que considera Foco E Local da Lesão
    exercises = getExercisesByFocusAndLocation(focusArray, injuryLocation);
    
    renderExercises(exercises);
    
    console.log(`Filtro aplicado: ${currentFilter} (Local: ${injuryLocation}), Exercícios encontrados: ${exercises.length}`);
}

// ===== FUNÇÕES DE AÇÃO =====

/**
 * Edita o paciente atual
 */
function editPatient() {
    if (currentPatient) {
        localStorage.setItem('editPatientId', currentPatient.id);
        window.location.href = 'cadastro.html?edit=' + currentPatient.id;
    }
}

/**
 * Volta para a lista de pacientes
 */
function goBack() {
    window.location.href = 'index.html';
}

// ===== INICIALIZAÇÃO =====

/**
 * Carrega os dados do paciente selecionado
 */
function loadPatientData() {
    const selectedPatientId = localStorage.getItem('selectedPatientId');
    
    if (!selectedPatientId) {
        console.error('Nenhum paciente selecionado');
        showErrorState();
        return false;
    }
    
    const patient = getPatientById(selectedPatientId);
    
    if (!patient) {
        console.error('Paciente não encontrado:', selectedPatientId);
        showErrorState();
        return false;
    }
    
    currentPatient = patient;
    console.log('Paciente carregado:', patient);
    // O ID selecionado será limpo na próxima inicialização da página index.html
    // localStorage.removeItem('selectedPatientId');
    return true;
}

/**
 * Inicializa a página de ficha de treino
 */
function initializeWorkoutPage() {
    console.log('=== L7 SPORTS TREINO - FICHA DE TREINO INICIADA ===');
    
    // Mostrar estado de carregamento
    showLoadingState();
    
    // Simular carregamento
    setTimeout(() => {
        // Carregar dados do paciente
        if (!loadPatientData()) {
            return;
        }
        
        // Renderizar informações do paciente
        renderPatientInfo(currentPatient);
        
        // Renderizar botões de filtro
        renderFilterButtons(currentPatient.focoTreino);
        
        // Carregar exercícios iniciais (todos os exercícios do paciente)
        filterExercises();
        
        // Mostrar conteúdo da ficha
        showWorkoutContent();
        
        console.log('=== INICIALIZAÇÃO COMPLETA ===');
    }, 1000);
}

/**
 * Inicialização quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a base de dados de exercícios está disponível
    if (typeof EXERCISES_DATABASE === 'undefined') {
        console.error('Base de dados de exercícios não encontrada!');
        showErrorState();
        return;
    }
    
    initializeWorkoutPage();
});

// ===== FUNÇÕES GLOBAIS (para compatibilidade com HTML) =====
window.editPatient = editPatient;
window.goBack = goBack;

/**
 * Função auxiliar para filtrar exercícios (Adicionada diretamente aqui para evitar erros)
 */
function getExercisesByFocusAndLocation(foco, localOrLocals) {
    // Verifica se a base de dados existe
    if (typeof getAllExercises !== 'function') {
        console.error("Erro: Banco de dados de exercícios não carregado.");
        return [];
    }

    const todosExercicios = getAllExercises();

    // Normaliza locais (aceita string ou array: ["Tornozelo","Quadril"])
    const locais = Array.isArray(localOrLocals) ? localOrLocals : [localOrLocals];
    const locaisNorm = locais
        .filter(Boolean)
        .map(l => String(l).trim().toLowerCase());

    // Se não tem local definido, não restringe por local
    const deveFiltrarPorLocal = locaisNorm.length > 0 && !locaisNorm.includes('geral') && !locaisNorm.includes('gerais');

    function matchLocalForOne(ex, localNormalizado) {
        const id = String(ex.id || '').toLowerCase();

        if (localNormalizado === "tornozelo") {
            return id.includes("tornozelo") || id.includes("panturrilha") || id.includes("perone");
        } else if (localNormalizado === "joelho") {
            return id.includes("patelar") || id.includes("quadriceps") || id.includes("posterior") || id.includes("joelho");
        } else if (localNormalizado === "ombro") {
            return id.includes("manguito") || id.includes("ombro");
        } else if (localNormalizado === "coluna") {
            return id.includes("lombar") || id.includes("coluna");
        } else if (localNormalizado === "quadril") {
            return id.includes("quadril");
        }

        // Se não reconheceu o local, não restringe
        return true;
    }

    return todosExercicios.filter(ex => {
        // 1) FOCO (array ou string)
        const exFoco = ex.foco;
        let matchFoco = false;

        if (Array.isArray(foco)) {
            matchFoco = foco.includes(exFoco);
        } else {
            matchFoco = exFoco === foco;
        }
        if (!matchFoco) return false;

        // 2) LOCAL (aceita 1 ou vários)
        if (!deveFiltrarPorLocal) return true;

        // Se qualquer local bater, entra
        return locaisNorm.some(loc => matchLocalForOne(ex, loc));
    });
}

