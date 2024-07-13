import {Link, Outlet} from "react-router-dom";
import ConnectionErrorModal from "../modals/ConnectionErrorModal.jsx";
import InternalServerErrorModal from "../modals/InternalServerErrorModal.jsx";
import {createRef, useContext} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import InvalidCodeModal from "../modals/InvalidCodeModal.jsx";
import {CountdownContext} from "../context/CountdownContext.jsx";

export default function RootPage() {
    const { isAuthenticated, user } = useContext(AuthContext);
    const { totalSecondsUntilStart, totalSecondsUntilEnd, daysUntilEnd, hoursUntilEnd, minutesUntilEnd, secondsUntilEnd } = useContext(CountdownContext);

    const dropdownRef = createRef();

    return (
        <div className={"font-inter text-sm min-h-screen flex flex-col"}>
            <ConnectionErrorModal />
            <InternalServerErrorModal />
            <InvalidCodeModal />

            <div className={"navbar border-b-2 border-neutral px-20 h-14"}>
                <div className={"navbar-start"}>
                    <Link to="/" className="flex gap-x-2 select-none cursor-pointer items-center">
                        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                        </svg>
                        <p className="text-white font-semibold text-lg">CodingNight</p>
                    </Link>
                </div>
                <div className="navbar-center gap-x-8 font-medium select-none">
                    {totalSecondsUntilEnd > 0 && totalSecondsUntilStart < 0 ?
                        <div className={"flex flex-col items-center justify-center"}>
                            <p className={"font-mono text-xs font-semibold"}>TIME REMAINING</p>
                            <span className="countdown font-mono text-xl mt-1">
                                {daysUntilEnd <= 0 ? null : (<>
                                    <span style={{"--value": daysUntilEnd}} />:
                                </>) }
                                {daysUntilEnd <= 0 && hoursUntilEnd <= 0 ? null : (<>
                                    <span style={{"--value": hoursUntilEnd}} />:
                                </>) }
                                {daysUntilEnd <= 0 && hoursUntilEnd <= 0 && minutesUntilEnd <= 0 ? null : (<>
                                    <span style={{"--value": minutesUntilEnd}} />:
                                </>) }
                                <span style={{"--value": secondsUntilEnd}} />
                            </span>
                        </div> : (totalSecondsUntilEnd <= 0 ?
                        <p className={"font-mono font-semibold"}>
                            TIME EXPIRED
                        </p> : null)
                    }
                </div>
                <div className="navbar-end gap-x-1">
                    {
                        isAuthenticated ?
                            <details ref={dropdownRef} className="dropdown dropdown-end">
                                <summary tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full bg-secondary">
                                        <div
                                            className={"w-10 h-10 text-base font-medium flex items-center justify-center"}>
                                            <p>{user ? user.username.substring(0, 2).toUpperCase() : ""}</p>
                                        </div>
                                    </div>
                                </summary>
                                <ul className="p-2 shadow menu dropdown-content z-[1] rounded-box w-52 bg-secondary" >
                                    {user &&
                                        <li className={"pointer-events-none cursor-default"}>
                                            <p className={"text-base-content font-semibold"}>{user.username}</p>
                                        </li>
                                    }
                                    {user && user.role === 'admin' &&
                                        <li onClick={() => dropdownRef.current.open = false}>
                                            <Link to="/admin/panel">Admin Panel</Link>
                                        </li>
                                    }
                                    <li onClick={() => dropdownRef.current.open = false}>
                                        <Link to="/tasks">Tasks</Link>
                                    </li>
                                    <li onClick={() => dropdownRef.current.open = false}>
                                        <Link to="/logout">Logout</Link>
                                    </li>
                                </ul>
                            </details>
                            :
                            <>
                                <Link to="/login" className="btn text-white btn-sm p-4 px-6 content-center">Log
                                    in</Link>
                                <Link to="/register"
                                      className="btn text-white btn-primary btn-sm p-4 px-6 content-center">Sign
                                    up</Link>
                            </>
                    }
                </div>
            </div>
            <div className={"flex flex-1 justify-center items-center"}>
                <div className={"flex items-center justify-center h-full"}>
                    <div className={"flex flex-col justify-center items-center"}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}