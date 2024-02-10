// TODO: Rework into a wiki parser and caching.

import { invoke } from "@tauri-apps/api";
import { createEffect, createSignal } from "solid-js";
import styles from './Recipes.module.scss';

function Recipes() {
    let inputRef!: HTMLInputElement;
    let recipeDetailsRef!: HTMLDivElement;
    let datalistRef!: HTMLDataListElement;

    const [recipes, setRecipes] = createSignal({});

    createEffect(async () => {
        setRecipes(await invoke('read_recipes'));
        Object.keys(recipes())
            .forEach(k => {
                const option = new Option(undefined, k);
                datalistRef.appendChild(option);
            });
    });

    const clearInputAndDetails = () => {
        inputRef.value = '';
        recipeDetailsRef.innerHTML = '';
    }

    const showRecipeDetails = () => {
        let val = inputRef.value;
        recipeDetailsRef.innerHTML = (recipes() as any)[val];
    }

    return (
        <div class="container">
            <h1>Рецепты напитков</h1>
            <div class={styles.recipe_container}>
                <div style="margin-bottom: 20px;">
                    <input class={styles.recipe_input} list="recipes" onInput={showRecipeDetails} ref={inputRef} />
                    <button onClick={clearInputAndDetails}>Х</button>
                    <datalist id="recipes" ref={datalistRef}>
                    </datalist>
                </div>
                <div class="recipe_details" ref={recipeDetailsRef}>
                </div>
            </div>
        </div>
    )
}

export default Recipes;