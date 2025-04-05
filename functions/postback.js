const crypto = require('crypto');

exports.handler = async (event) => {
    const { userId, amount, signature } = event.queryStringParameters || {};
    const secret = '461e007d2c'; // Tu Secret
    const clientIp = event.headers['client-ip'] || event.requestContext?.identity?.sourceIp;

    // Verifica la IP (solo 3.22.177.178)
    if (clientIp !== '3.22.177.178') {
        return { statusCode: 403, body: 'ERROR: Invalid IP' };
    }

    // Verifica la firma
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${userId}${amount}`)
        .digest('hex');

    if (signature !== expectedSignature) {
        return { statusCode: 400, body: 'ERROR: Invalid signature' };
    }

    // Almacena los puntos temporalmente
    global.pointsData = global.pointsData || {};
    global.pointsData[userId] = { amount: parseInt(amount), timestamp: Date.now() };

    return { statusCode: 200, body: 'OK' }; // Respuesta esperada por Wannads
};
