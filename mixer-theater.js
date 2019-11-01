let theaterButton;
const theaterButtonHtml = `<span style="position: absolute; top: 8px; right: 8px; display: block; background-color: #00000080; padding: 4px;">
                        <button aria-label="Theater Mode" type="button" tabindex="0" style="cursor: pointer;">
                            <div>
                                <i class="material-icons" style="display: inline; vertical-align: middle;">aspect_ratio</i>
                                <span>Theater Mode</span>
                            </div>
                        </button>
                    </span>`;

const defaultRefreshIntervalTime = 5000;
let refreshIntervalTime = defaultRefreshIntervalTime;

let gettingRefreshInterval = browser.storage.sync.get("refreshInterval");
gettingRefreshInterval.then(onGotRefreshInterval, onError);

let initializationInterval;
let refreshInterval;

let toggled = false;

onStart();

function onGotRefreshInterval(result){
    if(result.refreshInterval){
        refreshIntervalTime = result.refreshInterval;
    }
}

function onError(error){
    console.log(`[MixerTheater]: ${error}`);
}

function onStart(){
    console.log("[MixerTheater]: Starting");
    initializationInterval = setInterval(initializeExtension, refreshInterval);
}

function initializeExtension(){
    if(!checkIfIsWatching()){
        return;
    }

    createTheaterButton();
    clearInterval(initializationInterval);

    console.log("[MixerTheater]: Loaded")
}

function createTheaterButton(){
    let existingButton = document.querySelector("#theater_btn_holder");
    
    if(existingButton){
        existingButton.parentNode.removeChild(existingButton);
    }

    theaterButton = document.createElement("div");
    theaterButton.id = "theater_btn_holder";
    theaterButton.innerHTML = theaterButtonHtml;

    let parent = document.querySelectorAll(".spectre-player");
    if(parent[0] != null){
        parent[0].appendChild(theaterButton);
        
        let newStyle = document.createElement('style');
        newStyle.innerHTML = `
            #theater_btn_holder { z-index: 999; opacity: 0; transition: opacity 167ms ease-in-out; transition-delay: 3s; }
            .spectre-player:hover #theater_btn_holder { opacity: 1; pointer-events: all; transition: opacity 167ms ease-out; }
        `;
        document.head.appendChild(newStyle);
    } else {
        document.body.appendChild(theaterButton);
    }

    theaterButton.querySelector("button").onclick = toggleExtension;
}

function toggleExtension(){
    toggled = !toggled;

    if(toggled){
        enableExtension();
    } else {
        disableExtension();
    }
}

function enableExtension(){    
    refreshTheaterMode();

    refreshInterval = window.setInterval(refreshTheaterMode, refreshInterval);
}

function disableExtension(){
    clearInterval(refreshInterval);
    
    window.location.reload();
}

function checkIfIsWatching(){
    let homepage = document.getElementsByTagName("b-homepage")[0];

    if(homepage != null){
        return false;
    }

    let player = document.getElementsByClassName("spectre-player")[0];
    
    if(player == null){
        return false;
    }

    let stage = document.getElementsByClassName("stage online")[0];

    if(stage != null){
        return true;
    }
    else
    {
        let bPlayer = document.getElementsByTagName("b-player")[0];
    
        if(bPlayer != null){
            let state = bPlayer.getAttribute("data-state");
            
            return state != null && state === "OnlinePublic";
        }
    }

    return false;
}

function refreshTheaterMode(){
    if(!checkIfIsWatching()){
        return;
    }

    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    let navhost = document.getElementsByTagName("b-nav-host")[0];

    if(navhost != null){
        navhost.style.display = "none";
    }

    let mobileHeader = document.getElementsByTagName("b-mobile-header")[0];

    if(mobileHeader != null){
        mobileHeader.style.display = "none";
    }

    let content = document.getElementsByClassName("content")[0];

    if(content != null){
        content.style.height = "100%";
        content.style.marginTop = "0";
    }

    let channelWrapper = document.getElementsByTagName("b-channel-page-wrapper")[0];

    if(channelWrapper != null){
        channelWrapper.style.height = "100%";
        channelWrapper.style.display = "block";
    }

    let channelPage = document.getElementsByClassName("channel-page")[0];

    if(channelPage != null){
        channelPage.style.marginRight = "0";
        channelPage.style.maxHeight = "none";
        channelPage.style.height = "100%";
    }

    let stage = document.getElementsByClassName("stage online")[0];

    if(stage != null){
        stage.style.height = "100vh";
        stage.style.width = "100%";
        stage.style.maxHeight = "none";
    }

    let detailsBar = document.getElementsByTagName("b-mobile-details-bar")[0];

    if(detailsBar != null){
        detailsBar.style.display = "none";
    }

    let details = document.getElementsByClassName("details")[0];

    if(details != null){
        details.style.display = "none";
    }

    let player = document.getElementsByClassName("player")[0];

    if(player != null){
        player.style.height = "100%";
    }

    let bPlayer = document.getElementsByTagName("b-player")[0];

    if(bPlayer != null){
        bPlayer.style.height = "100%";
    }

    let stageArrangement = document.getElementsByTagName("b-stage-arrangement")[0];

    if(stageArrangement != null){
        stageArrangement.style.height = "100%";
    }

    let interactiveControls = document.getElementsByClassName("interactive-controls")[0];

    if(interactiveControls != null){
        interactiveControls.style.display = "none";
    }
}