import { create } from '../config/database.js';

// Middleware para registrar logs de acesso
export const logMiddleware = async (req, res, next) => {
    const startTime = Date.now();

    const logData = {
        rota: req.originalUrl,
        metodo: req.method,
        ip_address: req.ip || req.connection?.remoteAddress || null,
        user_agent: req.get('User-Agent'),
        dados_requisicao: JSON.stringify({
            headers: {
                'content-type': req.get('Content-Type'),
                'authorization': req.get('Authorization') ? 'Bearer [REDACTED]' : null,
                'user-agent': req.get('User-Agent')
            },
            body: req.method !== 'GET' ? sanitizeRequestBody(req.body) : null,
            query: Object.keys(req.query).length ? req.query : null
        })
    };

    const originalJson = res.json;
    const originalSend = res.send;

    res.json = function (data) {
        registrarResposta(data);
        return originalJson.call(this, data);
    };

    res.send = function (data) {
        registrarResposta(data);
        return originalSend.call(this, data);
    };

    function registrarResposta(data) {
        const finalLog = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };

        if (req.usuario && req.usuario.id) {
            finalLog.usuario_id = req.usuario.id;
        }

        if (res.statusCode >= 400) {
            finalLog.dados_resposta = JSON.stringify({
                error: true,
                status: res.statusCode,
                message:
                    typeof data === 'string'
                        ? data.substring(0, 500)
                        : JSON.stringify(data).substring(0, 500)
            });
        }

        saveLog(finalLog);
    }

    next();
};

// Remove informações sensíveis do body
function sanitizeRequestBody(body) {
    if (!body || typeof body !== 'object') return body;

    const clone = { ...body };
    const sensitive = ['senha', 'password', 'token', 'authorization'];

    sensitive.forEach(field => {
        if (clone[field]) clone[field] = '[REDACTED]';
    });

    return clone;
}

// Salva log no banco
async function saveLog(data) {
    try {
        await create('logs', data);
    } catch (err) {
        console.error('Erro ao salvar log:', err);
    }
}

export const simpleLogMiddleware = (req, res, next) => {
    const ts = new Date().toISOString();
    const user = req.usuario ? `[${req.usuario.email}]` : '[Anônimo]';

    console.log(`${ts} - ${req.method} ${req.originalUrl} ${user}`);
    next();
};
