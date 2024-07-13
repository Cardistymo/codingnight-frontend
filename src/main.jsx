import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootPage from "./pages/RootPage.jsx";
import RegisterPage from "./pages/users/RegisterPage.jsx";
import LoginPage from "./pages/users/LoginPage.jsx";
import ErrorPage from "./pages/util/ErrorPage.jsx";
import ConfirmPage from "./pages/users/ConfirmPage.jsx";
import ConfirmedPage from "./pages/users/ConfirmedPage.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import LogoutPage from "./pages/users/LogoutPage.jsx";
import ResetPassword from "./pages/users/ResetPassword.jsx";
import ResetPasswordRequestSucessPage from "./pages/users/ResetPasswordRequestSucessPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import AccessRestrictedPage from "./pages/util/AccessRestrictedPage.jsx";
import TaskPage from "./pages/tasks/TaskPage.jsx";
import TasksPage from "./pages/tasks/TasksPage.jsx";
import {CountdownProvider} from "./context/CountdownContext.jsx";
import AdminPanelPage from "./pages/admin/AdminPanelPage.jsx";
import ScoreboardPage from "./pages/stats/ScoreboardPage.jsx";

//export const API_ENDPOINT = "https://api.codingnight.cardistymo.dev/v1";
export const API_ENDPOINT = "http://localhost:3030/v1";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <MainPage />,
            },
            {
                path: "/accessrestricted",
                element: <AccessRestrictedPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/logout",
                element: <LogoutPage />,
            },
            {
                path: "/resetpassword",
                element: <ResetPassword />,
            },
            {
                path: "/resetpassword/requested",
                element: <ResetPasswordRequestSucessPage />,
            },
            {
                path: "/confirm",
                element: <ConfirmPage />,
            },
            {
                path: "/confirmed",
                element: <ConfirmedPage />,
            },
            {
                path: "/tasks",
                element: <TasksPage />,
            },
            {
                path: "/task/:taskID",
                element: <TaskPage />,
            },

            {
                path: "/scoreboard",
                element: <ScoreboardPage />,
            },
            {
                path: "/admin/panel",
                element: <AdminPanelPage />,
            },
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <CountdownProvider>
            <RouterProvider router={router} />
        </CountdownProvider>
    </AuthProvider>,
)
