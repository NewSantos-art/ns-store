// =====================================================
// NS STORE — Painel do Cliente
// Exibe dados do usuário logado e protege a página
// =====================================================

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Formata uma data timestamp do Firebase para dd/mm/aaaa
function formatarData(dataISO) {
  if (!dataISO) return "—";
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
}

// Observa o estado do login
onAuthStateChanged(auth, (usuario) => {
  if (!usuario) {
    // Usuário não está logado — redireciona pro login
    window.location.href = "login.html";
    return;
  }

  // Preenche o cabeçalho com o e-mail do usuário
  const emailHeader = document.getElementById("painel-email");
  if (emailHeader) {
    emailHeader.textContent = "Olá, " + usuario.email;
  }

  // Preenche os dados cadastrais
  const dadosEmail = document.getElementById("dados-email");
  const dadosUid = document.getElementById("dados-uid");
  const dadosCriacao = document.getElementById("dados-criacao");
  const dadosUltimoLogin = document.getElementById("dados-ultimo-login");

  if (dadosEmail) dadosEmail.textContent = usuario.email;
  if (dadosUid) dadosUid.textContent = usuario.uid;
  if (dadosCriacao) dadosCriacao.textContent = formatarData(usuario.metadata.creationTime);
  if (dadosUltimoLogin) dadosUltimoLogin.textContent = formatarData(usuario.metadata.lastSignInTime);
});