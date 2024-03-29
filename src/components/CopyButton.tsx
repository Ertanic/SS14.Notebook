import { clipboard } from "@tauri-apps/api";
import { ParentProps, children } from "solid-js";

type CopyButtonProps = { content: string } & ParentProps;

function CopyButton(props: CopyButtonProps) {
    const title = children(() => props.children);
    const clickHandler = async () => await clipboard.writeText(props.content);

    return <button onClick={clickHandler}>{title()}</button>
}

export default CopyButton;