import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { MessageType } from "./lib/messageTypes"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]  // 匹配所有URL
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// 监听文本选择
document.addEventListener('selectionchange', () => {
  const selectedText = window.getSelection()?.toString().trim()
  // 发送消息到扩展
  chrome.runtime.sendMessage({
    type: MessageType.TEXT_SELECTED,
    text: selectedText
  })
})
console.log("content loaded")

const PlasmoOverlay = () => {
  return null  // 不需要显示任何覆盖内容
}

export default PlasmoOverlay
