// ===== VARIÁVEIS GLOBAIS =====
let allExercises = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 30;

// Estado dos Filtros
let activeLocation = 'all'; // Filtro de Membro
let activeFocus = 'all';    // Filtro de Modalidade
let searchTerm = '';        // Filtro de Texto (Busca)

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    if (typeof getAllExercises !== 'function') {
        console.error('Erro: exercises-data.js não carregado.');
        return;
    }
    allExercises = getAllExercises();
    setupFilters(); // Configura os cliques nos botões
    setupSearch();  // Configura a barra de pesquisa
    applyFilters(); // Carrega a lista inicial
});

/**
 * Configura a barra de pesquisa
 */
function setupSearch() {
    const searchInput = document.getElementById('search-exercise');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase();
            currentPage = 1; // Reseta para a primeira página ao pesquisar
            applyFilters();
        });
    }
}

/**
 * Configura os botões de filtro (Local e Foco)
 */
function setupFilters() {
    const allButtons = document.querySelectorAll('.filter-btn');
    
    allButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type; // "location" ou "focus"
            const value = this.dataset.value; // "joelho", "Força", etc.

            // 1. Atualiza visual do botão (Active)
            // Remove active só dos botões do mesmo grupo
            const siblings = this.parentElement.querySelectorAll('.filter-btn');
            siblings.forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            // 2. Atualiza a variável de estado
            if (type === 'location') {
                activeLocation = value;
            } else if (type === 'focus') {
                activeFocus = value;
            }

            // 3. Reseta página e aplica filtros
            currentPage = 1;
            applyFilters();
        });
    });
}

/**
 * Aplica os três filtros (Lógica E: Local + Foco + Texto) e renderiza
 */
function applyFilters() {
    const filtered = allExercises.filter(ex => {
        // --- CHECAGEM 1: MODALIDADE (FOCO) ---
        const matchFocus = (activeFocus === 'all') || (ex.foco === activeFocus);

        // --- CHECAGEM 2: LOCAL (MEMBRO) ---
        let matchLocation = false;
        if (activeLocation === 'all') {
            matchLocation = true;
        } else {
            const id = ex.id.toLowerCase();
            const local = activeLocation.toLowerCase();

            if (local === 'joelho') {
                matchLocation = id.includes('patelar') || id.includes('quadriceps') || id.includes('posterior') || id.includes('joelho');
            } else if (local === 'tornozelo') {
                matchLocation = id.includes('tornozelo') || id.includes('fascite');
            } else if (local === 'ombro') {
                matchLocation = id.includes('manguito') || id.includes('ombro');
            } else if (local === 'coluna') {
                matchLocation = id.includes('lombar') || id.includes('coluna');
            } else if (local === 'quadril') {
                matchLocation = id.includes('quadril') || id.includes('gluteo');
            } else {
                matchLocation = id.includes(local);
            }
        }

        // --- CHECAGEM 3: PESQUISA (NOME) ---
        // Verifica se o nome do exercício contém o texto digitado
        const matchSearch = ex.nome.toLowerCase().includes(searchTerm);

        // O exercício só passa se atender OS TRÊS critérios
        return matchFocus && matchLocation && matchSearch;
    });

    renderExercises(filtered);
}

// ===== FUNÇÕES DE RENDERIZAÇÃO (Mantidas do código anterior) =====

function renderExercises(exercises) {
    const exerciseGrid = document.getElementById('exercise-grid');
    const emptyMsg = document.getElementById('empty-exercises') || createEmptyMessageIfNeeded();
    
    exerciseGrid.innerHTML = '';

    if (exercises.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        updateStats(0);
        renderPagination(0);
        return;
    }
    
    if(emptyMsg) emptyMsg.style.display = 'none';

    // Paginação
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedExercises = exercises.slice(startIndex, endIndex);

    paginatedExercises.forEach(exercise => {
        const card = createExerciseCard(exercise);
        exerciseGrid.appendChild(card);
    });

    updateStats(exercises.length);
    renderPagination(exercises.length);
}

function createExerciseCard(exercise) {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
        <div class="exercise-video">
            <iframe 
                src="${exercise.videoUrl}" 
                title="${exercise.nome}"
                loading="lazy" 
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
                <div class="detail-item"><i class="fas fa-clock"></i> <span>${exercise.duracao}</span></div>
                <div class="detail-item"><i class="fas fa-signal"></i> <span>${exercise.dificuldade}</span></div>
                <div class="detail-item"><i class="fas fa-tools"></i> <span>${exercise.equipamentos}</span></div>
            </div>
        </div>
    `;
    return card;
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    let container = document.querySelector('.pagination-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'pagination-container';
        document.querySelector('.main-container').appendChild(container);
    }
    
    container.innerHTML = '';
    if (totalPages <= 1) return;

    // Botões de navegação simplificados
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            applyFilters(); // Usa applyFilters para manter os filtros ativos
            document.querySelector('.exercise-grid').scrollIntoView({ behavior: 'smooth' });
        };
        container.appendChild(btn);
    }
}

function updateStats(count) {
    const totalEl = document.getElementById('total-exercises');
    const visibleEl = document.getElementById('visible-exercises');
    if (totalEl && typeof allExercises !== 'undefined') totalEl.textContent = allExercises.length;
    if (visibleEl) visibleEl.textContent = count;
}

function createEmptyMessageIfNeeded() {
    let msg = document.getElementById('empty-exercises');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'empty-exercises';
        msg.style.textAlign = 'center';
        msg.style.padding = '3rem';
        msg.innerHTML = '<i class="fas fa-search" style="font-size: 3rem; color: #555; margin-bottom: 1rem;"></i><h3>Nenhum exercício encontrado</h3><p>Tente mudar os filtros selecionados ou o termo da busca.</p>';
        document.querySelector('.main-container').insertBefore(msg, document.querySelector('.pagination-container'));
    }
    return msg;
}