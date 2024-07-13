import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import {API_ENDPOINT} from "../../main.jsx";

function NumberInput({ ...props }) {
    return (
        <input
            className="w-10 h-10 text-center text-white font-semibold text-xl bg-secondary border border-neutral focus:outline-none focus:ring-2 focus:ring-primary rounded"
            maxLength={1}
            {...props}
        />
    );
}

export default function ConfirmPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const {email, username} = useLocation().state;

    const [code, setCode] = useState(new Array(6).fill(''));

    function handleChange(element, index) {
        if (isNaN(element.value)) {
            return;
        }

        setCode((prev) => [...prev.map((currentCode, currentIndex) => (currentIndex === index ? element.value : currentCode))]);

        if (element.value) {
            if (!element.nextSibling) {
                return;
            }

            element.nextSibling.focus();
            return;
        }

        if (index === 0) {
            return;
        }

        element.parentNode.children[index - 1].focus();
    }

    function handlePaste(event) {
        event.preventDefault();
        const pasteData = event.clipboardData.getData('text').replace(' ', '');
        if (/^\d{6}$/.test(pasteData)) {
            const pasteArray = pasteData.split('');
            setCode(pasteArray);
            if (event.target.parentNode.lastChild) {
                event.target.parentNode.lastChild.focus();
            }
        }
    }

    useEffect(() => {
        let complete = true;
        for (let digit of code) {
            if (isNaN(digit) || digit === '') {
                complete = false;
            }
        }
        if (complete) {
            confirmCode().then();
        }
    }, [code]);

    async function confirmCode(newCode) {
        try {
            setLoading(true);
            const confirmationCode = newCode || code.join('');
            const response = await axios.post( API_ENDPOINT + '/users/verify-email', {
                email: email,
                verificationCode: confirmationCode
            });
            setLoading(false);

            if (response.data.status === 200) {
                navigate('/confirmed', { state: { username: username } });
                return;
            }

            console.error(response.data.status);
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
                    case 'EMAIL_ALREADY_VERIFIED':
                        navigate('/confirmed', { state: { username: username } });
                        return;
                    case 'INVALID_CODE':
                        setCode(new Array(6).fill(''));
                        document.getElementById('invalid_code_modal').showModal();
                        return;
                    default:
                        console.error(error.response.data.status);
                        console.error(error.response.data.message);
                        return;
                }
            }

            console.error(error.response.data.status);
            console.error(error.response.data.message);
        }
    }

    if (!email || !username) {
        navigate("/404");
        return null;
    }

    return (
        <div className={"w-[360px] flex flex-col justify-center items-center gap-y-5 mb-7"}>
            <div className={"flex flex-col items-center justify-center"}>
                <p className={"text-2xl font-semibold text-white"}>Welcome{username ? " " + username : null}!</p>
                <h2 className="text-base mb-8">Please confirm your email address by entering the code we sent to you!</h2>

                <div className={"flex gap-x-2 mb-8"}>
                    {
                        code.map((code, index) =>
                            <NumberInput
                                key={index}
                                value={code}
                                onChange={(e) => handleChange(e.target, index)}
                                onPaste={handlePaste}
                                onKeyDown={(e) => {
                                    if (e.target.value) {
                                        return;
                                    }
                                    if (e.key === "Backspace") {
                                        if (index === 0) {
                                            return;
                                        }
                                        e.preventDefault();
                                        e.target.parentNode.children[index - 1].focus();
                                    }
                                }}
                            />
                        )
                    }
                </div>

                <button className={"btn btn-primary btn-sm h-10 w-full"} onClick={confirmCode} disabled={loading}>{
                    !loading ? "Confirm" : <PulseLoader color={"white"} size={8} />
                }</button>
            </div>
        </div>
    );
}