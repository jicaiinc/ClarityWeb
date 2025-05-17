import { useTheme } from "next-themes"
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Computer, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomSelect, type SelectOption } from '@/components/custom-select'
import { storage, STORAGE_KEYS } from '../lib/storage'
import { useEffect, useState } from "react"
import { MessageType } from "~lib/messageTypes"

export function GeneralPage() {
    const { theme, setTheme } = useTheme()
    const { t, i18n } = useTranslation()
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

    //order by language name
    const LANGUAGE_OPTIONS: SelectOption[] = [
        { value: 'en', label: t('settings.language.english') },
        { value: 'zh_CN', label: t('settings.language.chinese') }
    ]
    LANGUAGE_OPTIONS.sort((a, b) => a.label.localeCompare(b.label))

    useEffect(() => {
        const initLanguage = async () => {
            const savedLang = await storage.get(STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.LANGUAGE)
            if (savedLang) {
                setCurrentLanguage(savedLang)
            }
        }
        const initTheme = async () => {
            const savedTheme = await storage.get(STORAGE_KEYS.USER_SETTINGS.GENERAL_SETTINGS.THEME)
            setTheme(savedTheme|| 'system')
        }
        Promise.all([initLanguage(), initTheme()])
    }, [])

    const handleLanguageChange = async (value: string) => {
        setCurrentLanguage(value)
        chrome.runtime.sendMessage({ type: MessageType.USER_SETTINGS.UPDATE_LANGUAGE, language: value })
        if (i18n.changeLanguage) {
            i18n.changeLanguage(value)
        }
    }

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        console.log(`Switching to ${theme} theme`);
        setTheme(theme);
        chrome.runtime.sendMessage({ type: MessageType.USER_SETTINGS.UPDATE_THEME, theme: theme });
    };

    return (
        <>
            {/* Theme Switcher */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{t('settings.appearance.title')}</CardTitle>
                    <CardDescription>{t('settings.appearance.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-secondary rounded-full p-1 flex w-fit">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleThemeChange('light')}
                            className={`rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${
                                theme === "light" ? "bg-primary text-primary-foreground" : ""
                            }`}
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem]" />
                            <span className="sr-only">{t('settings.theme.light')}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleThemeChange('dark')}
                            className={`rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${
                                theme === "dark" ? "bg-primary text-primary-foreground" : ""
                            }`}
                        >
                            <Moon className="h-[1.2rem] w-[1.2rem]" />
                            <span className="sr-only">{t('settings.theme.dark')}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleThemeChange('system')}
                            className={`rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${
                                theme === "system" ? "bg-primary text-primary-foreground" : ""
                            }`}
                        >
                            <Computer className="h-[1.2rem] w-[1.2rem]" />
                            <span className="sr-only">{t('settings.theme.system')}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Language Selector */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{t('settings.language.title')}</CardTitle>
                    <CardDescription>{t('settings.language.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomSelect
                        options={LANGUAGE_OPTIONS}
                        value={currentLanguage}
                        onValueChange={handleLanguageChange}
                        placeholder={t('settings.language.select')}
                        position="popper"
                        side="bottom"
                        sideOffset={5}
                    />
                </CardContent>
            </Card>

        </>
    )
}
export default GeneralPage;