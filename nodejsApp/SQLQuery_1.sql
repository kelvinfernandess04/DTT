-- Arquivo contendo os comandos para a criação do banco de dados.
-- Caso queira testar a aplicação, use estes comandos, coloque a
-- string de conexão no app.js, declare a variável de ambiente 
-- com a senha do banco e a chame no seu projeto

-- CREATE DATABASE DTT
USE DTT
-- CREATE TABLE Produtos (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     Preco DECIMAL(10, 2) NOT NULL,
--     Descricao NVARCHAR(255) NOT NULL
-- );

-- INSERT INTO Produtos (Preco, Descricao)
-- VALUES (19.99, 'Produto Exemplo 1'),
--        (29.99, 'Produto Exemplo 2'),
--        (39.99, 'Produto Exemplo 3');


SELECT * FROM Produtos

