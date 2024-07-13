import CustomInput from "../../components/CustomInput.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import validator from "validator/es";
import {API_ENDPOINT} from "../../main.jsx";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [labels, setLabels] = useState({
        username: {
            label: 'Username',
            error: false
        },
        email: {
            label: 'Email',
            error: false
        },
        password: {
            label: 'Password',
            error: false
        },
        repeatPassword: {
            label: 'Repeat Password',
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
        setLabels((prev) => ({...prev, email: {
            label: 'Email',
            error: false
        }}));
    }, [input.email, setLabels]);

    useEffect(() => {
        setLabels((prev) => ({...prev, password: {
            label: 'Password',
            error: false
        }}));
    }, [input.password, setLabels]);

    useEffect(() => {
        setLabels((prev) => ({...prev, repeatPassword: {
            label: 'Repeat Password',
            error: false
        }}));
    }, [input.repeatPassword, setLabels]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!input.username) {
            setLabels({...labels, username: {
                label: "Please pick a username",
                error: true
            }});
            return;
        }

        if (!input.email) {
            setLabels({...labels, email: {
                    label: "Please enter an email address",
                    error: true
                }});
            return;
        }

        if (!validator.isEmail(input.email)) {
            setLabels({...labels, email: {
                    label: "Email invalid",
                    error: true
                }});
            return;
        }

        if (!input.password) {
            setLabels({...labels, password: {
                    label: "Please pick a password",
                    error: true
                }});
            return;
        }

        if (!input.repeatPassword) {
            setLabels({...labels, repeatPassword: {
                    label: "Please repeat your password",
                    error: true
                }});
            return;
        }

        if (input.password !== input.repeatPassword) {
            setLabels({...labels, repeatPassword: {
                    label: "Passwords do not match",
                    error: true
                }});
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(API_ENDPOINT + '/users', {
                username: input.username,
                email: input.email,
                password: input.password,
            });
            setLoading(false);

            if (response.status === 201) {
                navigate("/confirm", { state: { username: input.username, email: input.email } });
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
                        setLabels({...labels, username: {
                            label: "Please pick a username",
                            error: true
                        }});
                        return;
                    case 'EMAIL_REQUIRED':
                        setLabels({...labels, email: {
                            label: "Please enter an email address",
                            error: true
                        }});
                        return;
                    case 'PASSWORD_REQUIRED':
                        setLabels({...labels, password: {
                                label: "Please pick a password",
                            error: true
                        }});
                        return;
                    case 'USERNAME_TAKEN':
                        setLabels({...labels, username: {
                            label: 'Username already taken',
                            error: true
                        }});
                        return;
                    case 'EMAIL_TAKEN':
                        setLabels({...labels, email: {
                            label: 'Email already registered',
                            error: true
                        }});
                        return;
                    case 'INVALID_EMAIL':
                        setLabels({...labels, email: {
                            label: 'Email invalid',
                            error: true
                        }});
                        return;
                    default:
                        console.error(error.response.data.status);
                        console.error(error.response.data.message);
                        return;
                }
            }

            console.error(error.response.status);
            console.error(error.response.data.message);
        }
    }

    return (
        <>
            <div className={"w-[360px] flex flex-col justify-center items-center gap-y-5 mb-7"}>
                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-2xl font-semibold text-white"}>Create an Account</p>
                    <h2 className="text-base mb-8">Hello! Please enter your details.</h2>
                </div>

                <CustomInput label={labels.username} value={input.username} placeholder={"username"}
                             onChange={e => setInput({...input, username: e.target.value})}
                />
                <CustomInput label={labels.email} value={input.email} placeholder={"example@gmail.com"}
                             onChange={e => setInput({...input, email: e.target.value})}
                />
                <CustomInput label={labels.password} value={input.password} placeholder={"••••••••••"}
                             onChange={e => setInput({...input, password: e.target.value})}
                             type={"password"}
                />
                <CustomInput label={labels.repeatPassword} value={input.repeatPassword} placeholder={"••••••••••"}
                             onChange={e => setInput({...input, repeatPassword: e.target.value})}
                             type={"password"}
                             onPaste={(e) => e.preventDefault()}
                />
            </div>
            <button
                className={"btn btn-primary btn-sm h-10 w-full"}
                disabled={labels.username.error || labels.email.error || labels.password.error || labels.repeatPassword.error || loading}
                onClick={handleSubmit}
            >
                {!loading ? "Sign Up" : <PulseLoader color={"white"} size={8}/>}
            </button>

            <p className={"mt-8"}>{"Already have an account? "}
                <Link className={"text-primary font-medium"} to={"/login"}>Login</Link>
            </p>
        </>
    );
}