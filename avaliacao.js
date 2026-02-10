// ===== INICIALIZAÇÃO E CONFIGURAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema de Avaliação Iniciado.");
    const pacientes = JSON.parse(localStorage.getItem('l7_treino_pacientes') || '[]');
    const select = document.getElementById('select_paciente_existente');

    if (select) {
        select.innerHTML = '<option value="novo">Novo Paciente (Cadastrar)</option>';
        pacientes.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nome;
            select.appendChild(option);
        });

        const idParaEditar = localStorage.getItem('select_paciente_existente_pre');
        const editPacienteId = localStorage.getItem('edit_avaliacao_paciente_id');
        const editIndexRaw = localStorage.getItem('edit_avaliacao_index');
        const editIndex = (editIndexRaw !== null && editIndexRaw !== undefined) ? Number(editIndexRaw) : null;

        if (idParaEditar) {
            const paciente = pacientes.find(p => p.id === idParaEditar);
            if (paciente) {
                select.value = idParaEditar;
                const containerSelect = select.closest('.form-group') || select.parentElement; 
                if(containerSelect) containerSelect.style.display = 'none';

                const titulo = document.querySelector('.page-header h1');
                const subtitulo = document.querySelector('.page-header p');
                if(titulo) titulo.innerHTML = `<i class="fas fa-edit"></i> Nova Avaliação: <span style="color:#A78BFA">${paciente.nome}</span>`;
                if(subtitulo) subtitulo.textContent = "Adicione os novos dados dos testes abaixo.";

                preencherDadosPaciente(idParaEditar, pacientes);

                // Se veio para editar uma sessão específica, pré-preenche os campos
                if (editPacienteId === idParaEditar && editIndex !== null && !Number.isNaN(editIndex)) {
                    const historico = paciente.historicoAvaliacoes || [];
                    const sessao = historico[editIndex];
                    if (sessao) {
                        const dtBr = sessao.data ? new Date(sessao.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';
                        if (subtitulo) subtitulo.textContent = dtBr ? `Editando sessão de ${dtBr}. Ajuste os dados abaixo e salve.` : 'Editando sessão. Ajuste os dados abaixo e salve.';
                        preencherFormularioComSessao(sessao, paciente);
                    }
                }

                localStorage.removeItem('select_paciente_existente_pre');
            }
        }
        select.addEventListener('change', function() {
            if (this.value === 'novo') limparFormulario();
            else preencherDadosPaciente(this.value, pacientes);
        });
    }
});

function preencherDadosPaciente(id, pacientes) {
    const paciente = pacientes.find(p => p.id === id);
    if (!paciente) return;
    const nomeMmii = document.getElementById('nome_mmii');
    const nomeMmss = document.getElementById('nome_mmss');
    if(nomeMmii) { nomeMmii.value = paciente.nome; nomeMmii.disabled = true; }
    if(nomeMmss) { nomeMmss.value = paciente.nome; nomeMmss.disabled = true; }
    const lesao = paciente.localLesao || paciente.lesao;
    if (lesao) {
        const selectMmii = document.getElementById('lesao_mmii');
        const selectMmss = document.getElementById('lesao_mmss');
        if (['Ombro', 'Cotovelo', 'Punho', 'Coluna'].includes(lesao)) {
            if(selectMmss) selectMmss.value = lesao;
            if(typeof switchSection === 'function') switchSection('mmss');
        } else {
            if(selectMmii) selectMmii.value = lesao;
            if(typeof switchSection === 'function') switchSection('mmii');
        }
    }
}

function limparFormulario() {
    const nomeMmii = document.getElementById('nome_mmii');
    const nomeMmss = document.getElementById('nome_mmss');
    if(nomeMmii) { nomeMmii.value = ''; nomeMmii.disabled = false; }
    if(nomeMmss) { nomeMmss.value = ''; nomeMmss.disabled = false; }
    const titulo = document.querySelector('.page-header h1');
    if(titulo && titulo.innerText.includes("Nova Avaliação")) {
        titulo.innerHTML = `<i class="fas fa-file-medical-alt"></i> Avaliação`;
        const select = document.getElementById('select_paciente_existente');
        if(select) { const container = select.closest('.form-group') || select.parentElement; if(container) container.style.display = 'block'; }
    }
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
}

function preencherFormularioComSessao(sessao, paciente) {
    if (!sessao) return;

    // decide MMSS vs MMII pelo conteúdo da sessão (não pelo tipo de lesão)
    const temMmss = (sessao.ySupE > 0 || sessao.ySupD > 0 || sessao.yMedialE > 0 || sessao.yMedialD > 0 || sessao.mcc > 0 || sessao.gonioFlexMmss > 0 || sessao.scoreY_MmssE > 0 || sessao.scoreY_MmssD > 0);
    if (typeof switchSection === 'function') {
        switchSection(temMmss ? 'mmss' : 'mmii');
    }

    // seta a data no input correto
    const dataEl = document.getElementById(temMmss ? 'data_mmss' : 'data_mmii');
    if (dataEl && sessao.data) dataEl.value = sessao.data;

    // preenche inputs cujo id bate com a chave do objeto
    Object.keys(sessao).forEach(key => {
        const el = document.getElementById(key);
        if (!el) return;
        // só preenche campos editáveis (números e data)
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
            // evita sobrescrever nome/lesão (já travados pelo preencherDadosPaciente)
            if (key === 'data') return;
            const val = sessao[key];
            if (typeof val === 'number' || typeof val === 'string') {
                el.value = val;
            }
        }
    });
}

// === CÁLCULO MATEMÁTICO PRECISO ===
function calcularScoreY(cr, v1, v2, v3) {
    if (cr > 0 && v1 > 0 && v2 > 0 && v3 > 0) {
        const soma = v1 + v2 + v3;
        const divisor = 3 * cr;
        const resultado = (soma / divisor) * 100;
        return parseFloat(resultado.toFixed(1));
    }
    return 0;
}

function salvarAvaliacao() {
    const select = document.getElementById('select_paciente_existente');
    let pacienteId = select ? select.value : null;
    
    const nomeInput = (document.getElementById('nome_mmii') && document.getElementById('nome_mmii').disabled) ? document.getElementById('nome_mmii') : 
                      ((document.getElementById('nome_mmss') && document.getElementById('nome_mmss').disabled) ? document.getElementById('nome_mmss') : null);
    
    if (nomeInput && (!pacienteId || pacienteId === 'novo')) {
        const pacientesTemp = JSON.parse(localStorage.getItem('l7_treino_pacientes') || '[]');
        const pEncontrado = pacientesTemp.find(p => p.nome === nomeInput.value);
        if (pEncontrado) pacienteId = pEncontrado.id;
    }

    if (!pacienteId) return alert("Erro: Paciente não identificado.");

    const sectionMmss = document.getElementById('section-mmss');
    const isMmssVisible = sectionMmss && sectionMmss.style.display !== 'none';
    let lesaoCorreta = isMmssVisible ? document.getElementById('lesao_mmss').value : document.getElementById('lesao_mmii').value;
    let nomePaciente = isMmssVisible ? document.getElementById('nome_mmss').value : document.getElementById('nome_mmii').value;
    
    let dataEscolhida = isMmssVisible ? document.getElementById('data_mmss').value : document.getElementById('data_mmii').value;
    if (!dataEscolhida) dataEscolhida = new Date().toISOString().split('T')[0];

    const getVal = (id) => { const el = document.getElementById(id); return el ? (Number(el.value) || 0) : 0; };

    // === 1. COLETA OS DADOS BRUTOS ===
    // MMII
    const crMmiiE = getVal('crMmiiE'); const crMmiiD = getVal('crMmiiD');
    const yAntE = getVal('yAntE'); const yPmE = getVal('yPmE'); const yPlE = getVal('yPlE');
    const yAntD = getVal('yAntD'); const yPmD = getVal('yPmD'); const yPlD = getVal('yPlD');
    
    // MMSS
    const crMmssE = getVal('crMmssE'); const crMmssD = getVal('crMmssD');
    const yMedialE = getVal('yMedialE'); const yInfLatE = getVal('yInfLatE'); const ySupLatE = getVal('ySupLatE');
    const yMedialD = getVal('yMedialD'); const yInfLatD = getVal('yInfLatD'); const ySupLatD = getVal('ySupLatD');

    // === 2. CALCULA O SCORE AGORA (ANTES DE SALVAR) ===
    const finalScoreYE = calcularScoreY(crMmiiE, yAntE, yPmE, yPlE);
    const finalScoreYD = calcularScoreY(crMmiiD, yAntD, yPmD, yPlD);
    const finalScoreY_SupE = calcularScoreY(crMmssE, yMedialE, yInfLatE, ySupLatE);
    const finalScoreY_SupD = calcularScoreY(crMmssD, yMedialD, yInfLatD, ySupLatD);

    const dados = {
        // === CORREÇÃO: ADICIONA A DATA AQUI PARA APARECER NO INÍCIO ===
        data: dataEscolhida, 
        
        // Salva os valores calculados
        scoreY_MmiiE: finalScoreYE,
        scoreY_MmiiD: finalScoreYD,
        scoreY_MmssE: finalScoreY_SupE,
        scoreY_MmssD: finalScoreY_SupD,

        // Salva os brutos também
        crMmiiE, crMmiiD, yAntE, yAntD, yPmE, yPmD, yPlE, yPlD,
        hopE: getVal('hopE'), hopD: getVal('hopD'),
        lungeE: getVal('lungeE'), lungeD: getVal('lungeD'),
        rotE: getVal('rotE'), rotD: getVal('rotD'),
        cmj: getVal('cmj'), sj: getVal('sj'),
        gonioExtMmii: getVal('gonioExtMmii'), gonioFlexMmii: getVal('gonioFlexMmii'),
        forcaMmii: getVal('forcaMmii'), evaMmii: getVal('evaMmii'),
        
        crMmssE, crMmssD, yMedialE, yMedialD, yInfLatE, yInfLatD, ySupLatE, ySupLatD,
        gonioFlexMmss: getVal('gonioFlexMmss'), gonioAbdMmss: getVal('gonioAbdMmss'),
        forcaMmss: getVal('forcaMmss'), evaMmss: getVal('evaMmss'), mcc: getVal('mcc')
    };

    const novosFocos = definirFocosAutomaticos(dados);
    let pacientes = JSON.parse(localStorage.getItem('l7_treino_pacientes') || '[]');

    // Se veio de uma edição de sessão, vamos substituir em vez de adicionar uma nova
    const editPacienteId = localStorage.getItem('edit_avaliacao_paciente_id');
    const editIndexRaw = localStorage.getItem('edit_avaliacao_index');
    const editIndex = (editIndexRaw !== null && editIndexRaw !== undefined) ? Number(editIndexRaw) : null;
    const isEditMode = (editPacienteId && editPacienteId === pacienteId && editIndex !== null && !Number.isNaN(editIndex));

    if (pacienteId === 'novo') {
        if (!nomePaciente) return alert("Digite o nome.");
        if (pacientes.find(p => p.nome.toLowerCase() === nomePaciente.toLowerCase())) return alert("Nome já existe!");
        const novo = { id: 'paciente_' + Date.now(), nome: nomePaciente, localLesao: lesaoCorreta, focoTreino: novosFocos, ultimaAvaliacao: dados, historicoAvaliacoes: [dados], dataCadastro: new Date().toISOString() };
        pacientes.push(novo);
        localStorage.setItem('l7_treino_pacientes', JSON.stringify(pacientes));
        localStorage.setItem('selectedPatientId', novo.id);
        alert("Paciente Cadastrado!");
        window.location.href = 'evolucao.html';
    } else {
        const index = pacientes.findIndex(p => p.id === pacienteId);
        if (index !== -1) {
            pacientes[index].focoTreino = novosFocos;
            // Se for edição, substitui no histórico; se não, adiciona
            if (!pacientes[index].historicoAvaliacoes) pacientes[index].historicoAvaliacoes = [];
            if (isEditMode && pacientes[index].historicoAvaliacoes[editIndex]) {
                pacientes[index].historicoAvaliacoes[editIndex] = dados;
            } else {
                pacientes[index].historicoAvaliacoes.push(dados);
            }

            // Ajusta ultimaAvaliacao para ser a mais recente por data
            const histTmp = pacientes[index].historicoAvaliacoes.slice().filter(h => h && h.data);
            if (histTmp.length > 0) {
                histTmp.sort((a, b) => new Date(b.data) - new Date(a.data));
                pacientes[index].ultimaAvaliacao = histTmp[0];
            } else {
                pacientes[index].ultimaAvaliacao = dados;
            }
            pacientes[index].localLesao = lesaoCorreta;

            localStorage.setItem('l7_treino_pacientes', JSON.stringify(pacientes));
            localStorage.setItem('selectedPatientId', pacienteId);

            // limpa flags de edição
            localStorage.removeItem('edit_avaliacao_paciente_id');
            localStorage.removeItem('edit_avaliacao_index');

            alert(isEditMode ? `Sessão atualizada!\nFocos: ${novosFocos.join(', ')}` : `Avaliação Atualizada!\nNovos focos: ${novosFocos.join(', ')}`);
            window.location.href = 'evolucao.html';
        } else {
            alert("Erro: Paciente não encontrado.");
        }
    }
}

function definirFocosAutomaticos(dados) {
    let focos = [];
    if (dados.cmj > 0 && dados.sj > 0) {
        const indice = ((dados.cmj - dados.sj) / dados.sj) * 100;
        if (dados.sj < 25 && dados.cmj < 25) focos.push("Força", "Potencia");
        else { if (indice < 10) focos.push("Potencia"); else if (indice > 20) focos.push("Força"); }
    }
    
    // Usa os scores já calculados
    if ((dados.scoreY_MmiiE > 0 && dados.scoreY_MmiiE < 90) || (dados.scoreY_MmiiD > 0 && dados.scoreY_MmiiD < 90)) { 
        if (!focos.includes("Força")) focos.push("Força"); 
        focos.push("Estabilidade"); 
    }
    if (dados.yAntE > 0 && dados.yAntD > 0 && Math.abs(dados.yAntE - dados.yAntD) > 4) focos.push("Estabilidade");
    
    if ((dados.scoreY_MmssE > 0 && dados.scoreY_MmssE < 80) || (dados.scoreY_MmssD > 0 && dados.scoreY_MmssD < 80)) focos.push("Estabilidade", "Força");

    const checkRange = (val, min, max) => { if (val > 0) { if (val < min) focos.push("Mobilidade"); if (val > max) focos.push("Estabilidade"); } };
    checkRange(dados.lungeE, 35, 45); checkRange(dados.lungeD, 35, 45); checkRange(dados.rotE, 30, 40); checkRange(dados.rotD, 30, 40);
    if (checkAssimetria(dados.hopE, dados.hopD)) focos.push("Força", "Estabilidade");
    if ((dados.gonioFlexMmss > 0 && dados.gonioFlexMmss < 180) || (dados.gonioAbdMmss > 0 && dados.gonioAbdMmss < 180)) focos.push("Mobilidade");
    if (focos.length === 0) focos.push("Habilidade");
    return [...new Set(focos)];
}
function checkAssimetria(val1, val2) { if (val1 > 0 && val2 > 0) return (Math.min(val1, val2) / Math.max(val1, val2)) * 100 < 90; return false; }