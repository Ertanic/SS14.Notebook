import { getName, getVersion } from "@tauri-apps/api/app";
import { createResource, createSignal } from "solid-js";
import styles from "./AboutProgram.module.scss";
import Modal from "@lutaok/solid-modal";

function AboutProgram() {
    const [isOpenModal, setIsModalOpen] = createSignal(false);
    // from package.json
    const [version] = createResource(async () => await getVersion());
    const [appName] = createResource(async () => await getName());

    const moreInfoClicked = (e: MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    return (
        <>
            <div class={styles.about_program}>
                <p><a href="#" onClick={moreInfoClicked}>О программе</a></p>
                <p>{"Версия: " + version()}</p>
            </div>

            <Modal closeOnOutsideClick isOpen={isOpenModal()} onCloseRequest={() => setIsModalOpen(false)} contentClass="modal" overlayClass="overlay">
                <div class="text">
                    <h1>{appName()}</h1>
                    <p>Оригинальная идея: <a href="https://discordapp.com/users/340895104518848513" target="_blank">DefectiveTh</a></p>
                    <p>Репозиторий программы: <a href="https://github.com/Ertanic/SS14.Notebook/" target="_blank">GitHub</a></p>
                    <p>Лицензия: <a href="https://github.com/Ertanic/SS14.Notebook/blob/main/LICENCE" target="_blank">MIT</a></p>
                </div>
            </Modal>
        </>
    );
}

export default AboutProgram;