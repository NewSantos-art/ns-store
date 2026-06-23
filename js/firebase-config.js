// =====================================================
// NS STORE — Configuração do Firebase
// =====================================================

// Importa o Firebase via CDN (versão modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX3eaDPChSS2SPH2nqAs_7jYlhuoxQPng",
  authDomain: "ns-store-89890.firebaseapp.com",
  projectId: "ns-store-89890",
  storageBucket: "ns-store-89890.firebasestorage.app",
  messagingSenderId: "1014431939102",
  appId: "1:1014431939102:web:001ce4da4b5c54892d4c0f"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o objeto de autenticação para ser usado nos outros arquivos
export const auth = getAuth(app);