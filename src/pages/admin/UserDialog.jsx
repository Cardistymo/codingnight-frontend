import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {API_ENDPOINT} from "../../main.jsx";
import CustomInput from "../../components/CustomInput.jsx";
import {PulseLoader} from "react-spinners";

export default function UserDialog({ userID, update }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState(null);

    useEffect(() => {
        setNewUser(user);
    }, [user]);

    useEffect(() => {
        async function getUser() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(API_ENDPOINT + '/admin/users/' + userID, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setUser(response.data);
                    return;
                }

                console.log(response.status);
                console.log(response.data.message);
            } catch (e) {
                if (e.response.code === 401) {
                    navigate("/accessrestricted");
                    return;
                }

                console.log(e.response.status);
                console.log(e.response.data.message);
            }
        }

        setUser(null);
        getUser().then();
    }, [navigate, userID]);

    if (!newUser) {
        return (
            <dialog id="edit_user_modal" className="modal">
                <div
                    className={"modal-box max-w-none p-10 py-6 pb-10 bg-secondary rounded-lg w-[800px] flex flex-col items-center justify-center"}>
                    <form method="dialog">
                        <button className="btn btn-sm btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <p className={"font-semibold text-xl mb-8"}>Edit User</p>
                    <div className={"grid grid-cols-2 items-center justify-center gap-y-5 gap-x-5 mb-6 w-full"}>
                        <div className={"flex flex-col"}>
                            <div className={"skeleton h-5 w-12 rounded-lg mb-1"}></div>
                            <div className={"skeleton h-9 w-full rounded-lg"}></div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div className={"skeleton h-5 w-12 rounded-lg mb-1"}></div>
                            <div className={"skeleton h-9 w-full rounded-lg"}></div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div className={"skeleton h-5 w-12 rounded-lg mb-1"}></div>
                            <div className={"skeleton h-9 w-full rounded-lg"}></div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div className={"skeleton h-5 w-12 rounded-lg mb-1"}></div>
                            <div className={"skeleton h-9 w-full rounded-lg"}></div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div className={"skeleton h-5 w-12 rounded-lg mb-1"}></div>
                            <div className={"skeleton h-9 w-full rounded-lg"}></div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div className={"skeleton h-5 w-12 rounded-lg mb-1"}></div>
                            <div className={"skeleton h-9 w-full rounded-lg"}></div>
                        </div>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <div className={"flex items-center justify-center gap-x-6"}>
                            <button className={"btn btn-primary w-44"} onClick={handleSave} disabled>{loading ?
                                <PulseLoader color={"white"} size={8}/> : "Save"}</button>
                            <button className={"btn w-44"} disabled>Cancel</button>
                        </div>
                    </form>
                </div>
            </dialog>
        );
    }

    async function handleSave(e) {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(API_ENDPOINT + '/admin/users/' + userID, newUser, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLoading(false);

            if (response.status === 200) {
                setUser(response.data);
                update();
                return;
            }

            e.preventDefault();
            console.log(response.status);
            console.log(response.data.message);
        } catch (e) {
            e.preventDefault();

            if (e.response.code === 401) {
                navigate("/accessrestricted");
                return;
            }

            console.log(e.response.status);
            console.log(e.response.data.message);
        }
    }

    return (
        <dialog id="edit_user_modal" className="modal">
            <div
                className={"modal-box max-w-none p-10 py-6 pb-10 bg-secondary rounded-lg w-[800px] flex flex-col items-center justify-center"}>
                <form method="dialog">
                    <button className="btn btn-sm btn-ghost absolute right-2 top-2">✕</button>
                </form>

                <p className={"font-semibold text-xl mb-8"}>Edit User</p>
                <div className={"grid grid-cols-2 items-center justify-center gap-y-5 gap-x-5 mb-6 w-full"}>
                    <CustomInput label={{label: "ID"}} value={newUser.id} disabled/>
                    <CustomInput label={{label: "Username"}} value={newUser.username}
                                 onChange={(e) => setNewUser({
                                     ...newUser, username: e.target.value,
                                 })}
                    />
                    <CustomInput label={{label: "Email"}} value={newUser.email}
                                 onChange={(e) => setNewUser({
                                     ...newUser, email: e.target.value,
                                 })}
                    />
                    <div>
                        <p className={"text-left w-full mb-1 text-white"}>Verified</p>
                        <select
                            className="text-white select select-ghost focus:bg-secondary select-sm h-10 border border-neutral rounded-xl w-full focus:outline-none focus:ring-primary focus:ring-2"
                            value={newUser.isEmailVerified}
                            onChange={(e) => setNewUser({
                                ...newUser, isEmailVerified: e.target.value
                            })}
                        >
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </select>
                    </div>

                    <div>
                        <p className={"text-left w-full mb-1 text-white"}>Role</p>
                        <select
                            className="text-white select select-ghost focus:bg-secondary select-sm h-10 border border-neutral rounded-xl w-full focus:outline-none focus:ring-primary focus:ring-2"
                            value={newUser.role}
                            onChange={(e) => setNewUser({
                                ...newUser, role: e.target.value
                            })}
                        >
                            <option value={'user'}>User</option>
                            <option value={'admin'}>Admin</option>
                        </select>
                    </div>
                    <div className={"flex items-center justify-center gap-x-4"}>
                        <CustomInput label={{label: "Task"}} value={newUser.taskIndex} disabled/>
                        <form method="dialog" className="w-1/2">
                            <button className={"btn btn-sm h-10 mt-6 w-full"} onClick={() => {
                                document.getElementById('view_user_tasks_modal').showModal();
                            }}>View Tasks
                            </button>
                        </form>
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <div className={"flex items-center justify-center gap-x-6"}>
                        <button className={"btn btn-primary w-44"} onClick={handleSave}>{loading ? <PulseLoader color={"white"} size={8}/> : "Save"}</button>
                        <button className={"btn w-44"}>Cancel</button>
                    </div>
                </form>
            </div>
        </dialog>
    )
}