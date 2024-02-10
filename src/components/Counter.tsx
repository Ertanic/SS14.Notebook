import { createSignal } from "solid-js";
import styles from './Counter.module.scss';

function Counter() {
    const [madeCount, setMadeCount] = createSignal(0);
    const [brokenCount, setBrokenCount] = createSignal(0);

    return (
        <div class="container">
            <h1>Счетчик налитого и разбитого</h1>
            <button class={styles.button}
                onClick={() => setMadeCount(madeCount() + 1)}>
                {`Сделал ${madeCount()} напитков (Жмякни для изменения)`}
            </button>
            <button class={styles.button}
                onClick={() => setBrokenCount(brokenCount() + 1)}>
                {`Разбили ${brokenCount()} бокалов (Жмякни для изменения)`}
            </button>
        </div>
    )
}

export default Counter;