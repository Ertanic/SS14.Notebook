import { JSXElement, children, createEffect } from 'solid-js';
import styles from './Marquee.module.scss';

type MarqueeProps = { speed: number, children: JSXElement[] };

function Marquee(props: MarqueeProps) {
    let content = children(() => props.children);
    let containerRef: HTMLDivElement;
    const speed = props.speed;

    createEffect(() => {
        let progress = 1;

        const clone = containerRef?.firstChild?.cloneNode(true);
        if (clone !== undefined) { containerRef.appendChild(clone); }

        const loop = () => {
            let width = containerRef.offsetWidth;
            progress -= speed;
            if (progress <= width*-1) { progress = 1; }
            containerRef.style.transform = 'translateX(' + progress + 'px)';
            containerRef.style.transform += 'skewX(' + speed*0.4 + 'deg)';

            window.requestAnimationFrame(loop);
        }
        loop();
    })

    return (
        <div class={styles.marquee}>
            <div class={styles.marquee_inner} ref={containerRef!}>
                {content()}
            </div>
        </div>
    )
}

export default Marquee;