const crypto = require('crypto');

exports.handler = async (event) => {
    // Extrae parámetros
    const params = event.queryStringParameters || {};
    const userId = params.userId || params.subId; // Soporta ambos nombres
    const amount = params.amount || params.reward; // Soporta ambos nombres
    const signature = params.signature;
    const clientIp = event.headers['client-ip'] || event.requestContext?.identity?.sourceIp;

    // Verifica parámetros requeridos
    if (!userId || !amount || !signature) {
        console.log('Missing parameters:', { userId, amount, signature });
        return { statusCode: 400, body: 'ERROR: Missing parameters' };
    }

    // Verifica la IP
    if (clientIp !== '3.22.177.178') {
        console.log('Invalid IP:', clientIp);
        return { statusCode: 403, body: 'ERROR: Invalid IP' };
    }

    // Verifica la firma
    const secret = '461e007d2c';
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${userId}${amount}`)
        .digest('hex');

    if (signature !== expectedSignature) {
        console.log('Invalid signature:', { received: signature, expected: expectedSignature });
        return { statusCode: 400, body: 'ERROR: Invalid signature' };
    }

    // Almacena los puntos
    global.pointsData = global.pointsData || {};
    global.pointsData[userId] = { amount: parseInt(amount), timestamp: Date.now() };
    console.log('Postback processed:', { userId, amount });

    // Respuesta exacta que Wannads espera
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: 'OK'
    };
};
