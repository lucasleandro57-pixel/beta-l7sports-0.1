// ===== BIBLIOTECA DE EXERCÍCIOS L7 SPORTS =====

/**
 * Base de dados completa de exercícios fisioterapêuticos
 * Cada exercício contém informações detalhadas e link para vídeo demonstrativo
 */
const EXERCISES_DATABASE = [
    // --- ENTORSE DE TORNOZELO ---
    {
        id: "tornozelo-001",
        nome: "Agachamento unilateral com giro",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Exercício para estabilidade e mobilidade de tornozelo.",
        videoUrl: "https://www.youtube.com/embed/JSy8xPtZYAw",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "tornozelo-003",
        nome: "Ativação de fibulares dinâmico",
        foco: "Estabilidade",
        descricao: "Molinete em posição de aceleração dinâmica.",
        videoUrl: "https://www.youtube.com/embed/QEkc-_TxcO4",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "tornozelo-004",
        nome: "Controle Excêntrico de Fibulares",
        foco: "Estabilidade",
        descricao: "Molinete em inversão dinâmica.",
        videoUrl: "https://www.youtube.com/embed/MH5fy6pL7u0",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "tornozelo-005",
        nome: "Rigidez de Tornozelo Step isométrico",
        foco: "Estabilidade",
        descricao: "Step isométrico unilateral.",
        videoUrl: "https://www.youtube.com/embed/vH4hXJyPNHM",
        duracao: "3x 30s",
        dificuldade: "Intermediário",
        equipamentos: "Step"
    },
    {
        id: "tornozelo-007",
        nome: "Isométrico com Perturbação",
        foco: "Estabilidade",
        descricao: "Manter a posição enquanto recebe perturbação externa.",
        videoUrl: "https://www.youtube.com/embed/ZNKlgO21qNU",
        duracao: "3x 30s",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "tornozelo-009",
        nome: "Agachamento Unilateral com Aquabag",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Agachamento unilateral segurando Aquabag.",
        videoUrl: "https://www.youtube.com/embed/2QyRicydcog",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Aquabag"
    },
    {
        id: "tornozelo-010",
        nome: "Ativação com resistência elástica",
        foco: "Força",
        descricao: "Ênfase em fibulares.",
        videoUrl: "https://www.youtube.com/embed/ZGwHzr3rHYE",
        duracao: "3x 15 reps",
        dificuldade: "Iniciante",
        equipamentos: "Elástico"
    },
    {
        id: "tornozelo-011",
        nome: "Desaceleração com Aterrissagem",
        foco: "Força",
        descricao: "Aterrissagem na ponta do pé.",
        videoUrl: "https://www.youtube.com/embed/2a0TvYFjvD8",
        duracao: "3x 8 reps",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "tornozelo-013",
        nome: "Bound Lateral Reativo",
        foco: "Potencia",
        descricao: "Salto lateral com resposta rápida.",
        videoUrl: "https://www.youtube.com/embed/8OwMZFbcGx0",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "tornozelo-014",
        nome: "Hop Lateral Reativo + Bound Lateral",
        foco: "Potencia",
        descricao: "Combinação de saltos laterais.",
        videoUrl: "https://www.youtube.com/embed/90C-4Y3LHTQ",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "tornozelo-015",
        nome: "Ativação de Fibulares na Parede",
        foco: "Potencia",
        descricao: "Com troca reativa.",
        videoUrl: "https://www.youtube.com/embed/CbvTAZL94Wg",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Parede"
    },
    {
        id: "tornozelo-017",
        nome: "Rigidez de Tornozelo com Carga",
        foco: "Potencia",
        descricao: "Variação com carga externa.",
        videoUrl: "https://www.youtube.com/embed/qHXpLboZses",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Peso"
    },
    {
        id: "tornozelo-020",
        nome: "Rigidez Reativa com Carga Instável",
        foco: "Potencia",
        descricao: "Usando Aqua Bag para instabilidade.",
        videoUrl: "https://www.youtube.com/embed/0I040F0mGBw",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Aquabag"
    },
    {
        id: "tornozelo-022",
        nome: "Salto Lateral Reativo com Wall Ball",
        foco: "Potencia",
        descricao: "Uso de bola na parede.",
        videoUrl: "https://www.youtube.com/embed/_CuR7byraaI",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Wall Ball"
    },
    {
        id: "tornozelo-023",
        nome: "Reativo com Wall Ball e Salto Unipodal",
        foco: "Potencia",
        descricao: "Variação unipodal com bola.",
        videoUrl: "https://www.youtube.com/embed/-ZBRFUX8_HQ",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Wall Ball"
    },
    {
        id: "tornozelo-024",
        nome: "Escada de Agilidade 1",
        foco: "Habilidadde",
        descricao: "Exercício básico na escada.",
        videoUrl: "https://www.youtube.com/embed/OXpBZQnPMi0",
        duracao: "3 séries",
        dificuldade: "Iniciante",
        equipamentos: "Escada de Agilidade"
    },
    {
        id: "tornozelo-025",
        nome: "Escada de Agilidade 2",
        foco: "Habilidade",
        descricao: "Variação intermediária na escada.",
        videoUrl: "https://www.youtube.com/embed/DqHz4fGm0Qs",
        duracao: "3 séries",
        dificuldade: "Intermediário",
        equipamentos: "Escada de Agilidade"
    },
    {
        id: "tornozelo-026",
        nome: "Escada de Agilidade 3",
        foco: "Habilidade",
        descricao: "Variação avançada na escada.",
        videoUrl: "https://www.youtube.com/embed/4x51EHU8PE4",
        duracao: "3 séries",
        dificuldade: "Avançado",
        equipamentos: "Escada de Agilidade"
    },
    {
        id: "tornozelo-027",
        nome: "Escada de Agilidade 4",
        foco: "Habilidade",
        descricao: "Variação complexa na escada.",
        videoUrl: "https://www.youtube.com/embed/u_bfwgTnV28",
        duracao: "3 séries",
        dificuldade: "Avançado",
        equipamentos: "Escada de Agilidade"
    },
    {
        id: "tornozelo-029",
        nome: "Skipping Duplo no Step",
        foco: "Força",
        descricao: "Trabalho de coordenação e potência no step.",
        videoUrl: "https://www.youtube.com/embed/HWgzn1Ne3bI",
        duracao: "3x 15s",
        dificuldade: "Avançado",
        equipamentos: "Step"
    },
    { 
        id: "tornozelo-030",
        nome: "Exercicio de Agilidade",
        foco: "Potencia",
        descricao: "Trabalho de velocidade unipodal.",
        videoUrl: "https://www.youtube.com/embed/ZXcXCLjjlaI",
        duracao: "3x 12s",
        dificuldade: "Avançado",
        equipamentos: "Step"
          
    

    },

    // --- TENDINOPATIA PATELAR ---
    {
        id: "patelar-001",
        nome: "Agachamento isométrico com elástico",
        foco: "Força",
        descricao: "Bilateral, foco em analgesia e força.",
        videoUrl: "https://www.youtube.com/embed/VrnTQCbFl4g",
        duracao: "5x 45s",
        dificuldade: "Iniciante",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-003",
        nome: "Agachamento unipodal (Pistol)",
        foco: "Força",
        descricao: "Com elástico para assistência.",
        videoUrl: "https://www.youtube.com/embed/NOuTAIQPgLU",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-004",
        nome: "Resposta a carga",
        foco: "Força",
        descricao: "Controle de carga e alinhamento.",
        videoUrl: "https://www.youtube.com/embed/TvjMGfxA3xI",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "patelar-005",
        nome: "Desaceleração com rotação de quadril",
        foco: "Força",
        descricao: "Controle dinâmico em rotação.",
        videoUrl: "https://www.youtube.com/embed/IVyztaFFQuU",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "patelar-006",
        nome: "Ativação excêntrica de glúteo médio",
        foco: "Força",
        descricao: "Fortalecimento lateral do quadril.",
        videoUrl: "https://www.youtube.com/embed/DV9ZeznSvxY",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-009",
        nome: "Step Down com resistência elástica",
        foco: "Estabilidade",
        descricao: "Variação com elástico.",
        videoUrl: "https://www.youtube.com/embed/ljFx1HpQ8ZY",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Step, Elástico"
    },
    {
        id: "patelar-010",
        nome: "Sentar e levantar da caixa",
        foco: "Força",
        descricao: "Com carga.",
        videoUrl: "https://www.youtube.com/embed/0eyUtyZRZ3Y",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Caixa, Peso"
    },
    {
        id: "patelar-011",
        nome: "Step down com peso",
        foco: "Força",
        descricao: "Descida controlada com carga extra.",
        videoUrl: "https://www.youtube.com/embed/bUGbWuJqDM4",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Step, Peso"
    },
    {
        id: "patelar-012",
        nome: "Squat Jump (SJ) no caixote",
        foco: "Potencia",
        descricao: "Salto partindo da isometria.",
        videoUrl: "https://www.youtube.com/embed/HP68y5aSMWI",
        duracao: "3x 6 reps",
        dificuldade: "Intermediário",
        equipamentos: "Caixote"
    },
    {
        id: "patelar-013",
        nome: "Countermovement jump (CMJ) no caixote",
        foco: "Potencia",
        descricao: "Salto com contramovimento.",
        videoUrl: "https://www.youtube.com/embed/YSQxgKSqBQI",
        duracao: "3x 6 reps",
        dificuldade: "Intermediário",
        equipamentos: "Caixote"
    },
    {
        id: "patelar-018",
        nome: "Drop Jump",
        foco: "Potencia",
        descricao: "Queda seguida de salto vertical.",
        videoUrl: "https://www.youtube.com/embed/CnQvkDQowLo",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Step/Caixa"
    },
    {
        id: "patelar-023",
        nome: "Squat Jump (SJ) Horizontal",
        foco: "Potencia",
        descricao: "Salto horizontal estático.",
        videoUrl: "https://www.youtube.com/embed/N4yxNj_Qp7s",
        duracao: "3x 6 reps",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "patelar-026",
        nome: "Salto Horizontal SJ com Elástico",
        foco: "Potencia",
        descricao: "Resistência elástica no salto.",
        videoUrl: "https://www.youtube.com/embed/L0SkvkGPsPM",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-027",
        nome: "Salto Horizontal CMJ com Elástico",
        foco: "Potencia",
        descricao: "CMJ horizontal resistido.",
        videoUrl: "https://www.youtube.com/embed/YHiYH3HMhZA",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-029",
        nome: "SJ Unipodal para o Step",
        foco: "Potencia",
        descricao: "Salto com uma perna.",
        videoUrl: "https://www.youtube.com/embed/oI9vx5PAsQs",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Step"
    },
    {
        id: "patelar-030",
        nome: "CMJ Unipodal para o Step",
        foco: "Potencia",
        descricao: "Salto dinâmico unipodal.",
        videoUrl: "https://www.youtube.com/embed/A8Z3pzjQuBA",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Step"
    },
    {
        id: "patelar-034",
        nome: "Drop Jump Unipodal",
        foco: "Potencia",
        descricao: "Queda e salto com uma perna.",
        videoUrl: "https://www.youtube.com/embed/h7a_dSpqWXw",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Step"
    },
    {
        id: "patelar-042",
        nome: "SJ Horizontal Unipodal com Elástico",
        foco: "Potencia",
        descricao: "Resistido com elástico.",
        videoUrl: "https://www.youtube.com/embed/M87VDNP5ScY",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-043",
        nome: "CMJ Horizontal Unipodal com Elástico",
        foco: "Potencia",
        descricao: "Dinâmico resistido.",
        videoUrl: "https://www.youtube.com/embed/Vvm1iaDZDWg",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-044",
        nome: "Duplo Contato Unipodal com Elástico",
        foco: "Potencia",
        descricao: "Reatividade resistida.",
        videoUrl: "https://www.youtube.com/embed/pL-T5X4Y8c8",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "patelar-045",
        nome: "Bound Horizontal",
        foco: "Potencia",
        descricao: "Saltos sucessivos horizontais.",
        videoUrl: "https://www.youtube.com/embed/LJUFFaqDdYA",
        duracao: "3x 15m",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },

    // --- IMPACTO NO QUADRIL ---
    {
        id: "quadril-001",
        nome: "Arqueiro com Elástico no Quadril",
        foco: "Mobilidade",
        descricao: "Mobilidade dinâmica com tração.",
        videoUrl: "https://www.youtube.com/embed/rLUg_FwpmnE",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "quadril-002",
        nome: "Exercício 90-90",
        foco: "Mobilidade",
        descricao: "Mobilidade de rotação de quadril.",
        videoUrl: "https://www.youtube.com/embed/i7ukvUI1ad8",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "quadril-003",
        nome: "Ativação de Glúteo Máximo",
        foco: "Força",
        descricao: "Decúbito lateral, perna estendida.",
        videoUrl: "https://www.youtube.com/embed/9QQxcEM1QDk",
        duracao: "3x 15 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "quadril-006",
        nome: "Toque em 3 Direções",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Controle multidirecional com band.",
        videoUrl: "https://www.youtube.com/embed/oN7eLgoJRwU",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Mini Band"
    },
    {
        id: "quadril-007",
        nome: "Toque Lateral Alternado",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Passada lateral com resistência.",
        videoUrl: "https://www.youtube.com/embed/CFNjDCS-zoE",
        duracao: "3x 15 reps",
        dificuldade: "Intermediário",
        equipamentos: "Mini Band"
    },
    {
        id: "quadril-008",
        nome: "Ostra em Pé com Mini Band",
        foco: "Força",
        descricao: "Variação funcional da ostra.",
        videoUrl: "https://www.youtube.com/embed/OSQqPEujw9E",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Mini Band"
    },
    {
        id: "quadril-010",
        nome: "Elevação de Quadril com Mini Band",
        foco: "Força",
        descricao: "Ponte dinâmica com abdução.",
        videoUrl: "https://www.youtube.com/embed/PTB6LTnSy2E",
        duracao: "3x 15 reps",
        dificuldade: "Intermediário",
        equipamentos: "Mini Band"
    },
    {
        id: "quadril-012",
        nome: "Elevação de Quadril Unilateral Dinâmica",
        foco: "Força",
        descricao: "Ponte unilateral dinâmica com peso.",
        videoUrl: "https://www.youtube.com/embed/6gSAByOdfB4",
        duracao: "3x 12 reps",
        dificuldade: "Avançado",
        equipamentos: "Peso"
    },
    {
        id: "quadril-013",
        nome: "Ativação de Glúteo Médio (Aviãozinho)",
        foco: "Estabilidade",
        descricao: "Aviãozinho com resistência elástica.",
        videoUrl: "https://www.youtube.com/embed/tgotz_lEOMo",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "quadril-014",
        nome: "Agachamento Unilateral Transverso",
        foco: "Força",
        descricao: "Controle em plano rotacional.",
        videoUrl: "https://www.youtube.com/embed/DbE1HzNHk1A",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadril-015",
        nome: "Propulsão com resistência elástica",
        foco: "Potencia",
        descricao: "Salto resistido para frente.",
        videoUrl: "https://www.youtube.com/embed/pBs8ijQ0LPg",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "quadril-017",
        nome: "Propulsão unipodal + Skipping",
        foco: "Potencia",
        descricao: "Salto seguido de corrida estacionária.",
        videoUrl: "https://www.youtube.com/embed/2Vj87SINC9c",
        duracao: "3x 15s",
        dificuldade: "Muito Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadril-018",
        nome: "Aceleração no caixote com carga",
        foco: "Potencia",
        descricao: "Subida rápida no caixote.",
        videoUrl: "https://www.youtube.com/embed/AXBkJIcmR2U",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Caixote, Peso"
    },

    // --- LOMBALGIA ---
    {
        id: "lombar-001",
        nome: "Extensão Lombar",
        foco: "Mobilidade",
        descricao: "Mobilização em extensão.",
        videoUrl: "https://www.youtube.com/embed/eb6747KTWTU",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "lombar-004",
        nome: "Suástica deitada",
        foco: "Mobilidade",
        descricao: "Mobilidade rotacional de tronco.",
        videoUrl: "https://www.youtube.com/embed/KGlrOrwI4KQ",
        duracao: "3x 8 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "lombar-007",
        nome: "Dead Bug",
        foco: "Força",
        descricao: "Controle de core com movimentos alternados.",
        videoUrl: "https://www.youtube.com/embed/dLgTENy0cNg",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "lombar-009",
        nome: "Ativação de core com resistência",
        foco: "Estabilidade",
        descricao: "Resistência externa.",
        videoUrl: "https://www.youtube.com/embed/5ufLPUfbiZg",
        duracao: "3x 30s",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "lombar-010",
        nome: "Core rotacional com elástico",
        foco: "Força",
        descricao: "Fortalecimento rotacional.",
        videoUrl: "https://www.youtube.com/embed/5pVMoiTeqc0",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "lombar-013",
        nome: "Core anti-rotação sobe e  desce em base de afundo",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Estabilidade em base dividida.",
        videoUrl: "https://www.youtube.com/embed/pCBKZ6dbFeo",
        duracao: "3x 30s",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },

    // --- LESÃO DE MANGUITO ---
    {
        id: "manguito-001",
        nome: "Mobilidade torácica",
        foco: "Mobilidade",
        descricao: "Liberação de movimento torácico.",
        videoUrl: "https://www.youtube.com/embed/yk9KvDTJkoQ",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "manguito-002",
        nome: "Mobilidade torácica com rolo",
        foco: "Mobilidade",
        descricao: "Uso do rolo para extensão.",
        videoUrl: "https://www.youtube.com/embed/nvun2epUSyw",
        duracao: "3x 1 min",
        dificuldade: "Iniciante",
        equipamentos: "Rolo"
    },
    {
        id: "manguito-003",
        nome: "Mobilidade com bastão rotacional",
        foco: "Mobilidade",
        descricao: "Rotação externa assistida.",
        videoUrl: "https://www.youtube.com/embed/ERK2LAmgdUM",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Bastão"
    },
    {
        id: "manguito-005",
        nome: "Mobilidade de ombro na parede",
        foco: "Mobilidade",
        descricao: "Deslizamento na parede.",
        videoUrl: "https://www.youtube.com/embed/XeH-iM7LE08",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Parede"
    },
    {
        id: "manguito-007",
        nome: "Isometria de Ombro com Super Band",
        foco: "Força",
        descricao: "Fortalecimento isométrico.",
        videoUrl: "https://www.youtube.com/embed/I_j9VQFqPM4",
        duracao: "3x 30s",
        dificuldade: "Intermediário",
        equipamentos: "Super Band"
    },
    {
        id: "manguito-008",
        nome: "Ativação de Serrátil Deitado",
        foco: "Força",
        descricao: "Com miniband.",
        videoUrl: "https://www.youtube.com/embed/Q1yzKthW60o",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Mini Band"
    },
    {
        id: "manguito-009",
        nome: "Ativação de Serrátil em Pé",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Slide na parede.",
        videoUrl: "https://www.youtube.com/embed/ofP6jejwlCA",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Mini Band"
    },
    {
        id: "manguito-010",
        nome: "Ativação de Serrátil Anterior (Band)",
        foco: "Força",
        descricao: "Em pé com super band.",
        videoUrl: "https://www.youtube.com/embed/ypHEmYiUSLY",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Super Band"
    },
    {
        id: "manguito-011",
        nome: "Ativação de Trapézio Inferior",
        foco: "Força",
        descricao: "Exercício Y no chão.",
        videoUrl: "https://www.youtube.com/embed/EtZt1iuGoYM",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "manguito-012",
        nome: "Ativação de Trapézio Inferior (Band)",
        foco: "Força",
        descricao: "Em pé com resistência.",
        videoUrl: "https://www.youtube.com/embed/ByqCv0mU8tU",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Super Band"
    },
    {
        id: "manguito-013",
        nome: "Estabilidade de Ombro (Ajoelhado)",
        foco: "Estabilidade",
        descricao: "Isometria bilateral com band.",
        videoUrl: "https://www.youtube.com/embed/oLNnpLW6NYo",
        duracao: "3x 30s",
        dificuldade: "Intermediário",
        equipamentos: "Super Band"
    },
    {
        id: "manguito-014",
        nome: "Estabilidade em Anti-Flexão Lateral",
        foco: "Estabilidade",
        descricao: "Isometria unilateral.",
        videoUrl: "https://www.youtube.com/embed/-quVcJ33HsY",
        duracao: "3x 20s",
        dificuldade: "Avançado",
        equipamentos: "Super Band"
    },
    {
        id: "manguito-015",
        nome: "Toque no Ombro",
        foco: "Estabilidade",
        descricao: "Em posição de prancha.",
        videoUrl: "https://www.youtube.com/embed/NxpUw02E0hs",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "manguito-017",
        nome: "Arrastando o Peso",
        foco: "Estabilidade",
        descricao: "Controle em posição de prancha.",
        videoUrl: "https://www.youtube.com/embed/HTwHPNwQ_mk",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Peso"
    },

    // --- FASCITE PLANTAR ---
    {
        id: "fascite-001",
        nome: "Footcore Isométrico em Pé",
        foco: "Força",
        descricao: "Ativação do arco plantar.",
        videoUrl: "https://www.youtube.com/embed/hPTEwiFinAE",
        duracao: "3x 30s",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "fascite-002",
        nome: "Footcore dinâmico com elástico",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Fortalecimento intrínseco.",
        videoUrl: "https://www.youtube.com/embed/IbuG2d-V7gw",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "fascite-005",
        nome: "Mecanismo do Molinete Dinâmico",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Com elástico.",
        videoUrl: "https://www.youtube.com/embed/dzZMtXgFCQc",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "fascite-006",
        nome: "Step Duplo Isométrico",
        foco: "Estabilidade",
        descricao: "Sustentação no step.",
        videoUrl: "https://www.youtube.com/embed/hH58YGxWK8Q",
        duracao: "3x 30s",
        dificuldade: "Iniciante",
        equipamentos: "Step"
    },
    {
        id: "fascite-007",
        nome: "Step Duplo Dinâmico",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Panturrilha no step.",
        videoUrl: "https://www.youtube.com/embed/VcYblK8YXKo",
        duracao: "3x 15 reps",
        dificuldade: "Iniciante",
        equipamentos: "Step"
    },
    {
        id: "fascite-008",
        nome: "Step trocando peso",
        foco: "Estabilidade",
        descricao: "Transferência de carga.",
        videoUrl: "https://www.youtube.com/embed/cjbEqVYOaRY",
        duracao: "3x 1 min",
        dificuldade: "Intermediário",
        equipamentos: "Step"
    },
    {
        id: "fascite-009",
        nome: "Mobilidade de tornozelo (MWM)",
        foco: "Mobilidade",
        descricao: "Anteriorização de tíbia.",
        videoUrl: "https://www.youtube.com/embed/sf0j9xTxPFg",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "fascite-010",
        nome: "Mecanismo de Windlass na Parede",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Com elástico no hálux.",
        videoUrl: "https://www.youtube.com/embed/F3cxVv34g6s",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Elástico"
    },
    {
        id: "fascite-011",
        nome: "Ativação de tibial posterior",
        foco: "Estabilidade",
        descricao: "Foco em estabilidade.",
        videoUrl: "https://www.youtube.com/embed/YzpPlZ7XrWg",
        duracao: "3x 12 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "fascite-012",
        nome: "Ativação tibial post. (Mob/Estab)",
        foco: "Mobilidade sobre Estabilidade",
        descricao: "Mobilidade sobre estabilidade.",
        videoUrl: "https://www.youtube.com/embed/D2sE0Ux9lzE",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "fascite-013",
        nome: "Rigidez de tornozelo (Saltitos)",
        foco: "Estabilidade",
        descricao: "Pliometria baixa.",
        videoUrl: "https://www.youtube.com/embed/I8VH-74tVLs",
        duracao: "3x 20s",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "fascite-015",
        nome: "Mecanismo de garra (Short Foot)",
        foco: "Força",
        descricao: "Fortalecimento do arco.",
        videoUrl: "https://www.youtube.com/embed/l7qu68g2m-Q",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },

    // --- ESTIRAMENTO QUADRÍCEPS ---
    {
        id: "quadriceps-001",
        nome: "Pré pliometria unilateral",
        foco: "Potencia",
        descricao: "Preparação para saltos unilateral.",
        videoUrl: "https://www.youtube.com/embed/bJ3XFYCN7Zw",
        duracao: "3x 8 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-002",
        nome: "Aterrissagem Diagonal",
        foco: "Potencia",
        descricao: "Base de afundo.",
        videoUrl: "https://www.youtube.com/embed/3OlUUkQ_g7Y",
        duracao: "3x 8 reps",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-004",
        nome: "Desaceleração Guiada no Solo",
        foco: "Força",
        descricao: "Absorção no chão.",
        videoUrl: "https://www.youtube.com/embed/DSlExQVAHoc",
        duracao: "3x 8 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-006",
        nome: "Desaceleração Dupla com Super Band",
        foco: "Força",
        descricao: "Intensidade maior.",
        videoUrl: "https://www.youtube.com/embed/gaIZCXd5JK8",
        duracao: "3x 6 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Super Band"
    },
    {
        id: "quadriceps-007",
        nome: "Flexão nórdica invertida",
        foco: "Força",
        descricao: "Excêntrico de quadríceps.",
        videoUrl: "https://www.youtube.com/embed/h2mFf0vhtig",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-008",
        nome: "Salto vertical base alternada",
        foco: "Potencia",
        descricao: "Salto com troca de base.",
        videoUrl: "https://www.youtube.com/embed/frSgjpX7AYE",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-009",
        nome: "Desaceleração com salto",
        foco: "Potencia",
        descricao: "Foco na aterrissagem.",
        videoUrl: "https://www.youtube.com/embed/gBCrEtHgC7c",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-010",
        nome: "Salto vertical base alternada (Variação)",
        foco: "Potencia",
        descricao: "Outra variação de base.",
        videoUrl: "https://www.youtube.com/embed/4hNZtY06o7c",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-017",
        nome: "Drop Jump bipodal com carga",
        foco: "Força",
        descricao: "Queda e salto com peso.",
        videoUrl: "https://www.youtube.com/embed/INWiS0kRTvw",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Step, Peso"
    },
    {
        id: "quadriceps-018",
        nome: "SJ unilateral",
        foco: "Potencia",
        descricao: "Salto unipodal estático.",
        videoUrl: "https://www.youtube.com/embed/Bpeg1aflp-4",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-019",
        nome: "CMJ unilateral",
        foco: "Potencia",
        descricao: "Salto unipodal dinâmico.",
        videoUrl: "https://www.youtube.com/embed/edWILEL380g",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-020",
        nome: "Drop Jump unipodal",
        foco: "Potencia",
        descricao: "Queda e salto unipodal.",
        videoUrl: "https://www.youtube.com/embed/h7a_dSpqWXw",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Step"
    },
    {
        id: "quadriceps-021",
        nome: "SJ unipodal com carga externa",
        foco: "Potencia",
        descricao: "Salto unipodal com peso.",
        videoUrl: "https://www.youtube.com/embed/BM7baj7R5cU",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Peso"
    },
    {
        id: "quadriceps-022",
        nome: "CMJ unipodal com carga externa",
        foco: "Potencia",
        descricao: "Salto dinâmico com peso.",
        videoUrl: "https://www.youtube.com/embed/hBzlia5qiSs",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Peso"
    },
    {
        id: "quadriceps-024",
        nome: "Drop jump unipodal com carga",
        foco: "Potencia",
        descricao: "Drop jump unipodal com peso.",
        videoUrl: "https://www.youtube.com/embed/Cds0bjg4nVM",
        duracao: "3x 5 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Step, Peso"
    },
    {
        id: "quadriceps-028",
        nome: "SJ bipodal com elástico",
        foco: "Potencia",
        descricao: "Salto resistido.",
        videoUrl: "https://www.youtube.com/embed/L0SkvkGPsPM",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "quadriceps-029",
        nome: "CMJ bipodal com elástico",
        foco: "Potencia",
        descricao: "Salto dinâmico resistido.",
        videoUrl: "https://www.youtube.com/embed/YHiYH3HMhZA",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Elástico"
    },
    {
        id: "quadriceps-031",
        nome: "SJ unipodal horizontal",
        foco: "Potencia",
        descricao: "Salto horizontal com uma perna.",
        videoUrl: "https://www.youtube.com/embed/9OBn9TdWCpI",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "quadriceps-032",
        nome: "CMJ unipodal horizontal",
        foco: "Potencia",
        descricao: "Salto dinâmico horizontal unipodal.",
        videoUrl: "https://www.youtube.com/embed/9NmeHQvQ9rI",
        duracao: "3x 5 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },

    // --- ESTIRAMENTO POSTERIOR ---
    
    {
        id: "posterior-003",
        nome: "Mobilidade de quadril + ativação",
        foco: "Mobilidade",
        descricao: "Dinâmico.",
        videoUrl: "https://www.youtube.com/embed/Nk0NWIQwpVI",
        duracao: "3x 10 reps",
        dificuldade: "Iniciante",
        equipamentos: "Nenhum"
    },
    {
        id: "posterior-004",
        nome: "Elevação de quadril unilateral",
        foco: "Força",
        descricao: "Ponte com pé elevado na caixa.",
        videoUrl: "https://www.youtube.com/embed/a7l5qAeR9gw",
        duracao: "3x 12 reps",
        dificuldade: "Intermediário",
        equipamentos: "Caixa"
    },
    {
        id: "posterior-005",
        nome: "Excêntrico de isquiotibiais",
        foco: "Força",
        descricao: "Controle na descida.",
        videoUrl: "https://www.youtube.com/embed/vhbBELEf2WU",
        duracao: "3x 8 reps",
        dificuldade: "Intermediário",
        equipamentos: "Nenhum"
    },
    {
        id: "posterior-006",
        nome: "Posterior pliométrica",
        foco: "Potencia",
        descricao: "Movimento rápido.",
        videoUrl: "https://www.youtube.com/embed/gFNMyltrOkk",
        duracao: "3x 8 reps",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "posterior-007",
        nome: "Posterior trocando a base",
        foco: "Força",
        descricao: "Dinâmico com troca.",
        videoUrl: "https://www.youtube.com/embed/CNGq8cJGzds",
        duracao: "3x 15s",
        dificuldade: "Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "posterior-010",
        nome: "Potência na bola suíça",
        foco: "Potencia",
        descricao: "Chute na bola.",
        videoUrl: "https://www.youtube.com/embed/5mJaifogHho",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Bola Suíça"
    },
    {
        id: "posterior-011",
        nome: "Flexão nórdica",
        foco: "Força",
        descricao: "Clássico excêntrico.",
        videoUrl: "https://www.youtube.com/embed/eUF3L6d-jbo",
        duracao: "3x 6 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Nenhum"
    },
    {
        id: "posterior-012",
        nome: "Stiff unilateral",
        foco: "Força",
        descricao: "Controle posterior.",
        videoUrl: "https://www.youtube.com/embed/atJJ_WXYeQg",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Peso"
    },
    {
        id: "posterior-016",
        nome: "Isometria em CCA",
        foco: "Força",
        descricao: "Cadeira extensora adaptada.",
        videoUrl: "https://www.youtube.com/embed/KcwbOThU2t8",
        duracao: "3x 30s",
        dificuldade: "Intermediário",
        equipamentos: "Máquina/Elástico"
    },
    {
        id: "posterior-018",
        nome: "Concêntrico e excêntrico CCA",
        foco: "Força",
        descricao: "Movimento completo.",
        videoUrl: "https://www.youtube.com/embed/l4qOt3xlun4",
        duracao: "3x 10 reps",
        dificuldade: "Intermediário",
        equipamentos: "Máquina/Elástico"
    },
    {
        id: "posterior-019",
        nome: "Avião + puxada horizontal",
        foco: "Potencia",
        descricao: "Equilíbrio com força.",
        videoUrl: "https://www.youtube.com/embed/7uc7W22AdY8",
        duracao: "3x 10 reps",
        dificuldade: "Avançado",
        equipamentos: "Cabo/Elástico"
    },
    {
        id: "posterior-020",
        nome: "Box sprint start",
        foco: "Potencia",
        descricao: "Saída de velocidade.",
        videoUrl: "https://www.youtube.com/embed/DjMSPtbHnNM",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Caixa"
    },
    {
        id: "posterior-021",
        nome: "Box sprint start com elástico",
        foco: "Potencia",
        descricao: "Saída resistida.",
        videoUrl: "https://www.youtube.com/embed/spYtUiQwA5k",
        duracao: "3x 6 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Caixa, Elástico"
    },
    {
        id: "posterior-022",
        nome: "Box sprint start com carga",
        foco: "Potencia",
        descricao: "Saída com peso.",
        videoUrl: "https://www.youtube.com/embed/8CaWIvrZOMk",
        duracao: "3x 6 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Caixa, Peso"
    },
    {
        id: "posterior-023",
        nome: "Box sprint start + skipping",
        foco: "Potencia",
        descricao: "Saída seguida de corrida.",
        videoUrl: "https://www.youtube.com/embed/JzbYKtdT_TA",
        duracao: "3x 10m",
        dificuldade: "Muito Avançado",
        equipamentos: "Caixa"
    },
    {
        id: "posterior-024",
        nome: "Box sprint start elástico (Variação)",
        foco: "Potencia",
        descricao: "Outra variação resistida.",
        videoUrl: "https://www.youtube.com/embed/CWcKCMrroSQ",
        duracao: "3x 6 reps",
        dificuldade: "Muito Avançado",
        equipamentos: "Caixa, Elástico"
    },
    {
        id: "posterior-025",
        nome: "Reativo com Wall ball",
        foco: "Potencia",
        descricao: "Salto com bola.",
        videoUrl: "https://www.youtube.com/embed/-ZBRFUX8_HQ",
        duracao: "3x 6 reps",
        dificuldade: "Avançado",
        equipamentos: "Wall Ball"
    },
    {
        id: "posterior-026",
        nome: "propulsão com resistencia elastica",
        foco: "Potencia",
        descricao: "exercicio para ganho de pontecia",
        videoUrl: "https://www.youtube.com/embed/pBs8ijQ0LPg",
        duracao: "3x 8 reps.",
        dificuldade: "iniciante",
        equipamentos: "elastico"
    },
    {
        id: "posterior-027",
        nome: "Propulsão com resistência elástica",
        foco: "Potencia",
        descricao: "exercicio para ganho de pontecia",
        videoUrl: "https://www.youtube.com/embed/pBs8ijQ0LPg",
        duracao: "3x 8 reps.",
        dificuldade: "iniciante",
        equipamentos: "elastico"
    }
];

function getAllExercises() {
    return EXERCISES_DATABASE;

}

function getExercisesByFocusAndLocation(foco, local) {

}

/**
 * Função INTELIGENTE para filtrar exercícios por Foco e Local da Lesão
 * (Resolve o erro de carregamento da ficha)
 */
function getExercisesByFocusAndLocation(foco, local) {
    const todosExercicios = getAllExercises();
    
    // Normaliza os textos para evitar erros de maiúsculas/minúsculas
    const localNormalizado = local ? local.toLowerCase() : "";
    
    return todosExercicios.filter(ex => {
        // 1. Verifica se o FOCO bate (ex: "Força", "Mobilidade")
        const matchFoco = ex.foco === foco;
        
        if (!matchFoco) return false;

        // 2. Verifica se o LOCAL bate (usando o ID para identificar)
        // Isso conecta sua lista atual (que tem IDs como 'patelar', 'tornozelo') com a seleção do paciente
        const id = ex.id.toLowerCase();
        let matchLocal = false;

        if (localNormalizado === "tornozelo") {
            matchLocal = id.includes("tornozelo") || id.includes("fascite");
        } else if (localNormalizado === "joelho") {
            matchLocal = id.includes("patelar") || id.includes("quadriceps") || id.includes("posterior");
        } else if (localNormalizado === "ombro") {
            matchLocal = id.includes("manguito");
        } else if (localNormalizado === "coluna") {
            matchLocal = id.includes("lombar");
        } else if (localNormalizado === "quadril") {
            matchLocal = id.includes("quadril");
        } else {
            // Se for outro local (ex: punho) ou se o exercício servir pra tudo, deixa passar
            matchLocal = true; 
        }

        return matchLocal;
    });
}