import { useState } from "react";
import OptionsDrawer from "../Options/OptionsDrawer"

function OptionsBtn() {
    const [open, setOpen] = useState(false);
  return (
    <div className="btn-wrapper">
        <button
        aria-label="Open options"
         onClick={() => setOpen(true)}>
            <i className="fa-solid fa-gear"></i>
        </button>

        <OptionsDrawer open={open} onClose={() => setOpen(false)} />

    </div>
  )
}

export default OptionsBtn

