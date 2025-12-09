import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"

        
        
const HelpBtn = () => {
    return (
        <Popover>
          <PopoverButton>                
            <i className="fa-solid fa-phone"></i>
          </PopoverButton>
          <PopoverPanel anchor="bottom" className="help-menu">
            <span>Behöver du hjälp?</span>
            <a href="/#">070123132</a>
            <a href="/#">help@pall.se</a>
            <a href="/#">Online-Hjälp</a>
          </PopoverPanel>
        </Popover>
    )
}
export default HelpBtn
