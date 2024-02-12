import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { QuickSentence, QuickSentenceCategory, QuickSentenceCategoryRepository, QuickSentenceRepository } from "../repositories/QuickSentenceRepository";
import { createStore } from "solid-js/store";
import styles from './QuickSentences.module.scss';
import trash_icon from '../assets/trash_icon.svg';
import add_icon from '../assets/add_icon.svg';
import check_icon from '../assets/check_icon.svg';
import Modal from "@lutaok/solid-modal";
import CopyButton from "./CopyButton";

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
        createEffect(async () => await categoriesRepo.Insert([newCategory]));
        setState('categories', (c) => [...c, newCategory]);
    }

    const deletingCategory = (id: number) => {
        setState('categories', c => [...c.filter(i => i.category_id !== id)]);
        createEffect(async () => {
            await categoriesRepo.Delete(id);
            const sentences = state.sentences.filter(s => s.category_id === id);
            for (const sentence of sentences) {
                await sentenceRepo.Delete(sentence.quick_sentence_id);
            }
        })
    }

    const [isOpenModal, setIsOpenModal] = createSignal(false);
    const [categoryId, setCategoryId] = createSignal<number>(0);
    const addSentence = (id: number) => {
        setCategoryId(id);
        setIsOpenModal(true);
    };

    const addingSentence = (e: SubmitEvent) => {
        e.preventDefault();
        setIsOpenModal(false);

        const form = (e.currentTarget as HTMLFormElement);
        const [title, sentence] = [(form.elements[0] as HTMLInputElement).value, (form.elements[1] as HTMLInputElement).value];

        const model = new QuickSentence(title, sentence, categoryId());
        setState('sentences', s => [...s, model]);
        createEffect(async () => await sentenceRepo.Insert([model]));
    }

    return (
        <section>
            <h1>Быстрое копирование фраз</h1>
            <div class={styles.categories}>
                <For each={state.categories}>
                    {item => 
                        <Category 
                            item={item} 
                            sentences={state.sentences.filter(s => s.category_id === item.category_id)} 
                            onDeleteCategory={deletingCategory} 
                            onAddSentence={addSentence} />}
                </For>
            </div>
            <AddCategory onEnterCategory={enteredCategory} />

            <Modal contentClass="modal" overlayClass="overlay" closeOnOutsideClick isOpen={isOpenModal()} onCloseRequest={() => setIsOpenModal(false)}>
                <form onSubmit={addingSentence}>
                    <div class="modal__form_row">
                        <div class="modal__form_column">
                            <label for="sentence_title">Название</label>
                            <label for="sentence_content">Фраза</label>
                        </div>
                        <div class="modal__form_column">
                            <input type="text" maxlength={30} id="sentence_title" name="title" />
                            <textarea wrap="hard" name="sentence" id="sentence_content" rows={5} />
                        </div>
                    </div>
                    <button class="check_button" type="submit"><img src={check_icon} /></button>
                </form>
            </Modal>
        </section>
    );
}

type AddingSentenceHandler = (category_id: number) => void;
type DeletingCategoriesHandler = (category_id: number) => void;
type CategoryProps = {
    item: QuickSentenceCategory,
    sentences: Array<QuickSentence>,
    onAddSentence?: AddingSentenceHandler,
    onDeleteCategory?: DeletingCategoriesHandler
};
function Category(props: CategoryProps) {
    const clickedTrashButton = () => {
        if (props.onDeleteCategory) props.onDeleteCategory(props.item.category_id);
    };
    const clickedAddButton = () => {
        if (props.onAddSentence) props.onAddSentence(props.item.category_id);
    }

    return (
        <div class={styles.category}>
            <div class={styles.category_title}>
                <h2>{props.item.name}</h2>
                <div class={styles.icons_container}>
                    <div class={styles.icon} onClick={clickedAddButton}><img src={add_icon} /></div>
                    <div class={styles.icon} onClick={clickedTrashButton}><img src={trash_icon} /></div>
                </div>
            </div>
            <div class={styles.category_buttons}>
                <For each={props.sentences}>
                    {item => <CopyButton content={item.sentence}> {item.title} </CopyButton>}
                </For>
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