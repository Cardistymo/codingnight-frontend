export default function CustomInput({ label, disabled, ...props }) {
    let color = "text-white";
    if (label.error) {
        color = "text-error";
    }

    return (
        <div className={"w-full"}>
            <p className={"text-left w-full mb-1 " + color}>{label.label}</p>
            <input
                className={
                    "bg-secondary border border-neutral p-2 rounded-xl placeholder:text-secondary-content w-full " +
                    "focus:outline-none focus:ring-primary focus:ring-2 text-white " +
                    (label.error ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-1" : "") +
                    (disabled ? " opacity-50" : "")
                }
                disabled={disabled}
                {...props}
            />
        </div>
    );
}