
// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log("This prints to the console of the service worker (background script)")
chrome.storage.sync.get().then((result) => {
    console.log(result)
});

chrome.runtime.onStartup.addListener(async function() { 
    console.log("I started up!");
    const storageIP = await chrome.storage.sync.get(["myIP"])
    const storageUserID = await chrome.storage.sync.get(["userId"])
    const myIP = storageIP['myIP']
    const userId = storageUserID['userId']
    const todayDate = new Date().toISOString().slice(0, 10)
    const fetchURL = `${hook}?ip=${myIP}&userid=${userId}&date=${todayDate}`

    if(myIP && userId){
        console.log('UPdating IP', fetchURL)
        fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
            //if public ip does not match local storage
            if(data?.ip && storageIP.myIP !== data.ip) {
                chrome.storage.sync.set({"myIP": myIP})
                fetch(fetchURL, {method: 'GET', mode: 'no-cors'})
            }
        })        
        .catch((error)=>{
            console.log('fetch Error', fetchURL, error)
        })
    }
});
// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js')

// If you want to import a file that is deeper in the file hierarchy of your
// extension, simply do `importScripts('path/to/file.js')`.
// The path should be relative to the file `manifest.json`.

// https://github.com/SimGus/chrome-extension-v3-starter