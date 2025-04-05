exports.handler = async (event) => {
    const { userId } = event.queryStringParameters || {};
    console.log('Postback-check invoked with userId:', userId);

    global.pointsData = global.pointsData || {};
    console.log('Current pointsData:', global.pointsData);

    if (!userId || !global.pointsData[userId]) {
        console.log('No points found for userId:', userId);
        return { statusCode: 200, body: JSON.stringify({ amount: 0 }) };
    }

    const data = global.pointsData[userId];
    delete global.pointsData[userId];
    console.log('Points delivered for userId:', userId, 'Amount:', data.amount);
    return { statusCode: 200, body: JSON.stringify({ amount: data.amount }) };
};
