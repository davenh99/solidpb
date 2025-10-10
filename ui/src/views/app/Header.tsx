import { ParentComponent } from "solid-js";

const Header: ParentComponent = (props) => {
  return <header class="px-[5vw] py-4 bg-black text-white">{props.children}</header>;
};

export default Header;
