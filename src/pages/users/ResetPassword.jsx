import {PulseLoader} from "react-spinners";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import CustomInput from "../../components/CustomInput.jsx";
import ResetPasswordConfirmPage from "./ResetPasswordConfirmPage.jsx";
import {API_ENDPOINT} from "../../main.jsx";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [emailLabel, setEmailLabel] = useState({
        label: 'Email',
        error: false,
    });

    useEffect(() => {
        setEmailLabel({
            label: 'Email',
            error: false
        });
    }, [email, setEmailLabel]);

    const [searchParams] = useSearchParams();
    if (searchParams.has("token")) {
        return <ResetPasswordConfirmPage token={searchParams.get('token')} />
    }

    async function handleSubmit() {
        if (!email) {
            setEmailLabel({
                label: 'Please enter your email address',
                error: true
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(API_ENDPOINT + '/password-reset', {
                email,
            });

            setLoading(false);
            if (response.data.message === "RESET_EMAIL_SENT") {
                navigate("/resetpassword/requested", { state: { email: email } });
                return;
            }

            console.log(response.data.message);
        } catch (error) {
            setLoading(false);
            if (!error.response) {
                document.getElementById('connection_error_modal').showModal();
                return;
            }

            if (error.response.data.message === "INTERNAL_SERVER_ERROR") {
                document.getElementById('internal_server_error_modal').showModal();
                return;
            }

            if (error.response.data.message === "EMAIL_REQUIRED") {
                setEmailLabel({
                    label: 'Please enter your email address',
                    error: true,
                });
                return;
            }

            if (error.response.data.message === "EMAIL_NOT_FOUND") {
                setEmailLabel({
                    label: "Email not found. Please try again",
                    error: true,
                });
                return;
            }

            console.error(error);
        }

        setLoading(true);
    }

    return (
        <>
            <div className={"w-[360px] flex flex-col justify-center items-center gap-y-5 mb-7"}>
                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-2xl font-semibold text-white"}>Reset your password</p>
                    <h2 className="text-base mb-8">Please enter your email to continue.</h2>
                </div>

                <CustomInput label={emailLabel} value={email} placeholder={"example@gmail.com"}
                             onChange={e => setEmail(e.target.value)}
                />
            </div>

            <button
                className={"btn btn-primary btn-sm h-10 w-full"}
                disabled={loading}
                onClick={handleSubmit}
            >
                {!loading ? "Reset Password" : <PulseLoader color={"white"} size={8}/>}
            </button>
        </>
    );
}