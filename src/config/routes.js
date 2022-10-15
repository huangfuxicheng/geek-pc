import {Navigate} from "react-router-dom";

const routes = [
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/layout',
        element:<Layout/>,
        children:[
            {
                path:'role',
                element:<Role/>
            },
            {
                path:'home',
                element:<Home/>
            },
        ]

    },
    {
        path:'/',
        element:<Navigate to="/login"/>
    }
]

export default routes