import { Route,Routes } from "react-router-dom";
import { Register } from "./Register";
import { Login } from "./Login";
import { Books } from "./Books";
import { AddBook } from "./AddBook";
import { UpdateBook } from "./UpdateBook";

function App() {
  return(
    <Routes>
      <Route path="/" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/book" element={<Books/>} />
      <Route path="/addBook" element={<AddBook/>} />
      <Route path="/updateBook" element={<UpdateBook/>} />
    </Routes>
  )
}

export default App
