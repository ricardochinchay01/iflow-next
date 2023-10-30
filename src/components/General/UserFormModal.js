import React, { useEffect, useState } from 'react'
import ValidatedInput from '../Common/ValidatedInput'
import ValidatedSelect from '../Common/ValidatedSelect'

const UserFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = {},
    data,
    serverErrors,
}) => {
    const { roles } = data
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        email: initialData.email || '',
        password: initialData.password || '',
        role: initialData.role || '',
    })

    const [formErrors, setFormErrors] = useState({})

    // const [isDefaultPassword, setIsDefaultPassword] = useState(false);

    const validateForm = () => {
        let errors = {}

        if (!formData.name) {
            errors.name = 'El nombre es obligatorio.'
        } else if (
            Object.keys(formData).length !== 0 &&
            formData.name !== formData.name
        ) {
            // Aquí podrías agregar otras validaciones específicas para el name cuando se cambia.
        }
        if (!formData.email) {
            errors.email = 'El email es obligatorio.'
        } else if (
            Object.keys(formData).length !== 0 &&
            formData.email !== formData.email
        ) {
            // Aquí podrías agregar otras validaciones específicas para el email cuando se cambia.
        }
        if (!formData.role) {
            errors.role = 'El rol es obligatorio.'
        } else if (
            Object.keys(formData).length !== 0 &&
            formData.role !== formData.role
        ) {
            // Aquí podrías agregar otras validaciones específicas para el rol cuando se cambia.
        }

        if (!formData.password) {
            errors.password = 'La contraseña es obligatoria.'
        } else if (formData.password.length < 8) {
            errors.password = 'La contraseña debe tener al menos 8 caracteres.'
        }

        setFormErrors(errors)

        return Object.keys(errors).length === 0
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (validateForm()) {
            // if (isDefaultPassword) {
            // Aquí podrías configurar el comportamiento cuando el checkbox esté seleccionado.
            // }
            onSubmit(formData)
        }
    }

    const userRole =
        initialData.roles && initialData.roles[0] ? initialData.roles[0].id : ''

    // const handleCheckboxChange = () => {
    //     setIsDefaultPassword(prevState => !prevState);
    // };

    useEffect(() => {
        setFormData({
            name: initialData.name || '',
            email: initialData.email || '',
            password: initialData.password || '',
            role: userRole,
        })
        setFormErrors({})
    }, [isOpen, initialData])

    useEffect(() => {
        const closeOnEscape = e => {
            if (isOpen && e.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', closeOnEscape)

        return () => {
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [isOpen, onClose])

    useEffect(() => {
        // Si hay errores del servidor, se setean aqui en los inputs
        if (serverErrors) {
            setFormErrors(prevErrors => ({ ...prevErrors, ...serverErrors }))
        }
    }, [serverErrors])

    if (!isOpen) {
        return null
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div
                className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
                onClick={onClose}></div>
            <div className="bg-white w-3/4 max-w-xl rounded p-4 z-10">
                <button onClick={onClose} className="float-right">
                    &times;
                </button>
                <h2 className="text-xl mb-4">
                    {Object.keys(initialData).length === 0
                        ? 'Nuevo Usuario'
                        : 'Editar Usuario'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <ValidatedInput
                        id="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={e =>
                            setFormData(prevState => ({
                                ...prevState,
                                name: e.target.value,
                            }))
                        }
                        error={formErrors.name}
                        name="name"
                    />

                    <ValidatedInput
                        id="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={e =>
                            setFormData(prevState => ({
                                ...prevState,
                                email: e.target.value,
                            }))
                        }
                        error={formErrors.email}
                        name="email"
                    />

                    <ValidatedInput
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={formData.password}
                        onChange={e =>
                            setFormData(prevState => ({
                                ...prevState,
                                password: e.target.value,
                            }))
                        }
                        error={formErrors.password}
                        name="password"
                    />

                    {/* <div className="flex items-center my-4">
                        <input
                            type="checkbox"
                            id="defaultPassword"
                            checked={isDefaultPassword}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        <label htmlFor="defaultPassword">
                            {Object.keys(initialData).length === 0 ? "Password por defecto" : "Mantener password actual"}
                        </label>
                    </div> */}

                    <ValidatedSelect
                        id="role"
                        placeholder="Rol"
                        value={formData.role}
                        onChange={e =>
                            setFormData(prevState => ({
                                ...prevState,
                                role: e.target.value,
                            }))
                        }
                        error={formErrors.role}
                        options={roles}
                        name="role"
                    />

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-400 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-900 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800">
                            {Object.keys(initialData).length === 0
                                ? 'Guardar Usuario'
                                : 'Actualizar Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserFormModal
