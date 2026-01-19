import { THEMES } from "@/constants/themes";
import { useTheme } from "@/hooks/useTheme";

export default function ThemePanel() {
    const { theme, setTheme } = useTheme();
    const themeBtnClass = (id: string) => 
          `theme ${theme === id ? "is-active" : ""}`;
    return (
        <div className="theme-panel" aria-labelledby="theme-settings">
            <h2 id="theme-settings" className="options-sub">Theme</h2>
            <ul className="themes">
                {THEMES.map((t) => (
                    <li key={t.id}>
                        <button
                        type="button"
                        aria-selected={theme === t.id}
                        aria-pressed={theme === t.id}
                        className={themeBtnClass(t.id)}
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
