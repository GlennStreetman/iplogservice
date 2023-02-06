# Use this browser extension to retrieve your public IP by querying [api.ipify.org](https://api.ipify.org?format=json)

## Log your Public IP using configurable webhook

- After opening browser extension window, add webhook URL to Webhook dialog box & userID/email
- Expand the functionality of your logging by adding on additional query parameters
- IP Data automaticaly updates once per hour, or click the update button.

## Copy your IP address by clicking PUBLIC IP button

## See lambda > postIP.js example

- postIP.js is an example of an [AWS Lambda](https://aws.amazon.com/lambda/) function that could be used to log your, and your teams, public IP addressess to [DynamoDB](https://aws.amazon.com/dynamodb/)
- Target DynamoDB table would require: Partition Key: username, Sort Key: ipaddress

### Debugging

- navigate to [chrome://extensions/](chrome://extensions/) in your chrome broswer
- To view console logs, right click on popup window and select inspect. Make sure developer mode is on.

### Development

> npm run dev

- navigate to [chrome://extensions/](chrome://extensions/) and click "load unpacked"
- navigate to root directory of this project and import
- hot module reloading should now be enabled

> npm run build

- build production version of app.
