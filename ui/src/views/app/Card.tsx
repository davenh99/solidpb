import { ParentComponent } from "solid-js";

interface Props {
  class?: string;
}

const Card: ParentComponent<Props> = (props) => {
  return <div class={`${props.class ?? ""} rounded-xl p-3 bg-black text-white`}>{props.children}</div>;
};

export default Card;
