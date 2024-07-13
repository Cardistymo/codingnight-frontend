import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";

export default function LogoutPage() {
    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout();
        navigate("/");
    }, [logout, navigate]);

    return null;
}