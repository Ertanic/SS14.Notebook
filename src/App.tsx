import Counter from "./components/Counter";
import QuickSentences from "./components/QuickSentences";
import Quotes from "./components/Quotes";
import Recipes from "./components/Recipes";
import Snowflakes from "./components/Snowflakes";

function App() {
  return (
    <>
      <header>
        {/* FIX: There was an attempt to open the file in a new window through WindowBuilder on 
        the Rust side, but it totally ignored the URL parameter and opened only the same page 
        as on the main window. */}
        <a class="link" href="/rick.html" target="_tauri">Начало смены</a>
        <a class="link" href="https://station14.ru/wiki/Корпоративный_Закон" target="_tauri">Корп. закон</a>
        <a class="link" href="https://station14.ru/wiki/Напитки" target="_tauri">Напитки выпивка</a>
        <a class="link" href="https://station14.ru/wiki/Готовка" target="_tauri">Готовка еды</a>
        <a class="link" href="https://station14.ru/wiki/Бумажная_работа" target="_tauri">Шаблоны документов</a>
        <a class="link" href="https://station14.ru/wiki/Таблица_навыков" target="_tauri">Таблица навыков</a>
        <a class="link" href="https://station14.ru/wiki/Задачи_станции" target="_tauri">Задачи станции</a>
        <a class="link" href="https://station14.ru/wiki/Руководство_по_ксеноархеологии" target="_tauri">Изучение артефактов</a>
        <a class="link" href="https://station14.ru/wiki/Химия" target="_tauri">Вики Химия</a>
        <a class="link" href="https://station14.ru/wiki/Медицина" target="_tauri">Вики Медицина</a>
      </header>

      <main>
        <QuickSentences/>
        <section>
          <Counter/>
          <Recipes/>
        </section>
      </main>

      <Snowflakes snowflakesCount={50} />
      <Quotes />
    </>
  )
};

export default App;