import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from "./pages/Login";
import Layout from "./pages/Layout";
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/layout" element={<Layout/>}/>
                </Routes>
            </div>
        </BrowserRouter>

    );
}

export default App;
