# NS Store — New Santos Store

> **Novidades, Segurança e Bom Preço**

Plataforma de comércio eletrônico completa voltada ao segmento de Tecnologia da Informação, desenvolvida como projeto final da disciplina de Sistemas para Internet.

---

## 📋 Sobre o Projeto

A NS Store é um Web Commerce que contempla:
- **Venda de produtos** — hardware e software
- **Prestação de serviços** — formatação, manutenção, redes, cabeamento, segurança e mais
- **Locação de equipamentos** — notebooks, projetores, servidores e roteadores

---

## 🚀 Funcionalidades

- ✅ Página inicial com banner, categorias e produtos em oferta
- ✅ Catálogo completo com filtro por categoria (Hardware / Software)
- ✅ Página de serviços com preços e botão de contratação
- ✅ Página de locação com preços por diária e mensal e badge de disponibilidade
- ✅ Carrinho de compras com adição/remoção de itens e cálculo automático
- ✅ Cálculo de frete por CEP via API ViaCEP
- ✅ Sistema de login e cadastro com Firebase Authentication
- ✅ Recuperação de senha por e-mail (Firebase)
- ✅ Painel do cliente com dados reais do Firebase
- ✅ Proteção de rota — painel exige login
- ✅ Layout responsivo para mobile e desktop

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização customizada |
| JavaScript (ES6+) | Lógica e interatividade |
| Bootstrap 5 | Layout responsivo e componentes |
| Bootstrap Icons | Ícones da interface |
| Google Fonts | Tipografia (Space Grotesk + Inter) |
| Firebase Authentication | Login, cadastro e recuperação de senha |
| ViaCEP API | Busca de endereço por CEP para cálculo de frete |
| localStorage | Persistência do carrinho entre páginas |
| Git + GitHub | Versionamento e hospedagem do código |

---

## 📁 Estrutura do Projeto

    ns-store/

├── index.html          → Página Inicial

├── catalogo.html       → Catálogo de Produtos

├── servicos.html       → Serviços

├── locacao.html        → Locação de Equipamentos

├── carrinho.html       → Carrinho de Compras

├── login.html          → Login / Cadastro / Recuperação de Senha

├── painel.html         → Painel do Cliente

├── css/

│   └── style.css       → Estilos customizados

├── js/

│   ├── firebase-config.js  → Configuração do Firebase

│   ├── auth.js             → Autenticação (login, cadastro, logout)

│   ├── catalogo.js         → Carregamento dinâmico de produtos e serviços

│   ├── carrinho.js         → Lógica do carrinho + ViaCEP

│   └── painel.js           → Painel do cliente

├── data/

│   ├── produtos.json   → Lista de produtos

│   ├── servicos.json   → Lista de serviços

│   └── locacao.json    → Lista de equipamentos para locação

└── img/                → Imagens dos produtos

---

## ⚙️ Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/NewSantos-art/ns-store.git
```

2. Abra a pasta no **VS Code**

3. Instale a extensão **Live Server** (Ritwick Dey)

4. Clique com botão direito em `index.html` → **Open with Live Server**

5. O site abrirá automaticamente em `http://127.0.0.1:5500`

> ⚠️ É necessário abrir via Live Server (não direto pelo arquivo), pois o projeto usa `fetch` para carregar os arquivos JSON e módulos ES6 do Firebase.

---

## 🔐 Sistema de Autenticação

O sistema usa **Firebase Authentication** com e-mail e senha:

- **Cadastro**: cria conta real no Firebase
- **Login**: autentica e redireciona para o painel
- **Recuperação de senha**: envia e-mail real de redefinição via Firebase
- **Proteção de rota**: o painel redireciona para o login se o usuário não estiver autenticado

---

## 🗺️ API ViaCEP

No carrinho de compras, o usuário pode calcular o frete digitando seu CEP. A API pública [ViaCEP](https://viacep.com.br) retorna o endereço completo e o sistema calcula um frete fictício baseado no estado de destino.

---

## 🎨 Identidade Visual

- **Cores**: Roxo `#6D28D9` + Ciano `#06B6D4` sobre fundo escuro `#0F0E17`
- **Tipografia**: Space Grotesk (títulos) + Inter (corpo)
- **Estilo**: Moderno e vibrante — cards com bordas que "acendem" em ciano no hover

---

## 👨‍💻 Autor

**Nilton Pereira dos Santos Cunha**
Curso: Sistemas para Internet
Projeto Final — 2026

---

## 📄 Licença

Projeto acadêmico — desenvolvido para fins educacionais.