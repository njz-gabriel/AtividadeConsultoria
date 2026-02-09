import { ApiError } from '../utils/ApiError.js';

// Middleware centralizado para tratamento de erros
export const errorMiddleware = (error, req, res, next) => {
    
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json(error.toJSON());
    }
    
 
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            sucesso: false,
            erro: 'Arquivo muito grande',
            mensagem: `Tamanho máximo permitido: ${error.limit / 1024 / 1024}MB`
        });
    }
    
   
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token inválido',
            mensagem: 'Token de autenticação inválido'
        });
    }
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token expirado',
            mensagem: 'Faça login novamente'
        });
    }
    
   
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            sucesso: false,
            erro: 'JSON inválido',
            mensagem: 'O JSON enviado está malformado'
        });
    }
    
    
    console.error('Erro não tratado:', {
        mensagem: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
        mensagem: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Ocorreu um erro inesperado no servidor'
    });
};

