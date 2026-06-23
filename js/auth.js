// =====================================================
// NS STORE — Autenticação com Firebase
// Login, Cadastro e Recuperação de Senha
// =====================================================

import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ===================== CADASTRO =====================
async function cadastrar() {
  const nome  = document.getElementById("cadastro-nome").value.trim();
  const email = document.getElementById("cadastro-email").value.trim();
  const senha = document.getElementById("cadastro-senha").value;
  const erro  = document.getElementById("cadastro-erro");

  if (!nome || !email || !senha) {
    erro.textContent = "Preencha todos os campos.";
    return;
  }

  if (senha.length < 6) {
    erro.textContent = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    window.location.href = "painel.html"; // redireciona após cadastro
  } catch (e) {
    erro.textContent = traduzirErro(e.code);
  }
}

// ===================== LOGIN =====================
async function login() {
  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;
  const erro  = document.getElementById("login-erro");

  if (!email || !senha) {
    erro.textContent = "Preencha todos os campos.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "painel.html"; // redireciona após login
  } catch (e) {
    erro.textContent = traduzirErro(e.code);
  }
}

// ===================== RECUPERAÇÃO DE SENHA =====================
async function recuperarSenha() {
  const email = document.getElementById("recuperar-email").value.trim();
  const erro  = document.getElementById("recuperar-erro");
  const ok    = document.getElementById("recuperar-ok");

  if (!email) {
    erro.textContent = "Digite seu e-mail.";
    ok.textContent = "";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    ok.textContent = "E-mail de recuperação enviado! Verifique sua caixa de entrada.";
    erro.textContent = "";
  } catch (e) {
    erro.textContent = traduzirErro(e.code);
    ok.textContent = "";
  }
}

// ===================== LOGOUT =====================
async function logout() {
  await signOut(auth);
  window.location.href = "index.html";
}

// ===================== TRADUTOR DE ERROS =====================
// Firebase retorna erros em inglês — traduzimos para português
function traduzirErro(codigo) {
  const erros = {
    "auth/email-already-in-use":   "Este e-mail já está cadastrado.",
    "auth/invalid-email":          "E-mail inválido.",
    "auth/weak-password":          "Senha fraca. Use pelo menos 6 caracteres.",
    "auth/user-not-found":         "Usuário não encontrado.",
    "auth/wrong-password":         "Senha incorreta.",
    "auth/invalid-credential":     "E-mail ou senha incorretos.",
    "auth/too-many-requests":      "Muitas tentativas. Tente novamente mais tarde.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet."
  };
  return erros[codigo] || "Ocorreu um erro. Tente novamente.";
}

// ===================== OBSERVADOR DE ESTADO =====================
// Verifica se o usuário já está logado ao carregar qualquer página
onAuthStateChanged(auth, (usuario) => {
  const estaNaLoginPage = window.location.pathname.includes("login.html");

  if (usuario && estaNaLoginPage) {
    // Se já está logado e tentou acessar o login, manda pro painel
    window.location.href = "painel.html";
  }

  // Atualiza o botão de login na navbar para "Minha Conta" se logado
  const btnLogin = document.querySelector("a[href='login.html']");
  if (btnLogin && usuario) {
    btnLogin.textContent = "Minha Conta";
    btnLogin.href = "painel.html";
  }
});

// Expõe as funções para o HTML poder chamar nos botões
window.login = login;
window.cadastrar = cadastrar;
window.recuperarSenha = recuperarSenha;
window.logout = logout;