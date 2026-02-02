const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const caminho = path.join(__dirname, './../Dados/produtos.json');
const autenticar = require('../Middlewares/autenticacao')


router.get('/', (req, res) => {
    fs.readFile(caminho, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo', err)
            return
        }
        try {
            const conteudo = JSON.parse(data)
            res.status(200).send(conteudo)
        } catch (err) {
            console.error(`Ocorreu um erro ${err}`)
        }
    })
})
router.options('/', (req, res) => {
    res.header('Allow', 'GET,OPTIONS');
    res.status(204).send();
})

router.use(express.json())

//Rota para poder vizualizar e redirecionar para outras funções
// router.get('/adm',autenticar,(req,res)=>{

// })
//adicionar dados
router.post('/adm', autenticar, (req, res) => {
    const { nome, descricao, preco, img, categoria, medida } = req.body;

    let novoProduto;
    if (!descricao) {
        res.status(400).json({
            message: 'A descrição é obrigatória.'
        });
    }
    if (!nome) {
        res.status(400).json({
            message: 'O nome é obrigatório.'
        })
    }
    if (!preco) {
        res.status(400).json({
            message: 'O preço é obrigatorio.'
        })
    }
    if (!img) {
        res.status(400).json({
            message: 'A imagem é obrigatória.'
        })
    }
    if (!medida) {
        res.status(400).json({
            message: 'A descrição é obrigatória.'
        })
    }
    else if (!categoria) {
        res.status(400).json({
            message: 'A categoria é obrigatória.'
        })
    }
    fs.promises.readFile(caminho, 'utf8')
        .then(data => {
            const tarefas = JSON.parse(data);
            novoProduto = {
                id: tarefas.length + 1,
                nome: nome,
                descricao: descricao,
                preco: preco,
                img: img,
                categoria: categoria,
                medida: medida

            };
            tarefas.push(novoProduto);
            fs.promises.writeFile(caminho, JSON.stringify(tarefas, null, 2));
        })
        .then(() => {
            res.status(201).json(novoProduto);
        }).catch(error =>
            res.status(500).json({
                message: 'Erro ao salvar a nova tarefa.', error
            }));
})

//atualizar dados
router.put('/adm/:id', autenticar, (req, res) => {
    const atualizar = parseInt(req.params.id);
    fs.readFile(caminho, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo: ', err);
            return;
        }

        let products

        try {
            products = JSON.parse(data);
        } catch (error) {
            console.error('Erro na converção do arquivo json', error);
        }

        const paraAtualizar = products.find(function (products) {
            if (products.id === atualizar) {
                products.nome = req.body.nome;
                products.descricao = req.body.descricao;
                products.preco = req.body.preco;
                products.img = req.body.img;
                products.categoria = req.body.categoria;
                products.medida = req.body.medida;
                return true;
            } else {
                return false;
            }
        });

        if (!paraAtualizar) {
            console.error('Erro ao atualizar tarefa: ', err);
        } else {
            const atualizarFim = JSON.stringify(products, 0, 4);
            fs.writeFile(caminho, atualizarFim, err => {
                if (err) throw err;
                res.status(200).send(`Tarefa atualizada!!!`);
            });
        }
    });
})

//Remover dados
router.delete('/adm/:id', autenticar, (req, res) => {
    const rem = parseInt(req.params.id)
    fs.readFile(caminho, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo: ', err)
        }
        let products
        try {
            products = JSON.parse(data)
        } catch (err) {
            console.error('Erro ao traduzir o arquivo para string: ', err)
        }
        const del = products.find(function (products) {
            return products.id === rem;
        })
        if (!del) {
            console.error('Ero ao comparar os IDs.')
        } else {
            const index = products.indexOf(del);
            products.splice(index, 1);
            const fimDel = JSON.stringify(del, 0, 4)
            fs.writeFile(caminho, JSON.stringify(products), err => {
                if (err) throw err;
                router.delete('/remove/:id', autenticar, (req, res) => {
                    const rem = parseInt(req.params.id)
                    fs.readFile(caminho, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Erro ao ler o arquivo:', err)
                        }
                        let products
                        try {
                            products = JSON.parse(data)
                        } catch (error) {
                            console.error('Erro ao traduzir o arquivo para string:', err)
                        }
                        const del = products.find(function (products) {
                            return products.id === rem;
                        })
                        if (!del) {
                            console.error('Erro ao compar os IDs')
                        } else {
                            const index = products.indexOf(del)
                            products.splice(index, 1);
                            const fimDel = JSON.stringify(del, 0, 4)
                            fs.writeFile(caminho, err => {
                                if (err) throw err;
                            })
                        }
                    })
                    res.status(200).send('Produto foi removido')
                })
            })
        }
    })
})
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile(caminho, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler arquivo', err);
            return res.status(500).json({ message: 'Erro ao ler arquivo' });
        }

        try {
            const produtos = JSON.parse(data);
            const produto = produtos.find(p => p.id === id);

            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            res.status(200).json(produto);
        } catch (error) {
            console.error('Erro ao converter JSON', error);
            res.status(500).json({ message: 'Erro interno no servidor' });
        }
    });
});


module.exports = router;