import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { usePermissions } from '@/context/PermissionsContext'
import Notifications from '@/components/NewSan/Notifications'

const Index = () => {
    const permissions = usePermissions()

    const canViewNotificaciones = permissions.includes(
        'NewSan.ver_notificaciones',
    )
    const canDescargarNotificaciones = permissions.includes(
        'NewSan.descargar_notificaciones',
    )

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    New San | Notificaciones
                </h2>
            }>
            <Head>
                <title>Iflow - New San</title>
            </Head>

            <Notifications
                canViewNotificaciones={canViewNotificaciones}
                canDescargarNotificaciones={canDescargarNotificaciones}
            />
        </AppLayout>
    )
}

export default Index
