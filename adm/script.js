const formLogin = document.getElementById("form-login");

if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = e.target.usuario.value.trim();
    const senha = e.target.senha.value.trim();

    // 🔐 Login atualizado
    if (usuario === "Samuel000" && senha === "07112002") {
      localStorage.setItem("admLogado", "true"); // grava login
      window.location.href = "dashboard.html"; // redireciona para o dashboard
    } else {
      document.getElementById("msgErro").textContent =
        "Usuário ou senha incorretos!";
    }
  });
}
  