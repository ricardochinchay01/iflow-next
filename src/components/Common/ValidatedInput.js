import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

const ValidatedInput = ({
    id,
    placeholder,
    value,
    onChange,
    error,
    type = 'text',
}) => {
    return (
        <div className="relative mb-4">
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1">
                {placeholder}
            </label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    id={id}
                    onChange={onChange}
                    className={`border p-2 w-full ${
                        error ? 'border-red-500' : ''
                    } rounded`}
                />
                {error && (
                    <>
                        <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className="absolute top-3 right-3 text-red-500"
                        />
                        <p className="text-xs text-red-500 mt-1">{error}</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default ValidatedInput
