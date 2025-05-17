import "./style.css"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeProvider } from "@/components/theme-provider"
import './lib/i18n'
import { initI18n } from './lib/i18n'
import { useTranslation } from 'react-i18next'
import { SideNav } from './option/SideNav'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import {OptionRouter} from "~lib/routes"
import { ThemedLoader } from "./components/themed-loader"

function OptionsContent() {
    const { t } = useTranslation()
    document.title = 'ClarityWeb - ' + t('settings.title');
    return (
        <HashRouter>
            <div className="flex h-screen bg-background">
                <SideNav />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto">
                    <ScrollArea className="h-full">
                        <div className="container p-6 max-w-4xl">
                            <OptionRouter />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </HashRouter>
    )
}

export default function Options() {
    const [isI18nInitialized, setIsI18nInitialized] = useState(false)

    useEffect(() => {
        initI18n()
            // .then(() => {
            //     // 添加3秒延时用于测试加载状态
            //     return new Promise(resolve => setTimeout(resolve, 3000))
            // })
            .then(() => {
                console.log('i18n initialized')
                setIsI18nInitialized(true)
            })
    }, [])

    if (!isI18nInitialized) {
        return <ThemedLoader />
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <OptionsContent />
        </ThemeProvider>
    )
}