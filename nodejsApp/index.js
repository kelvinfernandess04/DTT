const express = require('express');
const sql = require('mssql');
const { escape } = require('html-escaper'); // Biblioteca para escapar caracteres especiais
const { body, validationResult } = require('express-validator'); // Biblioteca para validação de entrada
const app = express();
const port = 3000;
https://github.com/kelvinfernandess04/DTT/edit/main/nodejsApp/index.js
// Configurar conexão com o banco de dados
const password = process.env.MSSQL_PASSWORD;
if (!password) {
    throw new Error('Variável de ambiente MSSQL_PASSWORD não definida.');
}

const config = {
    user: 'sa',
    server: 'kubernetes.docker.internal',
    password: password,
    port: 5433, // Propriedade separada para a porta
    database: 'DTT',
    options: {
        encrypt: false, // Desativar criptografia (apenas para SQL Server local)
    },
};

// Middleware para lidar com o corpo da requisição JSON
app.use(express.json());
// Middleware para servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Middleware para validação de entrada nos endpoints
const validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rota para criar um produto
app.post('/produto', [
    body('preco').custom((value) => {
        if (!/^\d+(\.\d+)?$/.test(value.replace(',', '.'))) {
            throw new Error('O preço deve ser um número válido.');
        }
        return true;
    }),
    body('descricao').isLength({ min: 1 }).notEmpty(),
    validateInput
], async (req, res) => {
    const { preco, descricao } = req.body;
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('preco', sql.Decimal(10, 2), preco.replace(',', '.')); // Substituir vírgula por ponto
        request.input('descricao', sql.NVarChar(255), descricao);
        const result = await request.query('INSERT INTO Produtos (Preco, Descricao) VALUES (@preco, @descricao)');
        res.send('Produto criado com sucesso!');
        console.log(result);
    } catch (err) {
        console.error('Erro ao criar produto:', err);
        res.status(500).send('Erro ao criar produto. Por favor, tente novamente mais tarde.');
    }
});

// Rota para listar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Produtos');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao obter produtos:', err);
        res.status(500).send('Erro ao obter produtos. Por favor, tente novamente mais tarde.');
    }
});

// Rota para buscar produtos por descrição
app.get('/produtos/descricao/:descricao', async (req, res) => {
    const descricao = escape(req.params.descricao); // Escapando os dados de entrada
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('descricao', sql.NVarChar(255), descricao);
        const result = await request.query('SELECT * FROM Produtos WHERE Descricao = @descricao');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao buscar produtos por descrição:', err);
        res.status(500).send('Erro ao buscar produtos por descrição. Por favor, tente novamente mais tarde.');
    }
});

// Rota para atualizar um produto por ID
app.put('/produto/:id', [
    body('preco').isDecimal().notEmpty(),
    body('descricao').isLength({ min: 1 }).notEmpty(),
    validateInput
], async (req, res) => {
    const id = req.params.id;
    const { preco, descricao } = req.body;
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        request.input('preco', sql.Decimal(10, 2), preco);
        request.input('descricao', sql.NVarChar(255), descricao);
        const result = await request.query('UPDATE Produtos SET Preco = @preco, Descricao = @descricao WHERE ID = @id');
        res.send('Produto atualizado com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).send('Erro ao atualizar produto. Por favor, tente novamente mais tarde.');
    }
});

// Rota para deletar um produto por ID
app.delete('/produto/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('id', sql.Int, id);
        const result = await request.query('DELETE FROM Produtos WHERE ID = @id');
        res.send('Produto deletado com sucesso!');

    } catch (err) {
        console.error('Erro ao deletar produto:', err);
        res.status(500).send('Erro ao deletar produto. Por favor, tente novamente mais tarde.');
    }
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
