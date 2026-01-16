import { THEMES } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";

export default function ThemePanel() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="theme-panel" aria-labelledby="theme-settings">
            <h2 id="theme-settings" className="options-sub">Theme</h2>
            <ul className="themes">
                {THEMES.map((t) => (
                    <li key={t.id}>
                        <button
                            className="theme"
                            type="button"
                            aria-pressed={theme === t.id}
                            onClick={() => setTheme(t.id)}
                        >
                            <span>{t.name}</span>
                            <p>{t.hint}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
