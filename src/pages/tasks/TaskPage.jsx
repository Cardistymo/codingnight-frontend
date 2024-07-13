import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";
import {PulseLoader} from "react-spinners";
import axios from "axios";
import {API_ENDPOINT} from "../../main.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";

function secondsToString(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (minutes > 0 ? minutes + "min " : null) + seconds + "s"
}

export default function TaskPage() {
    const { taskID } = useParams();

    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [task, setTask] = useState(null);
    const [cooldownTimestamp, setCooldownTimestamp] = useState(-1);
    const [cooldownCountdown, setCooldownCountdown] = useState(-1);
    const [label, setLabel] = useState({
        label: '',
        error: false
    });
    const [input, setInput] = useState("");

    const {logout} = useContext(AuthContext);

    const updateCooldown = useCallback((localCooldownTimestamp = cooldownTimestamp) => {
        setCooldownCountdown(Math.floor((localCooldownTimestamp - Date.now()) / 1000));
    }, [cooldownTimestamp]);

    useEffect(() => {
        cooldownCountdown >= 0 && setTimeout(updateCooldown, 1000);
    }, [cooldownCountdown, updateCooldown]);

    useEffect(() => {
        async function loadTask() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_ENDPOINT + '/tasks/' + taskID, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setTask(response.data);

                    if (response.data.locked) {
                        navigate("/accessrestricted");
                        return;
                    }

                    if (!response.data.cooldownTime) {
                        setCooldownCountdown(-1);
                        setCooldownTimestamp(-1);
                    }

                    setCooldownTimestamp(response.data.cooldownTime);
                    updateCooldown(response.data.cooldownTime);
                    return;
                }

                console.error(response.status);
                console.error(response.data.message);
            } catch (error) {
                if (!error.response) {
                    document.getElementById('connection_error_modal').showModal();
                    return;
                }

                if (error.response.status === 500) {
                    document.getElementById('internal_server_error_modal').showModal();
                    return;
                }

                if (error.response.status === 401) {
                    logout();
                    navigate("/");
                    return;
                }

                console.error(error.response.status);
                console.error(error.response.data.message);
            }
        }

        loadTask().then();
    }, [logout, navigate, taskID, updateCooldown]);

    useEffect(() => {
        setLabel({
            label: '',
            error: false
        });
    }, [input]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!input) {
            setLabel({
                label: 'Enter a solution',
                error: true
            });
            return;
        }

        try {
            setSubmitting(true);

            const token = localStorage.getItem('token');
            const response = await axios.post(API_ENDPOINT + '/tasks/submit', {
                id: task.id,
                solution: input
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSubmitting(false);

            if (response.status === 200) {
                navigate("/tasks");
                return;
            }

            console.error(response.status);
            console.error(response.data.message);
        } catch (error) {
            setSubmitting(false);
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
                    case 'SOLUTION_REQUIRED':
                        setLabel({
                            label: 'Please enter a solution',
                            error: true
                        });
                        return;
                    case 'WRONG_SOLUTION':
                        setCooldownTimestamp(error.response.data.cooldownTime);
                        updateCooldown(error.response.data.cooldownTime);
                        return;
                    case 'COOLDOWN_ACTIVE':
                        setCooldownTimestamp(error.response.data.cooldownTime);
                        updateCooldown(error.response.data.cooldownTime);
                        return;
                    default:
                        console.error(error.response.status);
                        console.error(error.response.data.message);
                }
            }

            if (error.response.status === 403) {
                switch (error.response.data.message) {
                    case 'EVENT_NOT_STARTED':
                    case 'EVENT_ENDED':
                    case 'TASK_ALREADY_COMPLETED':
                        setLabel({
                            label: 'Task already completed',
                            error: false
                        });
                        return;
                    case 'TASK_NOT_UNLOCKED':
                        setLabel({
                            label: 'Please solve all previous tasks before!',
                            error: false
                        });
                        return;
                    default:
                        console.error(error.response.status);
                        console.error(error.response.data.message);
                }
            }

            console.error(error.response.status);
            console.error(error.response.data.message);
        }
    }

    if (!task) {
        return (
            <div className={"flex flex-col justify-center items-center"}>
                <div className="skeleton h-8 w-36 mb-4 rounded-md"></div>
                <div className={"flex flex-col gap-y-2 mb-12 w-[600px]"}>
                    {
                        Array(10).fill(0).map((_, index) => <div key={index} className="skeleton h-4 w-full rounded-md" />)
                    }
                </div>
                <div className="skeleton h-10 w-80 rounded-xl mb-4"></div>
                <div className="skeleton h-10 w-80 rounded-xl btn"></div>
            </div>
        );
    }

    return (
        <div className={"flex flex-col justify-center items-center"}>
            <p className={"text-center text-2xl text-white font-semibold mb-4"}>
                {"Task " + (task.index + 1)}{task.solved ? <span className={"text-success"}>{" (solved)"}</span> : null}
            </p>
            <p className={"text-lg mb-12"}>{task.text}</p>
            <p className={"text-left w-full mb-1 " + (label.error ? "text-error" : "text-success")}>{label.label}</p>
            <input
                value={input}
                placeholder={"Solution"}
                onChange={e => setInput(e.target.value)}
                className={"mb-4 bg-secondary border border-neutral p-2 rounded-xl placeholder:text-secondary-content w-80 focus:outline-none focus:ring-0 text-white"}/>
            <button onClick={handleSubmit}
                    className={"btn btn-primary btn-sm h-10 w-80"}
                    disabled={task.solved || task.timeExpired || cooldownCountdown >= 0}
            >
                {submitting ? <PulseLoader color={"white"} size={8}/> : (task.timeExpired ? "Time Expired" : (cooldownCountdown >= 0 ? "Submit (" + secondsToString(cooldownCountdown) + ")" : "Submit"))}
            </button>
        </div>
    );
}