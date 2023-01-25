# Use this browser extension to retrieve your public IP by querying [api.ipify.org](https://api.ipify.org?format=json)

## Log your Public IP using configurable webhook

- After opening browser extension window, add webhook URL to Webhook dialog box & userID/email
- Expand the functionality of your logging by adding on additional query parameters

## Quickly copy your IP address by clicking PUBLIC IP button

## See lambda > postIP.js example

- postIP.js is an example of an AWS Lambda function that could be used to log your, and your teams, public IP addressess to DynamoDB
- Target DynamoDB table would require: Partition Key: username, Sort Key: ipaddress
