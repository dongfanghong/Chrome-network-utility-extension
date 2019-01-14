function httpGetAsync(theUrl, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

httpGetAsync("https://ifconfig.me/ip", function(responseText) {
    chrome.runtime.sendMessage({ type: "locate", ip: responseText }, function(response) {
        let elem = document.getElementById("ownIP");
        elem.innerText = "ownIP: " + responseText + ", " + response;
    })
});

function displaySpeed(speed) {
    if (speed < 1024) {
        return speed.toFixed(1) + " B/s";
    }
    if (speed < 1024 * 1024) {
        return (speed / 1024).toFixed(1) + " KB/s";
    }
    return (speed / 1024 / 1024).toFixed(1) + " MB/s";
}

function displayMemory(mem) {
    if (mem < 1024) {
        return mem.toFixed(1) + " B";
    }
    if (mem < 1024 * 1024) {
        return (mem / 1024).toFixed(1) + " KB";
    }
    return (mem / 1024 / 1024).toFixed(1) + " MB";
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let currTab = tabs[0];
    if (currTab) {
        let id = currTab.id;
        chrome.runtime.sendMessage({ type: "video", tabId: id }, function(response) {
            let elem = document.getElementById("video");
            if (response != null) {
                let s = "videos:\n";
                for (let i in response) {
                    s += "<div><a target=\"_blank\" href=\"" + response[i] + "\">- " + response[i] + "</a></div><div></div>";
                }
                elem.innerHTML = s;
            } else {
                elem.innerText = "videos: not found";
            }
        });

        chrome.runtime.sendMessage({ type: "hostIP", url: currTab.url }, function(response) {
            let elem = document.getElementById("hostIP");
            if (response != null) {
                elem.innerText = "hostIP: " + response;
            } else {
                elem.innerText = "hostIP:";
            }
        });

        function work() {
            chrome.processes.getProcessIdForTab(currTab.id, function(id) {
                chrome.runtime.sendMessage({ type: "process", id: id }, function(response) {
                    let elem = document.getElementById("cpuTotal");
                    elem.innerText = "total cpu usage:\n" + response.cpuTotal.toFixed(1) + "%";
                    elem = document.getElementById("cpuTab");
                    elem.innerText = "tab cpu usage:\n" + response.cpuTab.toFixed(1) + "%";
                    elem = document.getElementById("netTotal");
                    elem.innerText = "total network usage:\n" + displaySpeed(response.netTotal);
                    elem = document.getElementById("netTab");
                    elem.innerText = "tab network usage:\n" + displaySpeed(response.netTab)
                    elem = document.getElementById("memTotal");
                    elem.innerText = "total memory usage:\n" + displayMemory(response.memTotal);
                    elem = document.getElementById("memTab");
                    elem.innerText = "tab memory usage:\n" + displayMemory(response.memTab);

                });
            });
        }
        work();
        setInterval(work, 3000);
    }
});