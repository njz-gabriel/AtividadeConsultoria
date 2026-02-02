const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();
const port = 3001;
const routes = require('./Rotas/routes');
const logger = require('./Middlewares/logger');
const path = require('path');
const caminho = path.join(__dirname, './../Dados/produtos.json');

// habilite CORS para o front do Next
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

app.use(logger);
app.use(express.json());
app.use('/', routes);


app.use(logger);
app.use(express.json());
app.use('/', routes)
app.get('/', (req, res) => {
    res.status(200).send('Bizarro')
})

app.options('/', (req, res) => {
    res.header('Allow', 'GET, OPTIONS');
})

app.get('/:id', (req, res) => {
    const idmetal = parseInt(req.params.id)
    fs.readFile(caminho, 'utf8')
        .then(data => {
            const metaleiro = JSON.parse(data)
            const encontradometaleiro = metaleiro.find(function(metalzinho){
                return metalzinho.id == idmetal
            })
            if(!encontradometaleiro){
                console.log(`${idmetal} não encontrado`)
                res.status(400).send(`${idmetal} não encontrado`)
            }
            else {
                console.log(JSON.stringify(encontradometaleiro, null, 2))
                res.status(201).send(JSON.stringify(encontradometaleiro,null,2))
            }
        })
})
app.options('/:id',(req,res)=>{
    res.header('Allow','GET,OPTIONS')
})


const PROTO_USER = 'test@gmail.com';
const PROTO_PASS = 'newjeans';
const PROTO_TOKEN = 'newjeans';


app.post('/api/adm/login', express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'username e password obrigatórios' });

  if (username === PROTO_USER && password === PROTO_PASS) {
    return res.json({ token: PROTO_TOKEN, username: PROTO_USER });
  }

  return res.status(401).json({ message: 'Usuário ou senha inválidos' });
});





app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})