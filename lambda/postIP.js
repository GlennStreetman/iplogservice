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

            case 'POST':
                console.log('POST', event.body)
                const parseBody = JSON.parse(event.body)
                const postIP = parseBody?.ip || false
                const postUser = parseBody?.userid || false
                const postDate = parseBody?.date || false
                let postMeta = parseBody?.meta || false

                let insMeta = ''
                if (postMeta) {
                    console.log("postMeta", postMeta)
                        for(const [key,val] of Object.entries(postMeta)){
                            insMeta = `${insMeta}, '${key}': '${val}'`
                    }
                }
                let insStatement = `INSERT INTO "iplog" value {'ipaddress': '${postIP}', 'username': '${postUser}', 'logdate': '${postDate}'${insMeta}}`
                
                let updMeta = ''
                if (postMeta) {
                    for(const [key,val] of Object.entries(postMeta)){
                        updMeta = `${updMeta}, ${key}='${val}'`
                    }
                }
                let updStatement = `UPDATE iplog SET logdate='${postDate}' ${updMeta} WHERE ipaddress='${postIP}' AND username='${postUser}'`

                if(postIP && postUser) try {
                    console.log('insert', insStatement)
                    await dynamo.executeStatement({Statement: insStatement}).promise();
                    body = {msg: "New IP added"}
                    break;
                } catch {
                    console.log('update', updStatement)
                    await dynamo.executeStatement({Statement: updStatement}).promise();
                    body = {msg: "IP Info Updated"}
                    break;
                }
                break;
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
        console.log('Finaly', body, statusCode)
        body = JSON.stringify(body);
    }
    return {
        statusCode,
        body,
        headers,
    };
};
