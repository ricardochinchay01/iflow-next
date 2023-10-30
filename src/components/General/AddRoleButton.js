import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import AddRoleModal from '@/components/General/AddRoleModal'

const AddRoleButton = ({ isAdmin, addRoleWithPermissions }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="bg-gray-100 p-4 rounded">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    Listado de Roles y Permisos
                </h1>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar
                    Rol
                </button>
                {showModal && (
                    <AddRoleModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        isAdmin={isAdmin}
                        addRoleWithPermissions={addRoleWithPermissions}
                    />
                )}
            </div>
        </div>
    )
}

export default AddRoleButton
