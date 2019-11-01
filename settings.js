function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
      refreshInterval: document.querySelector("#refresh_interval").value
    });
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#refresh_interval").value = result.refreshInterval || "5000";
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    var getting = browser.storage.sync.get("refreshInterval");
    getting.then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);