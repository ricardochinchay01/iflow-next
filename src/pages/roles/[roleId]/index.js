import { ToastContainer } from 'react-toastify';
import AppLayout from '@/components/Layouts/AppLayout';
import ModulePermissionsCard from '@/components/General/ModulePermissionsCard';
import useRolesAndPermissions from '@/hooks/useRolesAndPermissions';
import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PermissionModal from '@/components/General/PermissionModal';
import useRoles from '@/hooks/General/useRoles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const EditRole = () => {
    const [showModalPermission, setShowModalPermission] = useState(false);
    const [moduleSelected, setModuleSelected] = useState(false);

    const router = useRouter();
    const { permissions, isLoading } = useAuth({ middleware: 'auth' });

    const {
        roles,
        loading: loadingRoles,
        error: errorRoles,
    } = useRoles();

    useEffect(() => {
        if (!isLoading && !permissions.includes('General.administrar_usuarios_y_permisos')) {
            router.push('/403');
        }
    }, [permissions, isLoading]);

    const { loading, error, role, handlePermissionChange } = useRolesAndPermissions();

    const closeModaPermission = () => {
        setShowModalPermission(false);
    };

    if (loading) return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>
    );
    if (error) return <p>Error: {error}</p>;

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Permisos agrupados por módulo
                </h2>
            }
        >
            <div class="flex flex-wrap -mx-4 mt-4">
                <div class="w-full px-4">
                    <div class="text-center mx-auto mb-[60px] lg:mb-8 max-w-[510px]">
                        <h2 class="font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4">
                            Rol : {role.name}
                        </h2>
                        <p class="text-base text-body-color">
                            Para dar o revocar permisos para el rol simplemente haga click sobre el nombre del permiso.
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap justify-center -mx-4 mb-1">
                {Object.entries(role.organizedPermissions).map(([moduleName, permissions]) => (
                    <ModulePermissionsCard
                        moduleName={moduleName}
                        permissions={permissions}
                        handlePermissionChange={handlePermissionChange}
                        setShowModalPermission={setShowModalPermission}
                        setModuleSelected={setModuleSelected}
                    />
                ))}
            </div>

            <div class="fixed bottom-4 left-4"> {/* Posicionamiento en la esquina inferior izquierda */}
                <button
                    onClick={() => router.back()}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-400"
                >
                    Volver atrás
                </button>
            </div>


            <PermissionModal
                isOpen={showModalPermission}
                onClose={closeModaPermission}
                onSubmit={() => { console.log('enviando...') }}
                initialData={{ module: moduleSelected, name: '' }}
                data={{ roles }}
            // serverErrors={serverErrorsUser}
            />

            <ToastContainer />
        </AppLayout>
    );
};

export default EditRole;
