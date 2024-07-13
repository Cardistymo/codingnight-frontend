import CodingTask from "../../components/CodingTask.jsx";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_ENDPOINT} from "../../main.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

export default function TasksPage() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState(null);
    const [page, setPage] = useState(0);

    const { logout } = useContext(AuthContext);

    useEffect(() => {
        async function loadTasks() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_ENDPOINT + '/tasks/overview', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setTasks(response.data);
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

        loadTasks().then();
    }, [setTasks]);

    if (!tasks) {
        return (
            <div className={"pb-20 pt-5"}>
                <div className={"flex flex-col items-center gap-y-1 mb-8"}>
                    <div className={"skeleton w-12 h-2.5 rounded"}></div>
                    <div className={"skeleton w-72 h-1.5 rounded"}></div>
                </div>

                <div className={"grid grid-cols-3 gap-10 p-10"}>
                    {
                        Array(9).fill(0).map((_, index) => <CodingTask key={index} skeleton />)
                    }
                </div>

                <div className={"flex items-center justify-center"}>
                    <div className="skeleton w-20 h-12 rounded-md"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={"pb-20 pt-5"}>
            <div className={"flex flex-col items-center gap-y-1 mb-8"}>
                <p className={"font-semibold text-xs text-center"}>{tasks.filter(task => task.solved).length + " / " + tasks.length}</p>
                <progress className="progress progress-primary w-72 h-1"
                          value={(tasks.filter(task => task.solved).length / tasks.length)} max="1"></progress>
            </div>

            <div className={"grid grid-cols-3 gap-10 p-10"}>
                {
                    tasks.slice(page * 9, (page + 1) * 9).map((task, index) => <CodingTask task={task} key={(page * 9) + index} />)
                }
            </div>

            {Math.ceil(tasks.length / 9) > 1 ? <div className={"flex items-center justify-center"}>
                <div className="join border border-secondary">
                    {
                        Array(Math.ceil(tasks.length / 9)).fill(0).map((_, btnPage) =>
                            <button key={btnPage} className={"join-item btn " + (page === btnPage ? "btn-active" : "")}
                                    onClick={() => setPage(btnPage)}>{btnPage + 1}</button>
                        )
                    }
                </div>
            </div> : null}
        </div>
    );
}