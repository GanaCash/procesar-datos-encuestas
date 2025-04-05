const crypto = require('crypto');

exports.handler = async (event) => {
    // Extrae parámetros
    const params = event.queryStringParameters || {};
    const userId = params.userId || params.subId;
    const amount = params.amount || params.reward;
    const signature = params.signature;
    const clientIp = event.headers['client-ip'] || event.requestContext?.identity?.sourceIp || 'Unknown';

    // Log the incoming IP for debugging
    console.log('Incoming IP:', clientIp);

    // Temporarily disable IP validation to debug
    /*
    if (clientIp !== '3.22.177.178') {
        console.log('Invalid IP:', clientIp);
        return { statusCode: 403, body: 'ERROR: Invalid IP' };
    }
    */

    // Verifica parámetros requeridos
    if (!userId || !amount || !signature) {
        console.log('Missing parameters:', { userId, amount, signature });
        return { statusCode: 400, body: 'ERROR: Missing parameters' };
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
