import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';

// Middleware de autenticação JWT
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                erro: 'Token de acesso não fornecido',
                mensagem: 'É necessário fornecer um token de autenticação'
            });
        }

        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                erro: 'Token de acesso inválido',
                mensagem: 'Formato do token incorreto'
            });
        }

        // Verificar e decodificar token
        const decoded = jwt.verify(token, JWT_CONFIG.secret);

       
        req.usuario = {
            id: decoded.id,
            email: decoded.email,
            nivel_acesso: decoded.nivel_acesso   // 🔥 CORRIGIDO
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                erro: 'Token expirado',
                mensagem: 'Faça login novamente'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                erro: 'Token inválido',
                mensagem: 'Token de autenticação inválido'
            });
        }

        console.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({ 
            erro: 'Erro interno do servidor',
            mensagem: 'Erro ao processar autenticação'
        });
    }
};

// Middleware para verificar se o usuário é administrador
const adminMiddleware = (req, res, next) => {

    if (req.usuario.nivel_acesso !== 'Admin') {
        return res.status(403).json({ 
            erro: 'Acesso negado',
            mensagem: 'Apenas administradores podem acessar este recurso'
        });
    }

    next();
};

export { authMiddleware, adminMiddleware };
