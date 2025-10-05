let chart; // Gráfico global

// Carregar agendamentos e atualizar tabela, estatísticas e gráfico
async function carregarAgendamentos(filtroNome = "", filtroData = "") {
  try {
    const res = await fetch("/api/agendamentos");
    const agendamentos = await res.json();

    // Filtrar por nome
    let listaFiltrada = agendamentos.filter(a => a.nome.toLowerCase().includes(filtroNome.toLowerCase()));

    // Filtrar por data
    if (filtroData) {
      listaFiltrada = listaFiltrada.filter(a => a.data === filtroData);
    }

    preencherTabela(listaFiltrada);
    atualizarEstatisticas(listaFiltrada);
    atualizarGrafico(listaFiltrada);

  } catch (err) {
    console.error("Erro ao carregar agendamentos:", err);
  }
}

// Preencher tabela de agendamentos
function preencherTabela(ag) {
  const tbody = document.querySelector("#tabela-agendamentos tbody");
  tbody.innerHTML = "";

  ag.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.nome}</td>
      <td>${a.telefone}</td>
      <td>${a.corte}</td>
      <td>${a.data}</td>
      <td>${a.horario}</td>
      <td>${a.status}</td>
      <td>
        <button class="acao concluir" onclick="concluir(${a.id})">Concluir</button>
        <button class="acao finalizar" onclick="finalizar(${a.id})">Finalizar</button>
        <button class="acao apagar" onclick="apagar(${a.id})">Apagar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Funções de ação
async function concluir(id) {
  await fetch(`/api/concluir/${id}`, { method: "POST" });
  atualizarFiltros();
}

async function finalizar(id) {
  await fetch(`/api/finalizar/${id}`, { method: "POST" });
  atualizarFiltros();
}

async function apagar(id) {
  await fetch(`/api/apagar/${id}`, { method: "DELETE" });
  atualizarFiltros();
}

// Estatísticas rápidas
function atualizarEstatisticas(ag) {
  const hoje = new Date().toISOString().split("T")[0];
  const totalHoje = ag.filter(a => a.data === hoje).length;
  const totalSemana = ag.filter(a => {
    const d = new Date(a.data);
    const diff = (new Date() - d) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;
  const pendentes = ag.filter(a => a.status === "Pendente").length;
  const concluidos = ag.filter(a => a.status === "Concluído").length;

  document.getElementById("total-hoje").textContent = totalHoje;
  document.getElementById("total-semana").textContent = totalSemana;
  document.getElementById("total-pendentes").textContent = pendentes;
  document.getElementById("total-concluidos").textContent = concluidos;
}

// Atualizar gráfico
function atualizarGrafico(ag) {
  const tipo = document.getElementById("agrupamento").value;

  let labels = [];
  let data = [];

  if (tipo === "dias") {
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const contagem = Array(7).fill(0);

    ag.forEach(a => {
      const d = new Date(a.data).getDay();
      contagem[d]++;
    });

    labels = dias;
    data = contagem;
  } else if (tipo === "cortes") {
    const cortes = {};
    ag.forEach(a => { cortes[a.corte] = (cortes[a.corte] || 0) + 1; });

    labels = Object.keys(cortes);
    data = Object.values(cortes);
  }

  // Destruir gráfico antigo se existir
  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: tipo === "dias" ? "bar" : "pie",
    data: {
      labels,
      datasets: [{
        label: tipo === "dias" ? "Agendamentos" : "Cortes",
        data,
        backgroundColor: [
          "#f4c542","#4caf50","#2196f3","#ff5722","#9c27b0","#00bcd4","#e91e63"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

// Atualizar ao mudar filtros
function atualizarFiltros() {
  const nome = document.getElementById("buscar-nome").value;
  const data = document.getElementById("buscar-data").value;
  carregarAgendamentos(nome, data);
}

// Eventos
document.getElementById("buscar-nome").addEventListener("input", atualizarFiltros);
document.getElementById("buscar-data").addEventListener("change", atualizarFiltros);
document.getElementById("btn-refresh").addEventListener("click", atualizarFiltros);
document.getElementById("agrupamento").addEventListener("change", atualizarFiltros);

// Tema
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("tema") === "dark") document.body.classList.add("dark");

// Logout
document.getElementById("btn-logout").addEventListener("click", () => {
  window.location.href = "/adm/login.html";
});

// Carregar inicialmente
carregarAgendamentos();
