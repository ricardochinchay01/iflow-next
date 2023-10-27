import { useEffect, useState } from "react";
import ValidatedSelect from "../Common/ValidatedSelect";
import ValidatedInput from "../Common/ValidatedInput";
import { extractModules } from "@/helpers/extractModules";

const PermissionModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = {},
    data,
    // serverErrors,
}) => {
    const { roles } = data;

    const modules = extractModules(roles);

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        module: initialData.module || '',
    });

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        let errors = {};

        if (!formData.module) {
            errors.module = "El modulo al que se le quiere asignar el permiso es obligatorio.";
        } else if (formData.name.includes(' ') || formData.name.match(/[.\/-]/)) {
            errors.name = "El nombre no debe contener espacios vacíos, puntos, guiones medios o barras";
        } else if (Object.keys(formData).length !== 0 && formData.module !== formData.module) {
            // Aquí podrías agregar otras validaciones específicas para el module cuando se cambia.
        }
        if (!formData.name) {
            errors.name = "El nombre del permiso es obligatorio.";
        } else if (Object.keys(formData).length !== 0 && formData.name !== formData.name) {
            // Aquí podrías agregar otras validaciones específicas para el name cuando se cambia.
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    useEffect(() => {
        setFormData({
            name: initialData.name || '',
            module: initialData.module || '',
        });
        setFormErrors({});
        console.log(initialData)
    }, [isOpen, initialData]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white w-3/4 max-w-xl rounded p-4 z-10">
                <button onClick={onClose} className="float-right">&times;</button>
                <h2 className="text-xl mb-4">{Object.keys(initialData).length === 0 ? "Nuevo permiso" : "Editar permiso"}</h2>
                <form onSubmit={handleSubmit}>
                    <ValidatedSelect
                        id="module"
                        placeholder="Módulo"
                        value={formData.module}
                        onChange={(e) => setFormData((prevState) => ({ ...prevState, module: e.target.value }))}
                        error={formErrors.module}
                        options={modules}
                        name="module"
                        disabled={!!initialData.module}
                    />
                    <ValidatedInput
                        id="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData((prevState) => ({ ...prevState, name: e.target.value }))}
                        error={formErrors.name}
                        name="name"
                    />


                    <div className="flex justify-between items-center">
                        <button type="button" onClick={onClose} className="bg-red-400 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-900 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800">
                            {Object.keys(initialData).length === 0 ? "Guardar Permiso" : "Actualizar Permiso"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PermissionModal;
