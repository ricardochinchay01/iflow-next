const ValidatedSelect = ({
    id,
    placeholder,
    value,
    onChange,
    error,
    options,
    disabled = false,
}) => {
    return (
        <div className="relative mb-4">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1">
                {placeholder}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className={`border p-2 w-full ${
                        error ? 'border-red-500' : ''
                    } rounded`}
                    id={id}
                    disabled={disabled}>
                    <option value="">Seleccione</option>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        </div>
    )
}

export default ValidatedSelect
