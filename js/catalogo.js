// =====================================================
// NS STORE — Carregamento dinâmico de produtos
// Lê data/produtos.json, gera os cards na tela
// e controla os filtros de categoria do Catálogo
// =====================================================

// Guarda a lista de produtos depois de carregada do JSON,
// assim os filtros não precisam buscar o arquivo de novo a cada clique
let listaDeProdutos = [];

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

// Gera o HTML de um único card de serviço
function criarCardServico(servico) {
  return `
    <div class="col-md-6 col-lg-4">
      <div class="ns-service-card">
        <div class="ns-service-icon">
          <i class="bi ${servico.icone}"></i>
        </div>
        <p class="ns-service-name">${servico.nome}</p>
        <p class="ns-service-desc">${servico.descricao}</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="ns-service-price">A partir de ${formatarPreco(servico.precoApartir)}</span>
        </div>
        <button class="btn ns-btn-primary w-100 mt-3" onclick="contratarServico(${servico.id})">
          Contratar
        </button>
      </div>
    </div>
  `;
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

// Desenha uma lista de produtos dentro de um container específico
function renderizarProdutos(containerId, produtos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (produtos.length === 0) {
    container.innerHTML = `<p class="text-secondary">Nenhum produto encontrado nessa categoria.</p>`;
    return;
  }

  container.innerHTML = produtos.map(criarCardProduto).join("");
}

// Busca os produtos no JSON, guarda na variável global e renderiza
function carregarProdutos(containerId, filtro = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch("data/produtos.json")
    .then(resposta => resposta.json())
    .then(produtos => {
      listaDeProdutos = produtos; // guarda tudo na variável global
      const listaFiltrada = filtro ? produtos.filter(filtro) : produtos;
      renderizarProdutos(containerId, listaFiltrada);
    })
    .catch(erro => {
      console.error("Erro ao carregar produtos:", erro);
      container.innerHTML = `<p class="text-danger">Não foi possível carregar os produtos.</p>`;
    });
}

// Aplica o filtro de categoria escolhido nos botões do Catálogo
function aplicarFiltroCategoria(categoria) {
  const produtosFiltrados = categoria === "todos"
    ? listaDeProdutos
    : listaDeProdutos.filter(produto => produto.categoria === categoria);

  renderizarProdutos("catalogo-container", produtosFiltrados);
}

// Configura os cliques dos botões de filtro (só existe na página catalogo.html)
function configurarFiltros() {
  const botoes = document.querySelectorAll(".ns-filtro-btn");
  if (botoes.length === 0) return; // se não tiver filtros na página, não faz nada

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      // Remove "active" de todos os botões e adiciona só no clicado
      botoes.forEach(b => b.classList.remove("active"));
      botao.classList.add("active");

      const categoria = botao.dataset.categoria; // lê o atributo data-categoria
      aplicarFiltroCategoria(categoria);
    });
  });
}

// Função placeholder do carrinho (vamos implementar de verdade no carrinho.js)
function adicionarAoCarrinho(idProduto) {
  alert("Produto " + idProduto + " adicionado ao carrinho! (em breve, isso vai funcionar de verdade)");
}

// Gera o HTML de um único card de locação
function criarCardLocacao(equipamento) {
  const badge = equipamento.disponivel
    ? `<span class="ns-badge-disponivel">Disponível</span>`
    : `<span class="ns-badge-indisponivel">Indisponível</span>`;

  const botao = equipamento.disponivel
    ? `<button class="btn ns-btn-primary w-100 mt-3" onclick="solicitarLocacao(${equipamento.id})">
         <i class="bi bi-calendar-check"></i> Solicitar Locação
       </button>`
    : `<button class="btn w-100 mt-3" disabled style="opacity:0.4; background:var(--ns-surface-light); color:var(--ns-text-muted); border:none; border-radius:10px; padding:0.7rem;">
         Indisponível
       </button>`;

  return `
    <div class="col-md-6 col-lg-4">
      <div class="ns-service-card">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div class="ns-service-icon">
            <i class="bi ${equipamento.icone}"></i>
          </div>
          ${badge}
        </div>
        <p class="ns-service-name">${equipamento.nome}</p>
        <p class="ns-service-desc">${equipamento.descricao}</p>
        <div class="ns-locacao-precos mt-3">
          <div class="ns-locacao-preco-item">
            <span class="ns-locacao-label">Diária</span>
            <span class="ns-service-price">${formatarPreco(equipamento.precoDiaria)}</span>
          </div>
          <div class="ns-locacao-preco-item">
            <span class="ns-locacao-label">Mensal</span>
            <span class="ns-service-price">${formatarPreco(equipamento.precoMensal)}</span>
          </div>
        </div>
        ${botao}
      </div>
    </div>
  `;
}
// Função placeholder de contratação de serviço
function contratarServico(idServico) {
  alert("Serviço " + idServico + " selecionado! (em breve, isso vai abrir um formulário de solicitação)");
}

// Função placeholder de solicitação de locação
function solicitarLocacao(idEquipamento) {
  alert("Equipamento " + idEquipamento + " selecionado! (em breve, isso vai abrir o formulário de locação)");
}

// Busca os equipamentos no JSON e renderiza no container de locação
function carregarLocacao(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch("data/locacao.json")
    .then(resposta => resposta.json())
    .then(equipamentos => {
      container.innerHTML = equipamentos.map(criarCardLocacao).join("");
    })
    .catch(erro => {
      console.error("Erro ao carregar locação:", erro);
      container.innerHTML = `<p class="text-danger">Não foi possível carregar os equipamentos.</p>`;
    });
}

// Busca os serviços no JSON e renderiza no container de serviços
function carregarServicos(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch("data/servicos.json")
    .then(resposta => resposta.json())
    .then(servicos => {
      container.innerHTML = servicos.map(criarCardServico).join("");
    })
    .catch(erro => {
      console.error("Erro ao carregar serviços:", erro);
      container.innerHTML = `<p class="text-danger">Não foi possível carregar os serviços.</p>`;
    });
}

// ===================== EXECUÇÃO AUTOMÁTICA =====================

document.addEventListener("DOMContentLoaded", () => {
  // Home: mostra só os produtos marcados como "oferta"
  carregarProdutos("ofertas-container", produto => produto.oferta === true);

  // Catálogo completo: mostra todos os produtos
  carregarProdutos("catalogo-container");

  // Ativa os botões de filtro (se existirem na página)
  configurarFiltros();

  // Página de Serviços: mostra todos os serviços
  carregarServicos("servicos-container");

  // Página de Locação: mostra todos os equipamentos
  carregarLocacao("locacao-container");
});