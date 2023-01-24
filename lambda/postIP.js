const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB();

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const logIP = event?.["queryStringParameters"]?.['ip'] || false
        const user = event?.["queryStringParameters"]?.['userid'] || false
        const date = event?.["queryStringParameters"]?.['date'] || 'pass'
        const insertStatement = `INSERT INTO "iplog" value {'ipaddress': '${logIP}', 'username': '${user}', 'logdate': '${date}'}`
        const updateStatement = `UPDATE iplog SET logdate='${date}' WHERE ipaddress='${logIP}' AND username='${user}'`
        console.log('queryStatement', insertStatement, updateStatement)
        switch (event.httpMethod) {
            case 'GET':
                if(logIP && user) try {
                    console.log('insert', insertStatement)
                    await dynamo.executeStatement({Statement: insertStatement}).promise();
                    break;
                } catch {
                    console.log('update', insertStatement)
                    await dynamo.executeStatement({Statement: updateStatement}).promise();
                    break;
                }
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        console.log(err.message)
        body = {
            error: 'error processing request',
            params: 'ip, userid, date',
            ip: 'string',
            userid: 'string',
            date: 'string: YYYY-MM-DD'
        };
    } finally {
        body = JSON.stringify(body);
    }
    return {
        statusCode,
        body,
        headers,
    };
};
