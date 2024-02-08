import { createSignal, createEffect  } from "solid-js";
import styles from "./Snowflakes.module.scss";

type Position = { x: number, y: number };
class Snowflake {
    element: HTMLElement;
    speed: number;
    position: Position;
    scale = 1;
    counter = 0;
    sign = Math.random() < .5 ? 1 : -1;
    constructor(element: HTMLElement, speed: number, position: Position) {
        this.element = element;
        this.speed = speed;
        this.position = position;
        this.element.style.cssText += `opacity: ${((.1 + Math.random()) / 3)}`;
    }
    update() {
        this.counter += this.speed / 5000;
        this.position.x += this.sign * this.speed * Math.cos(this.counter) / 40;
        this.position.y += Math.sin(this.counter) / 40 + this.speed / 30;
        this.scale = .5 + Math.abs(10 * Math.cos(this.counter) / 20);
        let css = `transform: translate3d(${this.position.x}px,${this.position.y}px, 0) scale(${this.scale},${this.scale})`;
        this.element.style.cssText += css;
        let browserHeight = document.documentElement.clientHeight;
        this.position.y = this.position.y > browserHeight ? -50 : this.position.y;
    }
}

function Snowflakes({snowflakesCount}: {snowflakesCount: number}) {
    let [getEnableAnimations, setEnableAnimations] = createSignal(false);
    let [getResetPosition, setResetPosition] = createSignal(false);
    let snowflakes: Snowflake[] = []; 
    let reduceMotionQuery = matchMedia("(prefers-reduced-motion)");
    let browserWidth = document.documentElement.clientWidth;
    let browserHeight = document.documentElement.clientHeight
    let snowflakeRef: HTMLSpanElement, snowflakesContainerRef: HTMLDivElement;
    const setAccessibilityState = () => setEnableAnimations(true);
    const getPosition = (offset: number, size: number) => Math.round(-1 * offset + Math.random() * (size + 2 * offset));

    const move = () => {
        if (getEnableAnimations())
            for (let snowflake of snowflakes)
                snowflake.update();

        if (getResetPosition()) {
            browserWidth = document.documentElement.clientWidth;
            browserHeight = document.documentElement.clientHeight;

            for (let snowflake of snowflakes)
                snowflake.position = { x: getPosition(50, browserWidth), y: getPosition(50, browserHeight) };

            setResetPosition(false);
        }

        requestAnimationFrame(move);
    }

    const generateSnowflakes = () => {
        snowflakesContainerRef.style.display = "block";
        for (let i = 0; i < snowflakesCount; i++) {
            let clone = snowflakeRef.cloneNode(true) as HTMLElement;
            snowflakesContainerRef.appendChild(clone);
            let initialPos = { x: getPosition(50, browserWidth), y: getPosition(50, browserHeight) };
            let speed = 5 + Math.random() * 40;
            let snowflakeObj = new Snowflake(
                clone,
                speed,
                initialPos);
            snowflakes.push(snowflakeObj);
        }
        snowflakesContainerRef.removeChild(snowflakeRef);
        move();
    }

    createEffect(() => {
        setAccessibilityState();
        reduceMotionQuery.addEventListener("change", setAccessibilityState);
        if (getEnableAnimations()) {
            window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
            window.addEventListener("resize", () => { setResetPosition(true) }, false);
        }
    });

    return (
        <div class={styles.snowflakeContainer} ref={snowflakesContainerRef!}>
            <span class={styles.snowflake} ref={snowflakeRef!}></span>
        </div>
    )
}

export default Snowflakes;