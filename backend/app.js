import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, create, read, update, deleteRecord, hashPassword, comparePassword } from './config/database.js';

import produtoRotas from './routes/produtoRotas.js';
import authRotas from './routes/authRotas.js';
import criptografiaRotas from './routes/criptografiaRotas.js';
import colaboradoresRotas from './routes/colaboradoresRotas.js';
import inscricaoRoutes from "./routes/inscricaoRoutes.js";
import historicoRoutes from "./routes/historicoRotas.js";





import usuarioRotas from './routes/usuarioRotas.js';

import treinamentoRotas from './routes/treinamentoRotas.js';

import { logMiddleware } from './middlewares/logMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;


import { contarTreinamentosAtivos } from './controllers/TreinamentoController.js';

app.get('/api/treinamentos/ativos/count-test', async (req, res) => {
  try {
    await contarTreinamentosAtivos(req, res);
  } catch (e) {
    console.error('erro rota test direta:', e);
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// Middlewares globais
app.use(helmet()); // Segurança HTTP headers

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logMiddleware);

// Rotas da API
app.use('/api/colaboradores', colaboradoresRotas);
app.use("/api/usuarios", usuarioRotas);
app.use('/api/auth', authRotas);
app.use('/api/produtos', produtoRotas);
app.use('/api/treinamentos', treinamentoRotas);
app.use("/api/inscricoes", inscricaoRoutes);
app.use("/historico", historicoRoutes);


app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API de Produtos - Sistema de Gestão',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            produtos: '/api/produtos',
            criptografia: '/api/criptografia'
        },
        documentacao: {
            login: 'POST /api/auth/login',
            registrar: 'POST /api/auth/registrar',
            perfil: 'GET /api/auth/perfil',
            listarProdutos: 'GET /api/produtos',
            buscarProduto: 'GET /api/produtos/:id',
            criarProduto: 'POST /api/produtos',
            atualizarProduto: 'PUT /api/produtos/:id',
            excluirProduto: 'DELETE /api/produtos/:id',
            infoCriptografia: 'GET /api/criptografia/info',
            cadastrarUsuario: 'POST /api/criptografia/cadastrar-usuario'
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});


app.use(errorMiddleware);


function listRoutes() {
  console.log('--- Rotas registradas (app._router.stack) ---');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // rota direta
      console.log(middleware.route.path, Object.keys(middleware.route.methods).join(','));
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log('(router) ' + handler.route.path, Object.keys(handler.route.methods).join(','));
        }
      });
    }
  });
  console.log('--- fim rotas ---');
}
listRoutes();

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`API de Produtos - Sistema de Gestão`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});


export default app;

