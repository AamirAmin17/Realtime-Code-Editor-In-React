//external imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

//internal imports
import { Home } from "./pages/Home";
import { EditorPage } from "./pages/Editor";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/editor/:roomId' element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
