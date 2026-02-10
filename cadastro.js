// ===== CONFIGURAÇÕES GLOBAIS =====
const STORAGE_KEY = 'l7_treino_pacientes';

// ===== FUNÇÕES AUXILIARES =====
function loadPatients() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function savePatients(patients) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

// ===== LÓGICA DE COLETA DE DADOS =====
function coletarDadosFormulario(tipo) {
    // Pega os inputs baseados na aba ativa (mmii ou mmss)
    const prefixo = tipo === 'mmii' ? '' : ''; // Seus IDs não têm prefixo consistente, vamos pegar direto pelo ID
    
    // Dados Básicos
    const nome = document.getElementById(`nome_${tipo}`).value;
    const lesao = document.getElementById(`lesao_${tipo}`).value;
    const dataAvaliacao = document.getElementById(`data_${tipo}`).value;

    // Métricas (Se o campo não existir ou estiver vazio, vira 0)
    const getNum = (id) => Number(document.getElementById(id)?.value) || 0;

    let dadosAvaliacao = {};

    if (tipo === 'mmii') {
        dadosAvaliacao = {
            tipo: 'mmii',
            data: dataAvaliacao,
            hopE: getNum('hopE'), hopD: getNum('hopD'),
            yAntE: getNum('yAntE'), yAntD: getNum('yAntD'),
            lungeE: getNum('lungeE'), lungeD: getNum('lungeD'),
            rotE: getNum('rotE'), rotD: getNum('rotD'),
            cmj: getNum('cmj'), sj: getNum('sj')
        };
    } else {
        dadosAvaliacao = {
            tipo: 'mmss',
            data: dataAvaliacao,
            gonioFlex: getNum('gonioFlexMmss'),
            gonioAbd: getNum('gonioAbdMmss'),
            mcc: getNum('mcc'),
            ySupE: getNum('ySupE'), ySupD: getNum('ySupD')
        };
    }

    return { nome, lesao, dadosAvaliacao };
}

// ===== CÉREBRO DA PRESCRIÇÃO (MANTIDO DO SEU CÓDIGO) =====
function definirFocos(dados) {
    let focos = [];
    
    // Lógica MMII
    if (dados.cmj > 0 && dados.sj > 0) {
        const difExplosiva = ((dados.cmj - dados.sj) / dados.sj) * 100;
        if (difExplosiva < 10) focos.push("Potencia");
    }
    
    // Assimetrias (>10% de diferença)
    const checkAssimetria = (a, b) => a > 0 && b > 0 && (Math.min(a,b)/Math.max(a,b) < 0.9);
    
    if (checkAssimetria(dados.hopE, dados.hopD) || checkAssimetria(dados.yAntE, dados.yAntD)) {
        focos.push("Força", "Estabilidade");
    }
    
    if ((dados.lungeE > 0 && dados.lungeE < 10) || (dados.rotE > 0 && dados.rotE < 35)) {
        focos.push("Mobilidade");
    }

    // Regra de segurança
    if (focos.length === 0) focos.push("Habilidade");
    return [...new Set(focos)];
}

// ===== FUNÇÃO PRINCIPAL DE SALVAR =====
function salvarFormulario(tipo) {
    const { nome, lesao, dadosAvaliacao } = coletarDadosFormulario(tipo);

    if (!nome) return alert("Preencha o nome do paciente!");

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const pacientes = loadPatients();

    if (mode === 'avaliacao') {
        // --- MODO NOVA AVALIAÇÃO (ADICIONAR AO HISTÓRICO) ---
        const idPaciente = localStorage.getItem('avaliacaoPatientId');
        const index = pacientes.findIndex(p => p.id === idPaciente);

        if (index !== -1) {
            // Inicializa histórico se não existir
            if (!pacientes[index].historicoAvaliacoes) {
                pacientes[index].historicoAvaliacoes = [];
                // Salva a avaliação antiga no histórico para não perder
                if (pacientes[index].ultimaAvaliacao) {
                    pacientes[index].historicoAvaliacoes.push({
                        data: pacientes[index].dataCadastro || new Date().toISOString(),
                        ...pacientes[index].ultimaAvaliacao
                    });
                }
            }

            // Adiciona a NOVA avaliação ao histórico
            pacientes[index].historicoAvaliacoes.push(dadosAvaliacao);
            
            // Atualiza os dados "atuais"
            pacientes[index].ultimaAvaliacao = dadosAvaliacao;
            pacientes[index].focoTreino = definirFocos(dadosAvaliacao);
            // Atualiza a lesão caso tenha mudado
            pacientes[index].localLesao = lesao; 

            savePatients(pacientes);
            alert("Nova avaliação registrada com sucesso!");
            window.location.href = 'index.html';
        }

    } else {
        // --- MODO NOVO PACIENTE ---
        const novoPaciente = {
            id: 'p_' + Date.now(),
            nome: nome,
            localLesao: lesao,
            focoTreino: definirFocos(dadosAvaliacao),
            ultimaAvaliacao: dadosAvaliacao,
            historicoAvaliacoes: [dadosAvaliacao], // Já começa com histórico
            dataCadastro: new Date().toISOString()
        };

        pacientes.push(novoPaciente);
        savePatients(pacientes);
        alert("Paciente cadastrado com sucesso!");
        window.location.href = 'index.html';
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Configura data de hoje
    const hoje = new Date().toISOString().split('T')[0];
    if(document.getElementById('data_mmii')) document.getElementById('data_mmii').value = hoje;
    if(document.getElementById('data_mmss')) document.getElementById('data_mmss').value = hoje;

    // Verifica se é modo Nova Avaliação
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'avaliacao') {
        const id = localStorage.getItem('avaliacaoPatientId');
        const pacientes = loadPatients();
        const paciente = pacientes.find(p => p.id === id);
        
        if (paciente) {
            document.querySelector('.page-header h1').innerHTML = `<i class="fas fa-chart-line"></i> Nova Avaliação`;
            document.querySelector('.page-header p').textContent = `Adicionando dados para: ${paciente.nome}`;
            
            // Preenche e trava o nome
            document.getElementById('nome_mmii').value = paciente.nome;
            document.getElementById('nome_mmii').disabled = true;
            document.getElementById('nome_mmss').value = paciente.nome;
            document.getElementById('nome_mmss').disabled = true;
            
            // Seleciona a lesão correta
            document.getElementById('lesao_mmii').value = paciente.localLesao;
        }
    }
});

// Funções globais
window.salvarFormulario = salvarFormulario;
window.switchSection = function(sectionName) {
    document.getElementById('section-mmii').style.display = 'none';
    document.getElementById('section-mmss').style.display = 'none';
    document.getElementById('section-' + sectionName).style.display = 'block';
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if(sectionName === 'mmii') buttons[0].classList.add('active');
    else buttons[1].classList.add('active');
};