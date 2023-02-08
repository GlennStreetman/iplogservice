
async function postIP(url, data) {
    try{
        console.log('posting IP update')
        const formatData = JSON.stringify(data)
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
        if (format?.msg) console.log(format.msg)
        chrome.storage.sync.set({"myIP": data.ip})
    } catch(err){
        console.log('Service Worker Error Logging IP: ', err)
    }
}

function updateIP(publicIP,userId, hook, params){
    console.log('service worker updating IP info')
    if(publicIP && userId){
        console.log('Posting IP to remote', hook)
        chrome.storage.sync.set({"myIP": publicIP})

        if (publicIP && hook){
            const todayDate = new Date().toISOString().slice(0, 10)
            const data = {
                ip: publicIP,
                userid: userId,
                date: todayDate,
            }
            if (params) data['meta'] = params
            postIP(hook, data)
        }
    }
}

const checkUpdate = async function() { 
    console.log('Checking for IP Update')
    const storageIP = await chrome.storage.sync.get(["myIP"])
    const storageUserID = await chrome.storage.sync.get(["userId"])
    const storageHook = await chrome.storage.sync.get(["hook"])
    const storageParams = await chrome.storage.sync.get(["params"])

    const stringParams = storageParams?.['params'] || false
    const convertParams = stringParams ? JSON.parse(stringParams) : false
    const myIP = storageIP['myIP']
    const userId = storageUserID['userId']
    const hook = storageHook['hook']
    const params = convertParams?.['params'] || {}

    const publicIPRaw = await fetch("https://api.ipify.org?format=json")
    const publicIP = await publicIPRaw.json()

    if (publicIP.ip !== myIP)updateIP(publicIP.ip,userId, hook, params);
};

let count = 0
// create the offscreen document if it doesn't already exist
async function createOffscreen() {
    if (await chrome.offscreen.hasDocument?.()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['BLOBS'],
        justification: 'keep service worker running',
    });
}

chrome.runtime.onStartup.addListener(() => {
console.log('setup offscreen service worker')
checkUpdate()
createOffscreen();
});
// a message from an offscreen document every 20 second resets the inactivity timer

chrome.runtime.onMessage.addListener(msg => {
if (msg.keepAlive) {
    console.log('keepAlive');
    count += 1
    if (count >=  90){
        count = 0
        checkUpdate()
    }
}
});
