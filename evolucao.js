// VARIÁVEIS GLOBAIS
let allPatients = [];
let charts = {};
let pacienteAtualId = null;
let gerenciarModalEl = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    loadPatients();
});

// ===== GERENCIAR SESSÕES (EDITAR / EXCLUIR AVALIAÇÕES) =====
function ensureGerenciarUI() {
    // 1) Botão no header do dashboard (criado via JS para não mexer no layout base)
    const actions = document.querySelector('#dashboard-view .header-actions');
    if (actions && !actions.querySelector('[data-action="gerenciar-sessoes"]')) {
        const btn = document.createElement('button');
        btn.className = 'btn-add-data';
        btn.setAttribute('data-action', 'gerenciar-sessoes');
        btn.style.opacity = '0.95';
        btn.innerHTML = '<i class="fas fa-edit"></i> Gerenciar Sessões';
        btn.onclick = () => abrirGerenciarSessoes();
        actions.appendChild(btn);
    }

    // 2) Modal (criado 1x)
    if (!gerenciarModalEl) {
        gerenciarModalEl = document.createElement('div');
        gerenciarModalEl.id = 'modal-gerenciar-sessoes';
        gerenciarModalEl.style.cssText = [
            'position:fixed',
            'inset:0',
            'display:none',
            'align-items:center',
            'justify-content:center',
            'background:rgba(0,0,0,0.65)',
            'z-index:9999',
            'padding:16px'
        ].join(';');
        gerenciarModalEl.innerHTML = `
          <div style="width:min(720px, 96vw); max-height:80vh; overflow:auto; background:#0b1020; border:1px solid rgba(255,255,255,0.10); border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.5);">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.08);">
              <div>
                <div style="font-weight:700; color:#fff; font-size:1.05rem;">Gerenciar sessões</div>
                <div style="opacity:.8; color:#cbd5e1; font-size:.9rem;">Editar ou excluir avaliações já salvas.</div>
              </div>
              <button id="btn-fechar-gerenciar" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); color:#fff; border-radius:10px; padding:8px 12px; cursor:pointer;">Fechar</button>
            </div>
            <div id="lista-sessoes" style="padding:10px 12px;"></div>
          </div>
        `;
        document.body.appendChild(gerenciarModalEl);
        gerenciarModalEl.addEventListener('click', (e) => {
            if (e.target === gerenciarModalEl) fecharGerenciarSessoes();
        });
        const btnFechar = gerenciarModalEl.querySelector('#btn-fechar-gerenciar');
        if (btnFechar) btnFechar.onclick = () => fecharGerenciarSessoes();
    }
}

function abrirGerenciarSessoes() {
    if (!pacienteAtualId) return;
    ensureGerenciarUI();
    atualizarListaSessoes();
    gerenciarModalEl.style.display = 'flex';
}

function fecharGerenciarSessoes() {
    if (gerenciarModalEl) gerenciarModalEl.style.display = 'none';
}

function getPacienteAtual() {
    return allPatients.find(p => p.id === pacienteAtualId) || null;
}

function atualizarListaSessoes() {
    const paciente = getPacienteAtual();
    if (!paciente || !gerenciarModalEl) return;

    const container = gerenciarModalEl.querySelector('#lista-sessoes');
    if (!container) return;

    const historico = (paciente.historicoAvaliacoes || []).slice().sort((a, b) => new Date(b.data) - new Date(a.data));
    if (historico.length === 0) {
        container.innerHTML = '<div style="padding:14px; color:#cbd5e1; opacity:.85;">Nenhuma sessão salva ainda.</div>';
        return;
    }

    // Para permitir editar/excluir por índice real, precisamos mapear para o índice original.
    // Criamos uma lista com {idxOriginal, data}
    const lista = (paciente.historicoAvaliacoes || []).map((h, idx) => ({ idx, h }))
        .sort((a, b) => new Date(b.h.data) - new Date(a.h.data));

    container.innerHTML = '';
    lista.forEach(({ idx, h }) => {
        const dt = h.data ? new Date(h.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Sem data';
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 10px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; margin:8px 0; background:rgba(255,255,255,0.03);';
        row.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:2px;">
            <div style="color:#fff; font-weight:700;">Sessão: ${dt}</div>
            <div style="color:#cbd5e1; opacity:.85; font-size:.88rem;">Clique em editar para ajustar os valores desta sessão.</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button data-edit="${idx}" style="background:rgba(167,139,250,0.12); border:1px solid rgba(167,139,250,0.35); color:#e9d5ff; border-radius:10px; padding:8px 10px; cursor:pointer;">Editar</button>
            <button data-del="${idx}" style="background:rgba(255,0,0,0.10); border:1px solid rgba(255,0,0,0.30); color:#ffb4b4; border-radius:10px; padding:8px 10px; cursor:pointer;">Excluir</button>
          </div>
        `;
        container.appendChild(row);
    });

    container.querySelectorAll('button[data-edit]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.getAttribute('data-edit'));
            editarSessao(idx);
        });
    });

    container.querySelectorAll('button[data-del]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.getAttribute('data-del'));
            excluirSessao(idx);
        });
    });
}

function editarSessao(idxHistorico) {
    if (!pacienteAtualId) return;
    // Passa para a tela de cadastro/avaliação com índice para edição
    localStorage.setItem('select_paciente_existente_pre', pacienteAtualId);
    localStorage.setItem('edit_avaliacao_paciente_id', pacienteAtualId);
    localStorage.setItem('edit_avaliacao_index', String(idxHistorico));
    window.location.href = 'cadastro.html';
}

function excluirSessao(idxHistorico) {
    const paciente = getPacienteAtual();
    if (!paciente) return;

    const historico = paciente.historicoAvaliacoes || [];
    if (!historico[idxHistorico]) return;

    const dt = historico[idxHistorico].data ? new Date(historico[idxHistorico].data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Sem data';
    if (!confirm(`Excluir a sessão de ${dt}?\nIsso não pode ser desfeito.`)) return;

    historico.splice(idxHistorico, 1);
    paciente.historicoAvaliacoes = historico;

    // Atualiza ultimaAvaliacao (fica a mais recente) ou limpa
    if (historico.length > 0) {
        const maisRecente = historico.slice().sort((a, b) => new Date(b.data) - new Date(a.data))[0];
        paciente.ultimaAvaliacao = maisRecente;
    } else {
        paciente.ultimaAvaliacao = null;
    }

    // Persiste
    localStorage.setItem('l7_treino_pacientes', JSON.stringify(allPatients));

    // Re-render
    atualizarListaSessoes();
    renderizarGraficos(paciente);
}

function loadPatients() {
    const data = localStorage.getItem('l7_treino_pacientes');
    allPatients = data ? JSON.parse(data) : [];
    renderPatientList();
}

// ===== NAVEGAÇÃO =====
function irParaAdicionarDados() {
    if (pacienteAtualId) {
        localStorage.setItem('select_paciente_existente_pre', pacienteAtualId);
        window.location.href = 'cadastro.html'; 
    } else {
        alert("Erro: Nenhum paciente selecionado.");
    }
}

function voltarParaLista() {
    pacienteAtualId = null;
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('patient-list-view').style.display = 'block';
    const searchInput = document.getElementById('search-patient');
    if(searchInput) { searchInput.value = ''; filtrarPacientes(); }
}

// ===== FILTROS E LISTA =====
function filtrarPacientes() {
    const termo = document.getElementById('search-patient').value.toLowerCase();
    const grid = document.getElementById('patients-grid');
    const cards = grid.getElementsByClassName('patient-card');
    let encontrouAlgum = false;
    Array.from(cards).forEach(card => {
        const nomePaciente = card.getElementsByTagName('h3')[0].textContent.toLowerCase();
        if (nomePaciente.includes(termo)) { card.style.display = "flex"; encontrouAlgum = true; } 
        else { card.style.display = "none"; }
    });
    const noMsg = document.getElementById('no-patients-msg');
    noMsg.style.display = (!encontrouAlgum && allPatients.length > 0) ? 'block' : 'none';
    if(allPatients.length === 0) noMsg.style.display = 'block';
}

function excluirPaciente(id, event) {
    event.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este paciente? Todos os dados e histórico serão apagados permanentemente.")) {
        allPatients = allPatients.filter(p => p.id !== id);
        localStorage.setItem('l7_treino_pacientes', JSON.stringify(allPatients));
        renderPatientList();
        alert("Paciente excluído com sucesso!");
    }
}

function renderPatientList() {
    const grid = document.getElementById('patients-grid');
    const noMsg = document.getElementById('no-patients-msg');
    grid.innerHTML = '';
    if (allPatients.length === 0) { noMsg.style.display = 'block'; return; } else { noMsg.style.display = 'none'; }

    allPatients.sort((a, b) => {
        const dateA = new Date(a.ultimaAvaliacao?.data || a.dataCadastro || 0);
        const dateB = new Date(b.ultimaAvaliacao?.data || b.dataCadastro || 0);
        return dateB - dateA;
    });

    allPatients.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.onclick = () => abrirDashboard(p.id);

        const dataUltima = p.ultimaAvaliacao?.data ? new Date(p.ultimaAvaliacao.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Sem dados';
        const lesao = p.localLesao || p.lesao || 'Geral';
        const focos = p.focoTreino || [];
        let focosHtml = '';
        if (focos.length > 0) focos.forEach(foco => focosHtml += `<span class="tag-box">${foco}</span>`);
        else focosHtml = `<span class="tag-box" style="opacity:0.5">Em avaliação</span>`;

        card.innerHTML = `
            <div style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
                <button onclick="excluirPaciente('${p.id}', event)" style="background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3); color: #ff6b6b; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                    <i class="fas fa-trash-alt" style="font-size: 0.9rem;"></i>
                </button>
            </div>
            <div class="card-header">
                <div class="card-avatar" style="padding: 0; overflow: hidden; background: transparent; box-shadow: none;">
                    <img src="assets/logo-site.png" alt="L7" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="card-info">
                    <h3>${p.nome}</h3>
                    <p>Última: ${dataUltima}</p>
                </div>
            </div>
            <div class="lesion-container"><span class="lesion-badge"><i class="fas fa-bone"></i> ${lesao}</span></div>
            <div class="focos-container">${focosHtml}</div>
            <div class="card-action"><i class="fas fa-chart-line"></i> Ver Evolução</div>
        `;
        grid.appendChild(card);
    });
}

// ===== DASHBOARD =====
function abrirDashboard(patientId) {
    const paciente = allPatients.find(p => p.id === patientId);
    if (!paciente) return;
    pacienteAtualId = patientId;

    document.getElementById('dash-patient-name').textContent = paciente.nome;
    const lesao = paciente.localLesao || paciente.lesao || 'Geral';
    document.getElementById('dash-lesion-area').innerHTML = `<span class="lesion-badge"><i class="fas fa-bone"></i> ${lesao}</span>`;
    const focos = paciente.focoTreino || [];
    let focosHtml = '';
    focos.forEach(foco => focosHtml += `<span class="tag-box">${foco}</span>`);
    document.getElementById('dash-tags-container').innerHTML = focosHtml;

    document.getElementById('patient-list-view').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    // garante botão/modal de gerenciamento de sessões
    ensureGerenciarUI();
    renderizarGraficos(paciente);
}

function renderizarGraficos(paciente) {
    let historico = paciente.historicoAvaliacoes || [];
    if (historico.length === 0 && paciente.ultimaAvaliacao) {
        historico = [{ data: paciente.dataCadastro, ...paciente.ultimaAvaliacao }];
    }
    historico.sort((a, b) => new Date(a.data) - new Date(b.data));

    const labels = historico.map(h => {
        if (!h.data) return '?';
        const parts = h.data.split('-'); 
        return `${parts[2]}/${parts[1]}`;
    });

    // Renderiza recomendações de membros a melhorar (última sessão)
    const ultimaSessao = historico.length ? historico[historico.length - 1] : null;
    renderImprovements(paciente, ultimaSessao);

    // DECISÃO MMII ou MMSS
    const lesao = (paciente.localLesao || '').toLowerCase();
    const lesoesMMSS = ['ombro', 'cotovelo', 'punho', 'coluna', 'superior', 'braço'];
    const lesoesMMII = ['joelho', 'tornozelo', 'quadril', 'pé', 'perna', 'inferior'];

    let isMMSS = false; // Padrão MMII

    if (lesoesMMSS.some(l => lesao.includes(l))) {
        isMMSS = true;
    } else if (lesoesMMII.some(l => lesao.includes(l))) {
        isMMSS = false;
    } else {
        const temDadosMMSS = historico.some(h => (h.ySupE > 0 || h.ySupD > 0 || h.mcc > 0 || h.gonioFlexMmss > 0 || h.scoreY_MmssE > 0));
        if (temDadosMMSS) isMMSS = true;
    }

    const ROXO_NEON = '#8B5CF6'; 
    const ROXO_ESCURO = '#6D28D9'; 
    const ROXO_MEDIO = '#7C3AED'; 
    // const BRANCO = '#ffffff'; // REMOVIDO, AGORA USAMOS ROXO

    let graficosParaRenderizar = [];

    if (isMMSS) {
        // --- MMSS ---
        const dataYE = historico.map(h => h.scoreY_MmssE || calcularScoreY(h.crMmssE, h.yMedialE, h.yInfLatE, h.ySupLatE));
        if (dataYE.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Y-Test Superior ESQUERDO (%)', datasets: [{ label: 'Esq', data: dataYE, color: ROXO_NEON }] });
        }

        const dataYD = historico.map(h => h.scoreY_MmssD || calcularScoreY(h.crMmssD, h.yMedialD, h.yInfLatD, h.ySupLatD));
        if (dataYD.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Y-Test Superior DIREITO (%)', datasets: [{ label: 'Dir', data: dataYD, color: ROXO_ESCURO }] });
        }

        const dataMCC = historico.map(h => h.mcc || 0);
        if (dataMCC.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'MCC (Repetições)', datasets: [{ label: 'Reps', data: dataMCC, color: ROXO_MEDIO }] });
        }

        const dataFlex = historico.map(h => h.gonioFlexMmss || 0);
        if (dataFlex.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Flexão de Ombro (Graus)', datasets: [{ label: 'Flexão', data: dataFlex, color: ROXO_NEON }] });
        }

        const dataAbd = historico.map(h => h.gonioAbdMmss || 0);
        if (dataAbd.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Abdução de Ombro (Graus)', datasets: [{ label: 'Abdução', data: dataAbd, color: ROXO_ESCURO }] });
        }

        // Gráfico EVA MMSS
        const dataEVA = historico.map(h => h.evaMmss || 0);
        if (historico.length > 0) {
            // CORREÇÃO: Usei ROXO_NEON em vez de BRANCO
            graficosParaRenderizar.push({ title: 'Escala de Dor (EVA 0-10)', datasets: [{ label: 'Dor', data: dataEVA, color: ROXO_NEON }] });
        }

    } else {
        // --- MMII ---
        const dataHopE = historico.map(h => h.hopE || 0);
        if (dataHopE.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Hop Test ESQUERDO (cm)', datasets: [{ label: 'Esq', data: dataHopE, color: ROXO_NEON }] });
        }

        const dataHopD = historico.map(h => h.hopD || 0);
        if (dataHopD.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Hop Test DIREITO (cm)', datasets: [{ label: 'Dir', data: dataHopD, color: ROXO_ESCURO }] });
        }

        // Lunge Test (graus) - mobilidade tornozelo
        const dataLungeE = historico.map(h => h.lungeE || 0);
        const dataLungeD = historico.map(h => h.lungeD || 0);
        if (dataLungeE.some(v => v > 0) || dataLungeD.some(v => v > 0)) {
            graficosParaRenderizar.push({
                title: 'Lunge Test (Graus)',
                datasets: [
                    { label: 'Esq', data: dataLungeE, color: ROXO_NEON },
                    { label: 'Dir', data: dataLungeD, color: ROXO_ESCURO }
                ]
            });
        }

        // Rotadores de Quadril (graus)
        // IMPORTANTE: este gráfico deve aparecer para qualquer paciente (ex.: tornozelo),
        // desde que haja dados preenchidos no cadastro (rotE/rotD).
        const dataRotE = historico.map(h => h.rotE || 0);
        const dataRotD = historico.map(h => h.rotD || 0);
        if (dataRotE.some(v => v > 0) || dataRotD.some(v => v > 0)) {
            graficosParaRenderizar.push({
                title: 'Rotadores de Quadril (Graus)',
                datasets: [
                    { label: 'Esq', data: dataRotE, color: ROXO_NEON },
                    { label: 'Dir', data: dataRotD, color: ROXO_ESCURO }
                ]
            });
        }

        const dataYE = historico.map(h => h.scoreY_MmiiE || calcularScoreY(h.crMmiiE, h.yAntE, h.yPmE, h.yPlE));
        if (dataYE.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Y-Test Inferior ESQUERDO (%)', datasets: [{ label: 'Esq', data: dataYE, color: ROXO_NEON }] });
        }

        const dataYD = historico.map(h => h.scoreY_MmiiD || calcularScoreY(h.crMmiiD, h.yAntD, h.yPmD, h.yPlD));
        if (dataYD.some(v => v > 0)) {
            graficosParaRenderizar.push({ title: 'Y-Test Inferior DIREITO (%)', datasets: [{ label: 'Dir', data: dataYD, color: ROXO_ESCURO }] });
        }

        const dataCMJ = historico.map(h => h.cmj || 0);
        const dataSJ = historico.map(h => h.sj || 0);
        
        if (dataCMJ.some(v => v > 0) || dataSJ.some(v => v > 0)) {
            const pluginElasticidade = {
                id: 'elasticidadeLine',
                afterDatasetsDraw: (chart) => {
                    const { ctx } = chart;
                    if (chart.data.datasets.length < 2) return;
                    const metaCMJ = chart.getDatasetMeta(0);
                    const metaSJ = chart.getDatasetMeta(1);
                    ctx.save();
                    ctx.font = 'bold 10px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    metaCMJ.data.forEach((barCMJ, index) => {
                        const barSJ = metaSJ.data[index];
                        if (barCMJ && barSJ && !metaCMJ.hidden && !metaSJ.hidden) {
                            const valCMJ = chart.data.datasets[0].data[index];
                            const valSJ = chart.data.datasets[1].data[index];
                            if (valCMJ > 0 && valSJ > 0) {
                                ctx.beginPath();
                                ctx.moveTo(barCMJ.x, barCMJ.y);
                                ctx.lineTo(barSJ.x, barSJ.y);
                                ctx.strokeStyle = '#ffffff';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.fillStyle = '#ffffff';
                                ctx.beginPath(); ctx.arc(barCMJ.x, barCMJ.y, 4, 0, Math.PI*2); ctx.fill();
                                ctx.beginPath(); ctx.arc(barSJ.x, barSJ.y, 4, 0, Math.PI*2); ctx.fill();
                                const diff = ((valCMJ - valSJ) / valSJ) * 100;
                                const text = diff.toFixed(1) + '%';
                                const midX = (barCMJ.x + barSJ.x) / 2;
                                const midY = (barCMJ.y + barSJ.y) / 2;
                                const textWidth = ctx.measureText(text).width;
                                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                                ctx.fillRect(midX - (textWidth/2) - 3, midY - 7, textWidth + 6, 14);
                                ctx.fillStyle = '#ffffff';
                                ctx.fillText(text, midX, midY);
                            }
                        }
                    });
                    ctx.restore();
                }
            };

            graficosParaRenderizar.push({
                title: 'Potência de Salto (cm)',
                datasets: [{ label: 'CMJ', data: dataCMJ, color: ROXO_NEON }, { label: 'SJ', data: dataSJ, color: ROXO_ESCURO }],
                plugins: [pluginElasticidade]
            });
        }

        // Gráfico EVA MMII
        const dataEVA = historico.map(h => h.evaMmii || 0);
        if (historico.length > 0) {
            // CORREÇÃO: Usei ROXO_NEON em vez de BRANCO
            graficosParaRenderizar.push({ title: 'Escala de Dor (EVA 0-10)', datasets: [{ label: 'Dor', data: dataEVA, color: ROXO_NEON }] });
        }
    }

    // Renderiza
    for (let i = 0; i < 6; i++) {
        const cardId = `card-${i + 1}`;
        const canvasId = `chart${i + 1}`;
        const tituloId = `titulo-grafico-${i + 1}`;
        const cardElement = document.getElementById(cardId);
        if (i < graficosParaRenderizar.length) {
            const config = graficosParaRenderizar[i];
            if(cardElement) cardElement.style.display = 'block';
            criarGrafico(canvasId, tituloId, config.title, labels, config.datasets, config.plugins || []);
        } else {
            if(cardElement) cardElement.style.display = 'none';
        }
    }
}

function calcularScoreY(cr, v1, v2, v3) { return (cr > 0 && v1 > 0 && v2 > 0 && v3 > 0) ? Math.round(((v1 + v2 + v3) / (3 * cr)) * 100) : 0; }

function criarGrafico(canvasId, titleId, titleText, labels, datasets, extraPlugins = []) {
    const titleEl = document.getElementById(titleId); if(titleEl) titleEl.textContent = titleText;
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) charts[canvasId].destroy();

    const drawValuesPlugin = {
        id: 'drawValues',
        afterDatasetsDraw: (chart) => {
            const { ctx } = chart;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom'; 
            
            const isPercent = titleText.includes('(%)');

            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                if(meta.hidden) return;
                meta.data.forEach((bar, index) => {
                    const value = dataset.data[index];
                    if(value !== undefined && value !== null) { 
                        ctx.fillStyle = '#ffffff';
                        const text = isPercent ? value + '%' : value;
                        ctx.fillText(text, bar.x, bar.base - 5); 
                    }
                });
            });
            ctx.restore();
        }
    };

    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets.map(ds => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: ds.color,
                borderRadius: 6,
                barPercentage: 0.6
            }))
        },
        plugins: [drawValuesPlugin, ...extraPlugins], 
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: datasets.length > 1, labels: { color: '#ccc' } } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' }, beginAtZero: true },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            }
        }
    });
}

// ===== INSIGHTS: MEMBROS A MELHORAR (por testes + lesão selecionada) =====
function normalizeLesaoLabel(str) {
    if (!str) return null;
    const s = String(str).toLowerCase();
    if (s.includes('torno')) return 'Tornozelo';
    if (s.includes('joelh')) return 'Joelho';
    if (s.includes('quadr')) return 'Quadril';
    if (s.includes('pé') || s.includes('pe') || s.includes('calc')) return 'Pé';
    if (s.includes('ombro')) return 'Ombro';
    if (s.includes('cotov')) return 'Cotovelo';
    if (s.includes('punh')) return 'Punho';
    if (s.includes('colun') || s.includes('lomb') || s.includes('cerv')) return 'Coluna';
    // fallback: capitaliza primeira
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function addReason(map, joint, reason) {
    if (!joint || !reason) return;
    if (!map[joint]) map[joint] = [];
    // evita duplicatas idênticas
    if (!map[joint].includes(reason)) map[joint].push(reason);
}

function inRange(val, min, max) {
    return (typeof val === 'number' && val > 0 && val >= min && val <= max);
}

function renderImprovements(paciente, sessao) {
    const box = document.getElementById('dash-improvements');
    // A pedido do usuário: NÃO exibir uma caixa grande com lista.
    // Vamos apenas adicionar "boxes" (badges) do mesmo tipo da lesão
    // no cabeçalho (ao lado do local da lesão selecionado).
    if (box) {
        box.style.display = 'none';
        box.innerHTML = '';
    }

    const lesionContainer = document.getElementById('dash-lesion-area');
    if (!lesionContainer) return;

    // Se não tem sessão, mantém somente o local de lesão selecionado.
    if (!sessao) {
        const lesaoOnly = paciente.localLesao || paciente.lesao || 'Geral';
        lesionContainer.innerHTML = `<span class="lesion-badge"><i class="fas fa-bone"></i> ${lesaoOnly}</span>`;
        return;
    }

    const reasonsByJoint = {};

    // 1) Sempre incluir o local da lesão selecionado
    const lesaoSel = normalizeLesaoLabel(paciente.localLesao || paciente.lesao || '');
    if (lesaoSel) {
        addReason(reasonsByJoint, lesaoSel, 'Local da lesão selecionado na avaliação');
    }

    // 2) MMII — Lunge (tornozelo)
    const lE = Number(sessao.lungeE || 0);
    const lD = Number(sessao.lungeD || 0);
    const lMin = 35, lMax = 45;
    if (lE > 0 && (lE < lMin || lE > lMax)) addReason(reasonsByJoint, 'Tornozelo', `Lunge Esq fora do padrão (${lE}°)`);
    if (lD > 0 && (lD < lMin || lD > lMax)) addReason(reasonsByJoint, 'Tornozelo', `Lunge Dir fora do padrão (${lD}°)`);

    // 3) MMII — Rotadores (quadril)
    const rE = Number(sessao.rotE || 0);
    const rD = Number(sessao.rotD || 0);
    const rMin = 30, rMax = 40;
    if (rE > 0 && (rE < rMin || rE > rMax)) addReason(reasonsByJoint, 'Quadril', `Rotadores Esq fora do padrão (${rE}°)`);
    if (rD > 0 && (rD < rMin || rD > rMax)) addReason(reasonsByJoint, 'Quadril', `Rotadores Dir fora do padrão (${rD}°)`);

    // 4) MMII — Y Test inferior (score < 90)
    const yE = Number(sessao.scoreY_MmiiE || 0);
    const yD = Number(sessao.scoreY_MmiiD || 0);
    if (yE > 0 && yE < 90) {
        addReason(reasonsByJoint, 'Tornozelo', `Y-Test MMII Esq abaixo do ideal (${yE.toFixed ? yE.toFixed(1) : yE}%)`);
        addReason(reasonsByJoint, 'Joelho', `Y-Test MMII Esq abaixo do ideal (${yE.toFixed ? yE.toFixed(1) : yE}%)`);
        addReason(reasonsByJoint, 'Quadril', `Y-Test MMII Esq abaixo do ideal (${yE.toFixed ? yE.toFixed(1) : yE}%)`);
    }
    if (yD > 0 && yD < 90) {
        addReason(reasonsByJoint, 'Tornozelo', `Y-Test MMII Dir abaixo do ideal (${yD.toFixed ? yD.toFixed(1) : yD}%)`);
        addReason(reasonsByJoint, 'Joelho', `Y-Test MMII Dir abaixo do ideal (${yD.toFixed ? yD.toFixed(1) : yD}%)`);
        addReason(reasonsByJoint, 'Quadril', `Y-Test MMII Dir abaixo do ideal (${yD.toFixed ? yD.toFixed(1) : yD}%)`);
    }

    // 5) MMII — Hop (assimetria LSI < 90%)
    const hE = Number(sessao.hopE || 0);
    const hD = Number(sessao.hopD || 0);
    if (hE > 0 && hD > 0) {
        const lsi = (Math.min(hE, hD) / Math.max(hE, hD)) * 100;
        if (lsi < 90) addReason(reasonsByJoint, 'Joelho', `Hop com assimetria (${lsi.toFixed(1)}% LSI)`);
    }

    // 6) MMII — Potência (CMJ/SJ)
    const cmj = Number(sessao.cmj || 0);
    const sj = Number(sessao.sj || 0);
    if (cmj > 0 && sj > 0) {
        const diffPct = ((cmj - sj) / sj) * 100;
        // Critérios alinhados ao que já existe no definirFocosAutomaticos
        if (sj < 25 && cmj < 25) {
            addReason(reasonsByJoint, 'Quadril', `Potência baixa (CMJ ${cmj} / SJ ${sj})`);
            addReason(reasonsByJoint, 'Joelho', `Potência baixa (CMJ ${cmj} / SJ ${sj})`);
        } else if (diffPct < 10) {
            addReason(reasonsByJoint, 'Quadril', `Explosão (CMJ−SJ) baixa (${diffPct.toFixed(1)}%)`);
            addReason(reasonsByJoint, 'Joelho', `Explosão (CMJ−SJ) baixa (${diffPct.toFixed(1)}%)`);
        }
    }

    // 7) MMSS — Y Test superior (score < 80)
    const ySupE = Number(sessao.scoreY_MmssE || 0);
    const ySupD = Number(sessao.scoreY_MmssD || 0);
    if (ySupE > 0 && ySupE < 80) addReason(reasonsByJoint, 'Ombro', `Y-Test MMSS Esq abaixo do ideal (${ySupE.toFixed ? ySupE.toFixed(1) : ySupE}%)`);
    if (ySupD > 0 && ySupD < 80) addReason(reasonsByJoint, 'Ombro', `Y-Test MMSS Dir abaixo do ideal (${ySupD.toFixed ? ySupD.toFixed(1) : ySupD}%)`);

    // 8) MMSS — Goniometria (flex/abd < 180)
    const gFlex = Number(sessao.gonioFlexMmss || 0);
    const gAbd  = Number(sessao.gonioAbdMmss || 0);
    if (gFlex > 0 && gFlex < 180) addReason(reasonsByJoint, 'Ombro', `Goniometria Flexão abaixo (${gFlex}°)`);
    if (gAbd  > 0 && gAbd  < 180) addReason(reasonsByJoint, 'Ombro', `Goniometria Abdução abaixo (${gAbd}°)`);

    // 9) MMSS — MCC (heurística conservadora)
    const mcc = Number(sessao.mcc || 0);
    if (mcc > 0 && mcc < 20) addReason(reasonsByJoint, 'Ombro', `MCC abaixo do ideal (${mcc} rep)`);

    // NOVO RENDER: badges no cabeçalho
    const allJoints = Object.keys(reasonsByJoint);
    const primary = lesaoSel || normalizeLesaoLabel(paciente.localLesao || paciente.lesao || '') || 'Geral';

    // Extras: tudo que NÃO é o local de lesão selecionado
    const extras = allJoints
        .filter(j => j && j !== primary)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => a.localeCompare(b));

    const badges = [primary, ...extras]
        .filter(Boolean)
        .map(j => `<span class="lesion-badge"><i class="fas fa-bone"></i> ${j}</span>`)
        .join(' ');

    lesionContainer.innerHTML = badges;
}
