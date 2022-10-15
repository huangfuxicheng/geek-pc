import { Route, Routes} from 'react-router-dom'
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import {AuthRoute} from "@/components/AuthRoute";
import Article from "@/pages/Article";
import Home from "@/pages/Home";
import Publish from "@/pages/Publish";
import {HistoryRouter, history} from "@/utils/history";
function App() {
    return (
        <HistoryRouter history={history}>
                <Routes>
                    <Route path="/*" element={
                        <AuthRoute>
                            <Layout />
                        </AuthRoute>
                    } >
                        {/* 二级路由默认页面 */}
                        <Route index element={<Home />} />
                        <Route path="article" element={<Article />} />
                        <Route path="publish" element={<Publish />} />
                    </Route>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
        </HistoryRouter>

    );
}

export default App;
