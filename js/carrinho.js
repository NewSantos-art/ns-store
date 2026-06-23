// =====================================================
// NS STORE — Carrinho de Compras
// localStorage + ViaCEP para cálculo de frete
// =====================================================

// ===================== FUNÇÕES BASE DO CARRINHO =====================

// Lê o carrinho do localStorage (retorna array vazio se não existir)
function obterCarrinho() {
  return JSON.parse(localStorage.getItem("ns-carrinho")) || [];
}

// Salva o carrinho no localStorage
function salvarCarrinho(carrinho) {
  localStorage.setItem("ns-carrinho", JSON.stringify(carrinho));
  atualizarBadge();
}

// Atualiza o número no ícone do carrinho na navbar
function atualizarBadge() {
  const carrinho = obterCarrinho();
  const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const badges = document.querySelectorAll(".ns-cart-badge");
  badges.forEach(badge => badge.textContent = total);
}

// Formata valor em Real brasileiro
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ===================== ADICIONAR AO CARRINHO =====================
// Chamada pelos botões de produto no catalogo.js
function adicionarAoCarrinho(id, nome, preco) {
  const carrinho = obterCarrinho();
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }

  salvarCarrinho(carrinho);
  mostrarToast(nome + " adicionado ao carrinho!");
}

// ===================== REMOVER DO CARRINHO =====================
function removerDoCarrinho(id) {
  let carrinho = obterCarrinho();
  carrinho = carrinho.filter(item => item.id !== id);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

// ===================== ALTERAR QUANTIDADE =====================
function alterarQuantidade(id, delta) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(item => item.id === id);

  if (item) {
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }
  }

  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

// ===================== TOAST DE CONFIRMAÇÃO =====================
function mostrarToast(mensagem) {
  const toast = document.getElementById("ns-toast");
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.add("ns-toast-visible");
  setTimeout(() => toast.classList.remove("ns-toast-visible"), 2500);
}

// ===================== RENDERIZAR CARRINHO =====================
function renderizarCarrinho() {
  const container = document.getElementById("carrinho-container");
  const resumo = document.getElementById("carrinho-resumo");
  if (!container) return;

  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="ns-carrinho-vazio">
        <i class="bi bi-cart-x"></i>
        <p>Seu carrinho está vazio.</p>
        <a href="catalogo.html" class="btn ns-btn-primary mt-2">Ver Catálogo</a>
      </div>`;
    if (resumo) resumo.classList.add("d-none");
    return;
  }

  // Monta a lista de itens
  container.innerHTML = carrinho.map(item => `
    <div class="ns-carrinho-item">
      <div class="ns-carrinho-info">
        <p class="ns-carrinho-nome">${item.nome}</p>
        <p class="ns-carrinho-preco">${formatarPreco(item.preco)} cada</p>
      </div>
      <div class="ns-carrinho-qtd">
        <button onclick="alterarQuantidade(${item.id}, -1)"><i class="bi bi-dash"></i></button>
        <span>${item.quantidade}</span>
        <button onclick="alterarQuantidade(${item.id}, 1)"><i class="bi bi-plus"></i></button>
      </div>
      <div class="ns-carrinho-subtotal">
        ${formatarPreco(item.preco * item.quantidade)}
      </div>
      <button class="ns-carrinho-remover" onclick="removerDoCarrinho(${item.id})">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `).join("");

  // Atualiza o resumo
  if (resumo) {
    resumo.classList.remove("d-none");
    const subtotal = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
    const frete = parseFloat(document.getElementById("frete-valor")?.dataset.frete || 0);
    const total = subtotal + frete;

    document.getElementById("resumo-subtotal").textContent = formatarPreco(subtotal);
    document.getElementById("resumo-total").textContent = formatarPreco(total);
  }
}

// ===================== VIÁCEP — BUSCA DE ENDEREÇO =====================
async function buscarCEP() {
  const cepInput = document.getElementById("cep-input");
  const cepResultado = document.getElementById("cep-resultado");
  const freteValor = document.getElementById("frete-valor");
  const cep = cepInput.value.replace(/\D/g, ""); // remove caracteres não numéricos

  if (cep.length !== 8) {
    cepResultado.textContent = "CEP inválido. Digite 8 números.";
    cepResultado.style.color = "#F87171";
    return;
  }

  cepResultado.textContent = "Buscando...";
  cepResultado.style.color = "var(--ns-text-muted)";

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      cepResultado.textContent = "CEP não encontrado.";
      cepResultado.style.color = "#F87171";
      return;
    }

    // Calcula frete fictício baseado no estado
    const fretePorEstado = {
      "TO": 15.90, "GO": 19.90, "MT": 22.90, "MS": 22.90,
      "SP": 24.90, "RJ": 27.90, "MG": 24.90, "RS": 29.90,
      "SC": 27.90, "PR": 25.90, "BA": 29.90, "PE": 31.90,
      "CE": 31.90, "AM": 39.90, "PA": 34.90
    };
    const frete = fretePorEstado[dados.uf] || 34.90;

    cepResultado.innerHTML = `
      <i class="bi bi-geo-alt-fill" style="color:var(--ns-cyan)"></i>
      ${dados.logradouro ? dados.logradouro + ", " : ""}
      ${dados.bairro ? dados.bairro + " — " : ""}
      ${dados.localidade}/${dados.uf}
    `;
    cepResultado.style.color = "var(--ns-text)";

    // Atualiza o frete no resumo
    if (freteValor) {
      freteValor.textContent = formatarPreco(frete);
      freteValor.dataset.frete = frete;
    }

    renderizarCarrinho(); // recalcula o total com o frete

  } catch (erro) {
    cepResultado.textContent = "Erro ao buscar CEP. Verifique sua conexão.";
    cepResultado.style.color = "#F87171";
  }
}

// ===================== EXPÕE FUNÇÕES PRO HTML =====================
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.buscarCEP = buscarCEP;

// ===================== INICIALIZAÇÃO =====================
document.addEventListener("DOMContentLoaded", () => {
  atualizarBadge();
  renderizarCarrinho();
});