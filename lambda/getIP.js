const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB();

exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                console.log("Getting all IP addresses")
                let getIPS = `SELECT * FROM "iplog"`
                const ips = await dynamo.executeStatement({Statement: getIPS}).promise();
                body = ips
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        console.log(err.message)
        body = {
            error: 'error getting IP addresses',
        };
    } finally {
        console.log('Finaly', body, statusCode)
        body = JSON.stringify(body);
    }
    return {
        statusCode,
        body,
        headers,
    };
};
