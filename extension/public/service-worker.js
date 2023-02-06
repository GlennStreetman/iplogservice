
// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

async function postIP(url, data) {
    console.log('posting IP update')
    const formatData = JSON.stringify(data)
    console.log(formatData)
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formatData // body data type must match "Content-Type" header
    })
    const format = await response.json()
    console.log(format)
}

function updateIP(myIP,userId, hook, params){
    if(myIP && userId){
        console.log('Posting IP to remote', fetchURL)

        if (myIP && hook){
            const todayDate = new Date().toISOString().slice(0, 10)
            const data = {
                ip: myIP,
                userid: userId,
                date: todayDate,
            }
            if (params) data['meta'] = params
            postIP(hook, data)
        }
    }
}

console.log("Starting up IP.SPY")
chrome.storage.sync.get().then((result) => {
    console.log("Local Sync Storage:", result)
});

chrome.runtime.onStartup.addListener(async function() { 
    const storageIP = await chrome.storage.sync.get(["myIP"])
    const storageUserID = await chrome.storage.sync.get(["userId"])
    const storageHook = chrome.storage.sync.get(["hook"])
    const storageParams = chrome.storage.sync.get(["params"]).then((result) => {
        const stringParams = result['params']
        const convertParams = stringParams ? JSON.parse(stringParams) : false
        return convertParams
    });

    const myIP = storageIP['myIP']
    const userId = storageUserID['userId']
    const hook = storageHook['hook']
    const params = storageParams['params']

    updateIP(myIP,userId, hook, params)

    function loop() {
        var d = new Date(),
            h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0, 0, 0),
            e = h - d;
        if (e > 100) { // some arbitrary time period
            updateIP(myIP,userId, hook, params)
            window.setTimeout(loop, e);
        }
    }
    loop()

});

// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

// https://github.com/SimGus/chrome-extension-v3-starter
