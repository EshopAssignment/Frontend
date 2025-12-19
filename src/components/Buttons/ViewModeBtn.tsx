type ViewMode = "grid" | "list";
type Props = {
    value: ViewMode;
    onChange: (next: ViewMode) => void;
};
export default function ViewModeBtn({ value, onChange }: Props) {
    return (
        <div className="viewmode-group">
                <button
                className={`btn viewmode-btn ${value === "grid" ? "active" : ""}`}
                type='button'
                aria-label="Kortvy"
                aria-pressed={value === "grid"}
                onClick={() => onChange("grid")}>
                        <i className="fa-solid fa-border-all"></i>
                </button>

                <button
                className={`btn viewmode-btn ${value === "list" ? "active" : ""}`}
                type='button'
                aria-label="Listvy"
                aria-pressed={value === "list"}
                onClick={() => onChange("list")}>
                        <i className="fa-solid fa-bars"></i>
                </button>
        </div>

    )
}
