document.addEventListener('DOMContentLoaded', function() {
    loadHomePatients();
});

let allHomePatients = [];



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

function loadHomePatients() {
    try {
        const data = localStorage.getItem('l7_treino_pacientes');
        allHomePatients = data ? JSON.parse(data) : [];
        renderHomeList();
    } catch (e) {
        console.error("Erro ao carregar pacientes:", e);
    }
}

// ===== FUNÇÃO DE FILTRO (PESQUISA) =====
function filtrarHome() {
    const termo = document.getElementById('search-home').value.toLowerCase();
    const grid = document.getElementById('patients-grid');
    const cards = grid.getElementsByClassName('patient-card');
    let encontrou = false;

    Array.from(cards).forEach(card => {
        const nome = card.getElementsByTagName('h3')[0].textContent.toLowerCase();
        if (nome.includes(termo)) {
            card.style.display = 'flex';
            encontrou = true;
        } else {
            card.style.display = 'none';
        }
    });

    const emptyState = document.getElementById('empty-state');
    if (!encontrou && allHomePatients.length > 0) {
        emptyState.style.display = 'block';
        emptyState.querySelector('p').textContent = `Nenhum paciente encontrado para "${termo}"`;
    } else if (allHomePatients.length === 0) {
        emptyState.style.display = 'block';
        emptyState.querySelector('p').textContent = "Nenhum paciente cadastrado.";
    } else {
        emptyState.style.display = 'none';
    }
}

// ===== FUNÇÃO DE EXCLUIR PACIENTE (NOVA) =====
function excluirPaciente(id, event) {
    // Impede que o clique no botão abra o card do paciente
    event.stopPropagation(); 

    if (confirm("Tem certeza que deseja excluir este paciente? Todos os dados e histórico serão apagados permanentemente.")) {
        // Remove do array local
        allHomePatients = allHomePatients.filter(p => p.id !== id);
        
        // Atualiza o LocalStorage
        localStorage.setItem('l7_treino_pacientes', JSON.stringify(allHomePatients));
        
        // Atualiza a tela
        renderHomeList();
        
        alert("Paciente excluído com sucesso!");
    }
}

// ===== RENDERIZAÇÃO (Cards com Botão de Excluir) =====
function renderHomeList() {
    const grid = document.getElementById('patients-grid');
    const emptyState = document.getElementById('empty-state');
    
    grid.innerHTML = '';

    if (allHomePatients.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    // Ordena: Mais recentes primeiro
    allHomePatients.sort((a, b) => {
        const dateA = new Date(a.ultimaAvaliacao?.data || a.dataCadastro || 0);
        const dateB = new Date(b.ultimaAvaliacao?.data || b.dataCadastro || 0);
        return dateB - dateA;
    });

    allHomePatients.forEach(p => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        
        // Ao clicar no card, vai para a ficha
        card.onclick = () => {
             localStorage.setItem('selectedPatientId', p.id);
             window.location.href = 'ficha.html';
        };

        const dataUltima = p.ultimaAvaliacao?.data ? new Date(p.ultimaAvaliacao.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Recém cadastrado';
        const lesao = p.localLesao || p.lesao || 'Geral';
        const focos = p.focoTreino || [];

        let focosHtml = '';
        if (focos.length > 0) {
            focos.forEach(foco => {
                focosHtml += `<span class="tag-box">${foco}</span>`;
            });
        } else {
            focosHtml = `<span class="tag-box" style="opacity:0.5">Em avaliação</span>`;
        }

        // HTML do Card (Com o botão de lixeira adicionado no topo direito)
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

            <div class="lesion-container">
                ${(() => {
                    const sessao = (p.historicoAvaliacoes && p.historicoAvaliacoes.length) ? p.historicoAvaliacoes[p.historicoAvaliacoes.length - 1] : null;
                    const joints = computeExtraJointsFromSession(p, sessao);
                    const list = [joints.primary, ...(joints.extras || [])].filter(Boolean);
                    return list.map(j => `<span class="lesion-badge"><i class="fas fa-bone"></i> ${j}</span>`).join(' ');
                })()}
            </div>

            <div class="focos-container">
                ${focosHtml}
            </div>

            <div class="card-action">
                <i class="fas fa-dumbbell"></i> Ver Ficha de Treino
            </div>
        `;
        grid.appendChild(card);
    });
}