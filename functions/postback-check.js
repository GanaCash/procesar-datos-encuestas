exports.handler = async (event) => {
    const { userId } = event.queryStringParameters || {};
    global.pointsData = global.pointsData || {};

    if (!userId || !global.pointsData[userId]) {
        return { statusCode: 200, body: JSON.stringify({ amount: 0 }) };
    }

    const data = global.pointsData[userId];
    delete global.pointsData[userId];
    return { statusCode: 200, body: JSON.stringify({ amount: data.amount }) };
};
