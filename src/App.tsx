import Quotes from "./components/Quotes";
import Snowflakes from "./components/Snowflakes";

function App() {
  return (
    <>
      <Snowflakes snowflakesCount={50} />
      <Quotes />
    </>
  )
};

export default App;