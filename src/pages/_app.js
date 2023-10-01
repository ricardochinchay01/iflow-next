import 'tailwindcss/tailwind.css'
import { PermissionsProvider } from '@/context/PermissionsContext'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const App = ({ Component, pageProps }) => {
    const [permissions, setPermissions] = useState([]);
    const { permissions: authPermissions } = useAuth();

    useEffect(() => {
        // console.log('authPermissions', authPermissions);

        // Verifica si authPermissions existe y es diferente de permissions antes de actualizar el estado.
        if (authPermissions && JSON.stringify(authPermissions) !== JSON.stringify(permissions)) {
            setPermissions(authPermissions);
        }
    }, [authPermissions]);

    return (
        <PermissionsProvider value={permissions}>
            <Component {...pageProps} />
        </PermissionsProvider>
    )
}

export default App
