const crypto = require('crypto');

exports.handler = async (event) => {
    console.log('Postback function invoked:', event);

    const params = event.queryStringParameters || {};
    const userId = params.userId || params.subId;
    const amount = params.amount || params.reward;
    const signature = params.signature;
    const clientIp = event.headers['x-forwarded-for']?.split(',')[0] || event.requestContext?.identity?.sourceIp || 'Unknown';

    console.log('Incoming IP:', clientIp);
    console.log('Received parameters:', { userId, amount, signature });

    // Re-activa la validación de IP (ajusta según la IP que veas en los logs)
    /*
    const allowedIps = ['3.22.177.178', 'nueva.ip.aqui'];
    if (!allowedIps.includes(clientIp)) {
        console.log('Invalid IP:', clientIp);
        return { statusCode: 403, body: 'ERROR: Invalid IP' };
    }
    */

    if (!userId || !amount || !signature) {
        console.log('Missing parameters:', { userId, amount, signature });
        return { statusCode: 400, body: 'ERROR: Missing parameters' };
    }

    const secret = '461e007d2c';
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${userId}${amount}`)
        .digest('hex');

    if (signature !== expectedSignature) {
        console.log('Invalid signature:', { received: signature, expected: expectedSignature });
        return { statusCode: 400, body: 'ERROR: Invalid signature' };
    }

    global.pointsData = global.pointsData || {};
    global.pointsData[userId] = { amount: parseInt(amount), timestamp: Date.now() };
    console.log('Postback processed:', { userId, amount });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: 'OK'
    };
};
