const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB();

exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Headers" : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Credentials": true,
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                console.log("Getting all IP addresses")
                let getIPS = `SELECT * FROM "iplog"`
                const ips = await dynamo.executeStatement({Statement: getIPS}).promise();
                body = ips
                break;
            case 'OPTIONS':
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
        console.log('return body', body, typeof body, 'header', headers)
    }
    return {
        statusCode,
        body,
        headers,
    };
};
