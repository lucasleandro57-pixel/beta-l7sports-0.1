// ===== CONFIGURAÇÕES GLOBAIS =====
const STORAGE_KEY = 'l7_treino_pacientes';

// ===== FUNÇÕES DE ARMAZENAMENTO =====

function loadPatients() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        return [];
    }
}

function savePatients(patients) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
        return true;
    } catch (error) {
        console.error('Erro ao salvar pacientes:', error);
        return false;
    }
}

// ===== FUNÇÕES DE INTERFACE (HOME) =====

function renderPatients() {
    const patients = loadPatients();
    const patientsGrid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    // Elementos não encontrados (pode estar em outra página)
    if (!patientsGrid || !emptyState) return;

    // Limpar grid atual
    patientsGrid.innerHTML = '';

    if (patients.length === 0) {
        // Se não tem pacientes, mostra o desenho de vazio
        emptyState.style.display = 'flex';
        patientsGrid.style.display = 'none';
    } else {
        // Se TEM pacientes, esconde o vazio e mostra o grid
        emptyState.style.display = 'none';
        patientsGrid.style.display = 'grid'; // IMPORTANTE: Torna o grid visível
        
        // Ordenar: Últimos cadastrados/atualizados primeiro
        patients.sort((a, b) => {
            const dateA = new Date(a.dataAtualizacao || a.dataCadastro || 0);
            const dateB = new Date(b.dataAtualizacao || b.dataCadastro || 0);
            return dateB - dateA;
        });

        // Criar cards
        patients.forEach(patient => {
            const card = createPatientCard(patient);
            patientsGrid.appendChild(card);
        });
    }
}

function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = 'patient-card';
    
    // Tratamento de dados para evitar erros se faltar algo
    const focos = patient.focoTreino || [];
    const focusTags = focos.length > 0 
        ? focos.map(f => `<span class="focus-tag">${f}</span>`).join('') 
        : '<span class="focus-tag" style="background:#555">Em avaliação</span>';
    
    const lesao = patient.localLesao || patient.lesao || 'Não informado';
    
    const dataCadastro = patient.dataCadastro 
        ? new Date(patient.dataCadastro).toLocaleDateString('pt-BR') 
        : 'Data desc.';

    card.innerHTML = `
        <div class="patient-name">
            <i class="fas fa-user"></i>
            ${patient.nome}
        </div>

        <div class="patient-details" style="margin: 1rem 0;">
            <div style="margin-bottom: 0.8rem;">
                <span style="color: #ccc; font-size: 0.9rem; display: block; margin-bottom: 0.3rem;">Lesão:</span>
                <span class="focus-tag" style="
                    background: linear-gradient(135deg, #8B5CF6, #7C3AED); 
                    border: none; 
                    color: white; 
                    font-weight: 700; 
                    padding: 0.4rem 1rem;
                    border-radius: 50px;
                    display: inline-block;">
                    ${lesao}
                </span>
            </div>

            <div>
                <span style="color: #ccc; font-size: 0.9rem; display: block; margin-bottom: 0.3rem;">Foco Atual:</span>
                <div class="focus-tags">
                    ${focusTags}
                </div>
            </div>
        </div>

        <div class="patient-info" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; margin-top: auto;">
            <small><i class="fas fa-calendar"></i> Desde: ${dataCadastro}</small>
        </div>

        <div class="patient-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-small" style="flex: 100%; justify-content: center; background: #22c55e; border-color: #22c55e;" 
                onclick="novaAvaliacao('${patient.id}')">
                <i class="fas fa-plus-circle"></i> Nova Avaliação
            </button>

            <button class="btn btn-primary btn-small" style="flex: 1; justify-content: center;" 
                onclick="verFicha('${patient.id}')">
                <i class="fas fa-dumbbell"></i> Ficha
            </button>
            
            <button class="btn btn-secondary btn-small" style="flex: 0; justify-content: center;" 
                onclick="deletarPaciente('${patient.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// ===== AÇÕES DOS BOTÕES =====

function novaAvaliacao(id) {
    // Salva o ID para a página de cadastro saber quem é
    localStorage.setItem('select_paciente_existente_pre', id); // Opcional, para pré-seleção
    // Mas o mais importante é abrir a página
    window.location.href = 'cadastro.html';
    
    // Nota: Na página cadastro.html, você pode selecionar este paciente na lista
}

function verFicha(id) {
    localStorage.setItem('selectedPatientId', id);
    window.location.href = 'ficha.html';
}

function deletarPaciente(id) {
    if(confirm('Tem certeza que deseja excluir este paciente?')) {
        let patients = loadPatients();
        patients = patients.filter(p => p.id !== id);
        savePatients(patients);
        renderPatients(); // Atualiza a tela
    }
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', () => {
    // Se estivermos na página inicial (tem o grid), renderiza
    if(document.getElementById('patients-grid')) {
        renderPatients();
    }
});