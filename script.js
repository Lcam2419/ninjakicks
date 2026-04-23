// ===============================
// 🛒 CARRINHO
// ===============================

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// ATUALIZA CONTADOR DO MENU
function atualizarContador() {
    let total = 0;

    carrinho.forEach(produto => {
        total += produto.quantidade;
    });

    let contador = document.getElementById("contador-carrinho");

    if (contador) {
        contador.innerText = total;
    }
}

// ADICIONAR PRODUTO
function adicionarAoCarrinho(nome, preco) {
    let produtoExistente = carrinho.find(p => p.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho();

    alert("Produto adicionado ao carrinho! 🛒");
}

// SALVAR CARRINHO
function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarContador();
}

// ===============================
// 🧾 RENDERIZAR CARRINHO
// ===============================

function renderizarCarrinho() {
    let lista = document.getElementById("lista-carrinho");
    let totalElemento = document.getElementById("total");

    if (!lista) return;

    lista.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio 😢</p>";
        if (totalElemento) totalElemento.innerText = "";
        return;
    }

    carrinho.forEach((produto, index) => {
        let item = document.createElement("div");
        item.classList.add("carrinho-item");

        item.innerHTML = `
            <p><strong>${produto.nome}</strong></p>
            <p>R$ ${produto.preco}</p>

            <div>
                <button onclick="diminuir(${index})">➖</button>
                ${produto.quantidade}
                <button onclick="aumentar(${index})">➕</button>
            </div>

            <button onclick="removerItem(${index})">❌</button>
        `;

        lista.appendChild(item);

        total += produto.preco * produto.quantidade;
    });

    if (totalElemento) {
        totalElemento.innerText = "Total: R$ " + total;
    }
}

// ===============================
// ➕ ➖ CONTROLE DE QUANTIDADE
// ===============================

function aumentar(index) {
    carrinho[index].quantidade++;
    salvarCarrinho();
    renderizarCarrinho();
}

function diminuir(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }

    salvarCarrinho();
    renderizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
}

// ===============================
// 🗑 LIMPAR CARRINHO
// ===============================

function limparCarrinho() {
    localStorage.removeItem("carrinho");
    carrinho = [];
    atualizarContador();
    renderizarCarrinho();
}

// ===============================
// 💳 PAGAMENTO
// ===============================

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let pagamento = document.getElementById("pagamento");
    if (pagamento) {
        pagamento.style.display = "block";
    }
}

// PIX
function pagarPix() {
    let area = document.getElementById("area-pagamento");

    area.innerHTML = `
        <h3>Pagamento via Pix</h3>
        <p>Escaneie o QR Code (simulação)</p>
        <div style="background:white; width:150px; height:150px; margin:auto;"></div>
        <br>
        <button onclick="confirmarPagamento()">Já paguei</button>
    `;
}

// CARTÃO
function pagarCartao() {
    let area = document.getElementById("area-pagamento");

    area.innerHTML = `
        <h3>Pagamento com Cartão</h3>

        <input type="text" placeholder="Número do cartão"><br><br>
        <input type="text" placeholder="Nome no cartão"><br><br>
        <input type="text" placeholder="Validade"><br><br>
        <input type="text" placeholder="CVV"><br><br>

        <button onclick="confirmarPagamento()">Pagar</button>
    `;
}

// CONFIRMAR PAGAMENTO + SALVAR PEDIDO
function confirmarPagamento() {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    let total = carrinho.reduce((acc, item) => {
        return acc + item.preco * item.quantidade;
    }, 0);

    let novoPedido = {
        id: Date.now(),
        itens: carrinho,
        total: total,
        data: new Date().toLocaleString(),
        status: "Pago"
    };

    pedidos.push(novoPedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    alert("Pagamento aprovado! 🥷🔥");

    limparCarrinho();

    window.location.href = "pedidos.html";
}

// ===============================
// 🚀 INICIALIZAÇÃO
// ===============================

window.onload = function () {
    atualizarContador();
    renderizarCarrinho();
};