type CookieRowProps = {
    id:string;
    label:string;
    description?:string;
    checked: boolean;
    disabled?: boolean;
    onChange: (value:boolean) => void;
};

export default function CookieRow({
    id,
    label,
    description,
    checked, 
    disabled,
    onChange,
}:CookieRowProps) {
    return(
        <div className="cookie-row">
            <label htmlFor={id}>
            <span>{label}</span>
            {description && <p>{description}</p>}
            </label>


            <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            />
        </div>
    )
}