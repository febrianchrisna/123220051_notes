import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoteList from "./components/NoteList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NoteList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
