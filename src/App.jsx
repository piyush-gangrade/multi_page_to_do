import { BrowserRouter, Route, Routes } from "react-router"
import { MainTable } from "./components/MainTable"
import { NavBar } from "./components/NavBar"
import FirstTable from "./components/FirstTable"
import SecondTable from "./components/SecondTable"


function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<MainTable />} />
          <Route path="/first" element={<FirstTable />} />
          <Route path="/second" element={<SecondTable />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
