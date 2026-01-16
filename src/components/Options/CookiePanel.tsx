import { useCookiePrefs } from "@/hooks/useCookiePrefs"
import CookieRow from "./CookieRow";

export default function CookiePanel() {
    const {cookies, setCookie, reset} = useCookiePrefs();
  return (
    <div aria-labelledby="cookie-settings" className="cookie-settings">
        <h2 className="options-sub">Cookie Inställningar</h2>
        
        <CookieRow
        id="necessary"
        label="Necessary"
        description="Obs krav för att sidan ska fungera som förväntat"
        checked 
        disabled
        onChange={() => {}}/>

        <CookieRow
        id="analytics"
        label="Analytics"
        description="Användnings(s) data"
        checked = {cookies.analytics} 
        onChange={(v) => setCookie("analytics", v)} />

        <CookieRow
        id="marketing"
        label="Marknadsföring"
        description="För marknadsföring"
        checked  = {cookies.marketing}
        onChange={(v) => setCookie("marketing", v)}/>

        <CookieRow
        id="preferences"
        label="Preferenser"
        description="Sparar dina val."
        checked = {cookies.preferences}
        onChange={(v) => setCookie("preferences", v)} />

        <button type="button" onClick={reset}>Reset</button>
    </div>
  )
}
