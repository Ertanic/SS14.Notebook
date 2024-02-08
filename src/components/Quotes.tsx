import { invoke } from "@tauri-apps/api";
import { createSignal, createEffect } from "solid-js";
import Marquee from "./Marquee";

type Quote = { author: string, text: string }
type QuoteCollection = { quotes: Quote[] }

function Quotes() {
    const [quotes, setQuotes] = createSignal<Quote[]>([]);

    createEffect(async () => {
        const content: QuoteCollection = await invoke("read_quotes");
        setQuotes(content.quotes);
    });

    return <Marquee speed={1}>{ quotes().map(q => <p>{q.text} © {q.author}</p>) }</Marquee>
}

export default Quotes;