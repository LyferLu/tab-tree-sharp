/* global chrome */

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.clear()
})

chrome.tabs.onCreated.addListener(tab =>  {
  chrome.storage.local.get(['openerTabIdMap'], result => {
    console.log("new tab ", tab)
    let openerTabIdMap = result.openerTabIdMap || {}
    if(tab.pendingUrl !== "chrome://newtab/" && tab.openerTabId) {
      openerTabIdMap[tab.id] = tab.openerTabId
    }
    console.log("openerTabIdMap: ", openerTabIdMap)
    chrome.storage.local.set({ openerTabIdMap });
  })
})

chrome.tabs.onRemoved.addListener((removedTabId, removeInfo) => {
  chrome.storage.local.get(['openerTabIdMap'], otimResult => {
    console.log("remove tab ", removedTabId)
    let openerTabIdMap = otimResult.openerTabIdMap || {}
    let openerTabId = openerTabIdMap[removedTabId]
    Object.keys(openerTabIdMap).forEach(key => {
      if(openerTabIdMap[key] === removedTabId) {
        openerTabIdMap[key] = openerTabId
      }
    })
    delete openerTabIdMap[removedTabId]
    console.log("New openerTabIdMap: ", openerTabIdMap)
    chrome.storage.local.remove("openedTabIdMap")
    chrome.storage.local.set({ openerTabIdMap });
  })
})

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.storage.local.set({ focusTabId: activeInfo.tabId })
})