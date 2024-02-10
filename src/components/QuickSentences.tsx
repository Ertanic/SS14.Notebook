import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { QuickSentence, QuickSentenceCategory, QuickSentenceCategoryRepository, QuickSentenceRepository } from "../repositories/QuickSentenceRepository";
import { createStore } from "solid-js/store";
import styles from './QuickSentences.module.scss';
import trash_icon from '../assets/trash_icon.svg';

function QuickSentences() {
    type QuickSentenceState = { categories: QuickSentenceCategory[], sentences: QuickSentence[] };
    const [state, setState] = createStore<QuickSentenceState>({ categories: [], sentences: [] });

    const sentenceRepo = new QuickSentenceRepository(),
        categoriesRepo = new QuickSentenceCategoryRepository()

    createEffect(async () => {
        await sentenceRepo.InitAsync();
        await categoriesRepo.InitAsync();

        const categories = await categoriesRepo.GetAll();
        const sentences = await sentenceRepo.GetAll();

        setState({ categories: categories, sentences: sentences });

        console.log(state);
    });

    onCleanup(async () => {
        await sentenceRepo.Close();
        await categoriesRepo.Close();
    });

    const enteredCategory = (title: string) => {
        const newCategory = new QuickSentenceCategory(title);
        categoriesRepo.Insert([newCategory]);
        setState('categories', (c) => [...c, newCategory]);
    }

    const deletingCategory = (id: number) => {
        categoriesRepo.Delete(id);
        setState('categories', c => [...c.filter(i => i.category_id !== id)]);

        console.log(state);
    }

    return (
        <section>
            <h1>Быстрое копирование фраз</h1>
            <div class={styles.categories}>
                <For each={state.categories}>
                    {item => <Category item={item} onDeleteCategory={deletingCategory} />}
                </For>
            </div>
            <AddCategory onEnterCategory={enteredCategory} />
        </section>
    );
}

// TODO: Add button for new sentence
type AddingSentenceHandler = () => void;
type DeletingCategoriesHandler = (category_id: number) => void;
type CategoryProps = { item: QuickSentenceCategory, onAddSentence?: AddingSentenceHandler, onDeleteCategory?: DeletingCategoriesHandler };
function Category(props: CategoryProps) {
    const clickedTrashButton = () => {
        if (props.onDeleteCategory) props.onDeleteCategory(props.item.category_id);
    };

    return (
        <div class={styles.category}>
            <div class={styles.category_title}>
                <h2>{props.item.name}</h2>
                <div class={styles.trash_icon} onClick={clickedTrashButton}><img src={trash_icon} /></div>
            </div>
        </div>
    )
}

type EnterCategoryHandler = (title: string) => void;
type AddCategoryProps = { onEnterCategory?: EnterCategoryHandler }
function AddCategory(props: AddCategoryProps) {
    const [adding, setAdding] = createSignal(false);
    let inputRef!: HTMLInputElement;

    const clicked = () => {
        setAdding(!adding());
        inputRef.focus();
    }

    const entered = (e: SubmitEvent) => {
        e.preventDefault();
        const value = inputRef.value;
        if (props.onEnterCategory) props.onEnterCategory(value);

        inputRef.blur();
    }

    const looseFocuse = (e: FocusEvent) => {
        e.preventDefault();
        setAdding(!adding());
    };

    const escapePressed = (e: KeyboardEvent) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        inputRef.blur();
    };

    return (
        <>
            <Show when={!adding()}>
                <button type="button" class={styles.add_button} onClick={clicked}>+</button>
            </Show>
            <Show when={adding()}>
                <form onSubmit={entered} class={styles.category_input}>
                    <input type="text" name="title" ref={inputRef} onBlur={looseFocuse} onKeyUp={escapePressed} />
                </form>
            </Show>
        </>
    )
}

export default QuickSentences;