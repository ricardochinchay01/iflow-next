import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CustomSelect = ({
    value,
    onChange,
    label,
    icon,
    options,
    optionKey = 'id',
    optionValue = 'name',
    width = '200',
}) => {
    return (
        <div className="flex items-center space-x-2">
            {icon && <FontAwesomeIcon icon={icon} className="text-blue-900" />}
            <label>
                {label}:
                <select
                    value={value}
                    onChange={onChange}
                    className="ml-2 border rounded p-1"
                    style={{ width: width + 'px' }}>
                    <option value="">Seleccione</option>
                    {options.map(option => (
                        <option
                            key={option[optionKey]}
                            value={option[optionKey]}>
                            {option[optionValue]}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    )
}

export default CustomSelect
