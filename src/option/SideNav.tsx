import { Settings, MessageSquare, Users, Database, MessagesSquare, Bot, Cpu, Bug } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from "~components/ui/button"
import logoIcon from "data-base64:~images/logo.png"
import { NavLink, useLocation } from 'react-router-dom'

const modules = [
    { id: 'general', name: 'General', icon: Settings, path: '/general' },
]

export function SideNav() {
    const { t } = useTranslation()
    const location = useLocation()

    return (
        <nav className="w-64 bg-card border-r border-border">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <img 
                        src={logoIcon}
                        alt="ClarityWeb Logo"
                        className="w-6 h-6 object-contain"
                    />
                    <span className="text-xl font-semibold">ClarityWeb</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-muted-foreground">{t('settings.title')}</span>
                </div>
                <ul>
                    {modules.map((module) => (
                        <li key={module.id}>
                            <NavLink 
                                to={module.path}
                                style={{ textDecoration: 'none' }}
                            >
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? 'secondary' : 'ghost'}
                                        className="w-full justify-start mb-1"
                                    >
                                        <module.icon className="mr-2 h-4 w-4" />
                                        {t(`settings.modules.${module.id}`)}
                                    </Button>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
