import { Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react"

        
        
const HelpBtn = () => {
  return (
    <Menu>
      <MenuButton className="">
        <i className="fa-solid fa-phone"></i>
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="menu p-8 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <span> Behöver du hjälp?</span>
        </MenuItem>
        <MenuItem>
          <a href="/#">Online-Hjälp</a>
        </MenuItem>
        <MenuItem>
          <a href="/#">help@pall.se</a>
        </MenuItem>
        <MenuItem>
          <a href="/#">070123132</a>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
export default HelpBtn 