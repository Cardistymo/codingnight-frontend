import {useNavigate} from "react-router-dom";
import CustomInput from "../../components/CustomInput.jsx";
import {useEffect, useState} from "react";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import {API_ENDPOINT} from "../../main.jsx";

export default function RessetPasswordConfirmPage({ token }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        password: '',
        repeatPassword: '',
    });

    const [labels, setLabels] = useState({
        password: {
            label: 'New password',
            error: false
        },
        repeatPassword: {
            label: 'Repeat new password',
            error: false
        }
    });

    useEffect(() => {
        setLabels((prev) => ({...prev, password: {
                label: 'New password',
                error: false
            }}));
    }, [input.password, setLabels]);


    useEffect(() => {
        setLabels((prev) => ({...prev, repeatPassword: {
                label: 'Repeat new password',
                error: false
            }}));
    }, [input.repeatPassword, setLabels]);

    if (!token) {
        navigate("/404");
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();

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
            const response = await axios.post(API_ENDPOINT + '/password-reset/confirm', {
                token: token,
                newPassword: input.password,
            });
            setLoading(false);

            if (response.data.message === "NEW_PASSWORD_SET") {
                navigate("/login");
            }
        } catch (error) {
            setLoading(false);
            if (!error.response) {
                document.getElementById('connection_error_modal').showModal();
                return;
            }

            if (error.response.data.message && error.response.data.message === "INTERNAL_SERVER_ERROR") {
                document.getElementById('internal_server_error_modal').showModal();
                return;
            }

            if (error.response.data.message === "INVALID_TOKEN") {
                setLabels({...labels, password: {
                    label: "Invalid reset link. Please request a new one.",
                    error: true
                }});
                return;
            }

            if (error.response.data.message === "EXPIRED_TOKEN") {
                setLabels({...labels, password: {
                    label: "Your reset link expired. Please request a new one.",
                    error: true
                }});
                return;
            }

            console.log(error.response.data.message);
        }
    }

    return (
        <>
            <div className={"w-[360px] flex flex-col justify-center items-center gap-y-5 mb-7"}>
                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-2xl font-semibold text-white"}>Set new password</p>
                    <h2 className="text-base mb-8">Please enter a new password.</h2>
                </div>

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
                disabled={labels.password.error || labels.repeatPassword.error || loading}
                onClick={handleSubmit}
            >
                {!loading ? "Set new password" : <PulseLoader color={"white"} size={8}/>}
            </button>
        </>
    );
}