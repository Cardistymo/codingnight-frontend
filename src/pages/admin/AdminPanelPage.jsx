import {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_ENDPOINT} from "../../main.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import UserDialog from "./UserDialog.jsx";
import TaskDialog from "./TaskDialog.jsx";

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);

    const [userPage, setUserPage] = useState(0);

    const [users, setUsers] = useState(null);
    const [editUser, setEditUser] = useState(null);

    const [sortOptions, setSortOptions] = useState({ field: 'username', desc: true });
    const [sortFunction, setSortFunction] = useState(() => (user1, user2) => user1.username.localeCompare(user2.username));

    const ascArrow = <svg className="h-4 w-4"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="16" y1="9" x2="12" y2="5" />  <line x1="8" y1="9" x2="12" y2="5" /></svg>;
    const descArrow = <svg className="h-4 w-4" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="16" y1="15" x2="12" y2="19"/><line x1="8" y1="15" x2="12" y2="19"/></svg>;

    useEffect(() => {
        switch (sortOptions.field) {
            case 'id':
                setSortFunction(() => (user1, user2) => {
                    if (!sortOptions.desc) {
                        const temp = user1;
                        user1 = user2;
                        user2 = temp;
                    }
                    return user1.id.localeCompare(user2.id);
                });
                return;
            case 'username':
                setSortFunction(() => (user1, user2) => {
                    if (!sortOptions.desc) {
                        const temp = user1;
                        user1 = user2;
                        user2 = temp;
                    }
                    return user1.username.localeCompare(user2.username);
                });
                return;
            case 'email':
                setSortFunction(() => (user1, user2) => {
                    if (!sortOptions.desc) {
                        const temp = user1;
                        user1 = user2;
                        user2 = temp;
                    }
                    return user1.email.localeCompare(user2.email);
                });
                return;
            case 'verified':
                setSortFunction(() => (user1, user2) => {
                    if (!sortOptions.desc) {
                        const temp = user1;
                        user1 = user2;
                        user2 = temp;
                    }
                    return user2.isEmailVerified - user1.isEmailVerified;
                });
                return;
            case 'role':
                setSortFunction(() => (user1, user2) => {
                    if (!sortOptions.desc) {
                        const temp = user1;
                        user1 = user2;
                        user2 = temp;
                    }
                    return user1.role.localeCompare(user2.role);
                });
                return;
            case 'task':
                setSortFunction(() => (user1, user2) => {
                    if (!sortOptions.desc) {
                        const temp = user1;
                        user1 = user2;
                        user2 = temp;
                    }
                    return user2.taskIndex - user1.taskIndex;
                });
                return;
        }
    }, [sortOptions]);

    const getUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINT + '/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setUsers(response.data);
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
                navigate("/accessrestricted");
                return;
            }

            console.error(error);
            console.error(error.response.status);
            console.error(error.response.data.message);
        }
    }, [navigate]);

    useEffect(() => {
        getUsers().then();
    }, [getUsers, logout, navigate]);

    if (!users) {
        return null;
    }

    function handleEditClick(e, user) {
        e.preventDefault();

        setEditUser(user);
        setTimeout(() => document.getElementById('edit_user_modal').showModal(), 10);
    }

    return (
        <div>
            <UserDialog userID={editUser?.id} update={getUsers} />
            <TaskDialog userID={editUser?.id} update={getUsers} />

            <div className="stats shadow bg-secondary mb-5">
                <div className="stat  text-center">
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value">{users.length}</div>
                    <div
                        className="stat-desc">{Math.round(users.filter((user) => user.isEmailVerified).length / users.length * 100)}%
                        verified
                    </div>
                </div>

                <div className="stat  text-center">
                    <div className="stat-title">Tasks Solved</div>
                    <div className="stat-value">{users.reduce((ac, user) => ac + (user.taskIndex - 1), 0)}</div>
                    <div
                        className="stat-desc">{Math.round(users.reduce((ac, user) => ac + (user.taskIndex - 1), 0) / users.length * 10) / 10} on
                        average
                    </div>
                </div>
            </div>

            <p className={"text-center mb-4 font-semibold text-xl"}>Users</p>
            <div className={"overflow-x-auto"}>
                <table className={"table bg-secondary w-[800px] mb-5"}>
                    <thead>
                    <tr>
                        <th className={"cursor-pointer items-center"} onClick={() => setSortOptions((prev) => {
                            return {field: 'id', desc: prev.field === 'id' ? !prev.desc : true};
                        })}>
                            <div className={"flex flex-row items-center"}>
                                ID{sortOptions.field === 'id' ? (sortOptions.desc ? descArrow : ascArrow) : null}
                            </div>
                        </th>
                        <th className={"cursor-pointer items-center"} onClick={() => setSortOptions((prev) => {
                            return {field: 'username', desc: prev.field === 'username' ? !prev.desc : true};
                        })}>
                            <div className={"flex flex-row items-center"}>
                                Username{sortOptions.field === 'username' ? (sortOptions.desc ? descArrow : ascArrow) : null}
                            </div>
                        </th>
                        <th className={"cursor-pointer items-center"} onClick={() => setSortOptions((prev) => {
                            return {field: 'email', desc: prev.field === 'email' ? !prev.desc : true};
                        })}>
                            <div className={"flex flex-row items-center"}>
                                Email{sortOptions.field === 'email' ? (sortOptions.desc ? descArrow : ascArrow) : null}
                            </div>
                        </th>
                        <th className={"cursor-pointer items-center"} onClick={() => setSortOptions((prev) => {
                            return {field: 'verified', desc: prev.field === 'verified' ? !prev.desc : true};
                        })}>
                            <div className={"flex flex-row items-center"}>
                                Verified{sortOptions.field === 'verified' ? (sortOptions.desc ? descArrow : ascArrow) : null}
                            </div>
                        </th>
                        <th className={"cursor-pointer items-center"} onClick={() => setSortOptions((prev) => {
                            return {field: 'role', desc: prev.field === 'role' ? !prev.desc : true};
                        })}>
                            <div className={"flex flex-row items-center"}>
                                Role{sortOptions.field === 'role' ? (sortOptions.desc ? descArrow : ascArrow) : null}
                            </div>
                        </th>
                        <th className={"cursor-pointer items-center"} onClick={() => setSortOptions((prev) => {
                            return {field: 'task', desc: prev.field === 'task' ? !prev.desc : true};
                        })}>
                            <div className={"flex flex-row items-center"}>
                                Task{sortOptions.field === 'task' ? (sortOptions.desc ? descArrow : ascArrow) : null}
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.sort(sortFunction).slice(userPage * 6, (userPage + 1) * 6).map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id.substring(0, 12)}...</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isEmailVerified ? "true" : "false"}</td>
                                    <td>{user.role}</td>
                                    <td>{user.taskIndex}</td>
                                    <td>
                                        <button className="btn btn-sm btn-ghost px-2"
                                                onClick={(e) => handleEditClick(e, user)}>
                                            <svg className="h-4 w-4" width="24" height="24"
                                                 viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                                                 fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z"/>
                                                <path
                                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                {Math.ceil(users.length / 6) > 1 ?
                    <div className={"flex items-center justify-center"}>
                        <div className="join border border-secondary">
                            {
                                Array(Math.ceil(users.length / 6)).fill(0).map((_, btnPage) =>
                                    <button key={btnPage} className={"join-item btn " + (userPage === btnPage ? "btn-active" : "")}
                                            onClick={() => setUserPage(btnPage)}>{btnPage + 1}</button>
                                )
                            }
                        </div>
                    </div> : null
                }
            </div>
        </div>
    );
}