import { MessageType } from "./lib/messageTypes";
import { storage, STORAGE_KEYS } from "~lib/storage";


chrome.runtime.onStartup.addListener(() => {
});

chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installation reason:', details.reason);
    
    // 只在首次安装时打开设置页面
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'tabs/setup.html' });
    }
});

// 点击扩展图标时打开选项页面
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

// Main message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === MessageType.USER_SETTINGS.UPDATE_LANGUAGE) {
        console.log('User received language update:', message.language);
        storage.set(STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LANGUAGE, message.language)
    }
    if (message.type === MessageType.USER_SETTINGS.UPDATE_THEME) {
        console.log('User received theme update:', message.theme);
        storage.set(STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.THEME, message.theme)
    }
});

export {}; 