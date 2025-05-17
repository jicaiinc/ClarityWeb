import "../style.css"
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useTheme } from "next-themes"
import logoIcon from "data-base64:~images/logo.png"
import pinIconDark from "data-base64:~images/pin-arrow-dark.svg"
import pinIconLight from "data-base64:~images/pin-arrow-light.svg"
import pluginIconDark from "data-base64:~images/plugin-dark.svg"
import pluginIconLight from "data-base64:~images/plugin-light.svg"
import { ThemeProvider } from "@/components/theme-provider"
import { initI18n } from '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import { ThemedLoader } from "@/components/themed-loader"

const SetupContent = () => {
  const { t } = useTranslation()
  const { theme, systemTheme } = useTheme()
  
  const currentTheme = theme === 'system' ? systemTheme : theme
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Pin message */}
      <div className="absolute top-[1%] right-[15%] flex flex-col items-center">
        <Image
            src={currentTheme === 'dark' ? pinIconDark : pinIconLight}
            alt={t('setup.pinArrow')}
            width={24}
            height={24}
            className="mb-2"
        />
        <div className="text-sm text-center">
          {t('setup.clickMessage')}
          <Image
            src={currentTheme === 'dark' ? pluginIconDark : pluginIconLight}
            alt="plugin icon"
            width={20}
            height={20}
            className="inline-block mx-1"
          />
          {t('setup.toPinIt')}
        </div>
      </div>

      <Card className="w-[400px] p-8">
        <div className="flex flex-col items-center text-center">
          <Image
              src={logoIcon}
              alt={t('setup.logoAlt')}
              width={96}
              height={96}
              className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">
            {t('setup.welcome')}
          </h1>
          {/* <p className="text-lg text-gray-600">
            {t('setup.brandSlogan')}
          </p> */}
        </div>
      </Card>
    </div>
  )
}

const SetupPage = () => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)

  useEffect(() => {
    /**
     * here to init configurations while first installation
     */
    const loadI18n = async () => {
      await initI18n()
      setIsI18nInitialized(true)
    }

    Promise.all([loadI18n()])

  }, [])


  if (!isI18nInitialized) {
    return <ThemedLoader />
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SetupContent />
    </ThemeProvider>
  )
}

export default SetupPage
