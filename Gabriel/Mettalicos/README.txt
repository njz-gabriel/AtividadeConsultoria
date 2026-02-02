Nome do projeto: mettalicos;
Segmento de mercado B2B: Venda de produtos metalicos;
Publico-Alvo: Engenheiros, projetistas.


caminho da API: './Dados/produtos.json'
Método HTTP:
    GET --> Acessar os dados da API
    POST --> Adicionar novos dados a API
    PUT --> Atualizar dados da API
    DELETE --> Remover dados da API
Parâmetros: {id, nome, descrição, imagem, preco, categoria}
Resposta:
    200 --> se ocorrer tudo bem
    500 --> para erro generico
    418 --> caso seja café e não chá



O que a rota faz: ela cria um caminho de comunicação entre diferentes arquivos
O site contara com uma parte de ADM, onde será necessario uma autenticação para acessar;