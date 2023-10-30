import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserAlt } from '@fortawesome/free-solid-svg-icons'

const CustomInput = ({
    value,
    onChange,
    label,
    icon = faUserAlt,
    type = 'text',
}) => {
    return (
        <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={icon} className="text-blue-900" />
            <label>
                {label}:
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="ml-2 border rounded p-1"
                />
            </label>
        </div>
    )
}

export default CustomInput
