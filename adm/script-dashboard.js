// script-dashboard.js

async function carregarAgendamentos() {
  const tabela = document.getElementById("tabela-agendamentos");

  try {
    const res = await fetch("/api/agendamentos");
    const agendamentos = await res.json();

    // Limpar linhas antigas (mantém o cabeçalho)
    tabela.innerHTML = `
      <tr>
        <th>Nome</th>
        <th>Telefone</th>
        <th>Corte</th>
        <th>Data</th>
        <th>Hora</th>
        <th>Status</th>
        <th>Ações</th>
      </tr>
    `;

    agendamentos.forEach((ag) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${ag.nome}</td>
        <td>${ag.telefone}</td>
        <td>${ag.corte}</td>
        <td>${ag.data}</td>
        <td>${ag.horario}</td>
        <td>${ag.status}</td>
        <td>
          <button class="acao concluir" onclick="concluir(${ag.id})">Concluir</button>
          <button class="acao finalizar" onclick="finalizar(${ag.id})">Finalizar</button>
          <button class="acao apagar" onclick="apagar(${ag.id})">Apagar</button>
        </td>
      `;
      tabela.appendChild(linha);
    });
  } catch (err) {
    console.error("Erro ao carregar agendamentos:", err);
  }
}

async function concluir(id) {
  const res = await fetch(`/api/concluir/${id}`, { method: "POST" });
  if (res.ok) carregarAgendamentos();
}

async function finalizar(id) {
  const res = await fetch(`/api/finalizar/${id}`, { method: "POST" });
  if (res.ok) carregarAgendamentos();
}

async function apagar(id) {
  const res = await fetch(`/api/apagar/${id}`, { method: "DELETE" });
  if (res.ok) carregarAgendamentos();
}

document.getElementById("btn-logout").addEventListener("click", () => {
  window.location.href = "/adm/login.html";
});

// Carregar agendamentos ao abrir
carregarAgendamentos();
