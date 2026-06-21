// =====================================================
// NS STORE — Carregamento dinâmico de produtos
// Lê data/produtos.json e gera os cards na tela
// =====================================================

// Formata um número para o padrão de moeda brasileiro (R$ 1.234,56)
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Gera o HTML das estrelinhas de avaliação (ex: 4.8 -> ★★★★★ 4.8)
function gerarEstrelas(nota) {
  const notaArredondada = Math.round(nota);
  let estrelas = "";
  for (let i = 1; i <= 5; i++) {
    estrelas += i <= notaArredondada ? "★" : "☆";
  }
  return `<span class="ns-product-rating">${estrelas} <span class="text-secondary">(${nota})</span></span>`;
}

// Gera o HTML de um único card de produto
function criarCardProduto(produto) {
  return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="ns-product-card">
        <div class="ns-product-img ns-product-img-placeholder">
          <i class="bi bi-image"></i>
        </div>
        <div class="ns-product-body">
          <p class="ns-product-name">${produto.nome}</p>
          <p class="ns-product-desc">${produto.descricao}</p>
          ${gerarEstrelas(produto.avaliacao)}
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="ns-product-price">${formatarPreco(produto.preco)}</span>
            <button class="btn btn-sm ns-btn-primary" onclick="adicionarAoCarrinho(${produto.id})">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Busca os produtos no JSON e renderiza dentro de um container específico
// containerId: o id da div onde os cards vão entrar
// filtro: função opcional para filtrar produtos (ex: somente ofertas)
function carregarProdutos(containerId, filtro = null) {
  const container = document.getElementById(containerId);
  if (!container) return; // se a página não tiver esse container, não faz nada

  fetch("data/produtos.json")
    .then(resposta => resposta.json())
    .then(produtos => {
      const listaFiltrada = filtro ? produtos.filter(filtro) : produtos;

      if (listaFiltrada.length === 0) {
        container.innerHTML = `<p class="text-secondary">Nenhum produto encontrado.</p>`;
        return;
      }

      container.innerHTML = listaFiltrada.map(criarCardProduto).join("");
    })
    .catch(erro => {
      console.error("Erro ao carregar produtos:", erro);
      container.innerHTML = `<p class="text-danger">Não foi possível carregar os produtos.</p>`;
    });
}

// Função placeholder do carrinho (vamos implementar de verdade no carrinho.js)
function adicionarAoCarrinho(idProduto) {
  alert("Produto " + idProduto + " adicionado ao carrinho! (em breve, isso vai funcionar de verdade)");
}

// ===================== EXECUÇÃO AUTOMÁTICA =====================
// Quando a página carregar, decide o que mostrar dependendo de qual container existe

document.addEventListener("DOMContentLoaded", () => {
  // Home: mostra só os produtos marcados como "oferta"
  carregarProdutos("ofertas-container", produto => produto.oferta === true);

  // Catálogo completo: mostra todos os produtos (vamos usar isso no catalogo.html)
  carregarProdutos("catalogo-container");
});