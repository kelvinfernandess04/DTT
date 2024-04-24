// Função para renderizar a lista de produtos na página
function renderProductList(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpa a lista antes de renderizar novamente

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <p>Preço: ${product.Preco}</p>
            <p>Descrição: ${product.Descricao}</p>
            <button onclick="updateProduct(${product.ID})">Atualizar</button>
            <button onclick="deleteProduct(${product.ID})">Excluir</button>
        `;
        productList.appendChild(productItem);
    });
}

// Função para buscar produtos com base no termo de pesquisa
function searchProducts(searchTerm, searchOption) {
    let url = '/produtos';
    if (searchTerm) {
        if (searchOption === 'description') {
            url = `/produtos/descricao/${searchTerm}`;
        } else {
            url += `?search=${searchTerm}&option=${searchOption}`;
        }
    }
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao buscar produtos');
            }
        })
        .then(products => {
            renderProductList(products);
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}


// Função para deletar um produto por ID
function deleteProduct(id) {
    fetch(`/produto/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Produto deletado com sucesso!');
                searchProducts(''); // Recarrega a lista de produtos após a exclusão
            } else {
                throw new Error('Erro ao deletar produto');
            }
        })
        .catch(error => console.error('Erro ao deletar produto:', error));
}

// Função para atualizar um produto por ID
function updateProduct(id) {
    const preco = prompt('Novo preço:');
    const descricao = prompt('Nova descrição:');

    if (preco === null || descricao === null) {
        return; // Se o usuário cancelar a entrada, não faz nada
    }

    // Constrói o objeto com os dados do produto atualizados
    const updatedProduct = {
        preco: preco,
        descricao: descricao
    };

    fetch(`/produto/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })
        .then(response => {
            if (response.ok) {
                alert('Produto atualizado com sucesso!');
                searchProducts(''); // Recarrega a lista de produtos após a atualização
            } else {
                throw new Error('Erro ao atualizar produto');
            }
        })
        .catch(error => console.error('Erro ao atualizar produto:', error));
}

// Função para exibir mensagem de erro em um alerta
function showError(message) {
    alert(`Erro: ${message}`);
}

// Função para adicionar um produto
document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    })
        .then(response => {
            if (response.ok) {
                alert('Produto adicionado com sucesso!');
                searchProducts(''); // Recarrega a lista de produtos após a adição
            } else {
                return response.json(); // Retorna o corpo da resposta como JSON
            }
        })
        .then(data => {
            if (data && data.errors) {
                const errorMessage = data.errors.map(error => error.msg).join(', ');
                showError(errorMessage); // Exibe os erros em um alerta
            }
        })
        .catch(error => console.error('Erro ao adicionar produto:', error));
});



document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value;
    const searchOption = document.getElementById('searchOption').value;
    searchProducts(searchTerm, searchOption);
});

