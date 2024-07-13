import CustomInput from "../../components/CustomInput.jsx";
import {Link, useNavigate} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext.jsx";
import {API_ENDPOINT} from "../../main.jsx";

export default function LoginPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const [input, setInput] = useState({
        username: '',
        password: '',
    });

    const [labels, setLabels] = useState({
        username: {
            label: 'Username',
            error: false
        },
        password: {
            label: 'Password',
            error: false
        }
    });

    useEffect(() => {
        setLabels((prev) => ({...prev, username: {
            label: 'Username',
            error: false
        }}));
    }, [input.username, setLabels]);

    useEffect(() => {
        setLabels((prev) => ({...prev, password: {
            label: 'Password',
            error: false
        }}));
    }, [input.password, setLabels]);

    async function handleLogin() {
        if (!input.username) {
            setLabels((prev) => ({...prev, username: {
                label: 'Please enter your username',
                error: true
            }}));
            return;
        }

        if (!input.password) {
            setLabels((prev) => ({...prev, password: {
                label: 'Please enter your password',
                error: true
            }}));
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(API_ENDPOINT + '/sessions', {
                username: input.username,
                password: input.password,
            });
            setLoading(false);

            if (response.status === 200) {
                login(response.data.token, response.data.id);
                navigate("/");
                return;
            }

            console.error(response.status);
            console.error(response.data.message);
        } catch (error) {
            setLoading(false);
            if (!error.response) {
                document.getElementById('connection_error_modal').showModal();
                return;
            }

            if (error.response.status === 500) {
                document.getElementById('internal_server_error_modal').showModal();
                return;
            }

            if (error.response.status === 400) {
                switch (error.response.data.message) {
                    case 'USERNAME_REQUIRED':
                        setLabels((prev) => ({...prev, username: {
                            label: 'Please enter your username',
                            error: true
                        }}));
                        return;
                    case 'PASSWORD_REQUIRED':
                        setLabels((prev) => ({...prev, password: {
                            label: 'Please enter your password',
                            error: true
                        }}));
                        return;
                    case 'INVALID_CREDENTIALS':
                        setLabels((prev) => ({...prev, password: {
                            label: 'Invalid username or password. Please try again',
                            error: true,
                        }}));
                        return;
                    case 'EMAIL_NOT_VERIFIED':
                        navigate("/confirm", { state: { username: input.username, email: error.response.data.email } });
                        return;
                    default:
                        console.error(error.response.status);
                        console.error(error.data.message);
                }
            }

            console.error(error.response.status);
            console.error(error.data.message);
        }
    }

    return (
        <>
            <div className={"w-[360px] flex flex-col justify-center items-center gap-y-5 mb-4"}>
                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-2xl font-semibold text-white"}>Log in to your account</p>
                    <h2 className="text-base mb-8">Welcome back! Please enter your details.</h2>
                </div>

                <CustomInput label={labels.username} value={input.username} placeholder={"username"}
                             onChange={e => setInput({...input, username: e.target.value})}
                />
                <CustomInput label={labels.password} value={input.password} placeholder={"••••••••••"}
                             type={"password"}
                             onChange={e => setInput({...input, password: e.target.value})}
                />
            </div>

            <div className={"w-full flex justify-end mb-4"}>
                <Link to="/resetpassword" className={"text-primary font-medium"}>Forgot password</Link>
            </div>

            <button
                className={"btn btn-primary btn-sm h-10 w-full"}
                disabled={labels.username.error || labels.password.error || loading}
                onClick={handleLogin}
            >
                {!loading ? "Sign in" : <PulseLoader color={"white"} size={8}/>}
            </button>

            <p className={"mt-8"}>{"Don’t have an account? "}
                <Link className={"text-primary font-medium"} to={"/register"}>Sign up</Link>
            </p>
        </>
    );
}