import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import {CountdownContext} from "../context/CountdownContext.jsx";
import {Link} from "react-router-dom";

function format(s) {
    return String(s).length === 1 ? ("0" + s) : s;
}

export default function MainPage() {
    const { isAuthenticated } = useContext(AuthContext);
    const { startTimestamp, totalSecondsUntilStart, daysUntilStart, hoursUntilStart, minutesUntilStart, secondsUntilStart } = useContext(CountdownContext);
    const [targetDate, setTargetDate] = useState(null);

    useEffect(() => {
        setTargetDate(new Date(startTimestamp));
    }, [startTimestamp]);

    return (
        <>
            <div className={"flex flex-col justify-center items-center gap-y-5 mb-7"}>
                <div className={"flex flex-col items-center justify-center"}>
                    <p className={"text-6xl font-black text-white mb-2"}>CodingNight@KKG</p>
                    {targetDate ? <p className={"text-4xl font-bold text-white mb-24"}>{format(targetDate.getDate()) + "." + format(targetDate.getMonth() + 1) + "." + targetDate.getFullYear() + " " + format(targetDate.getHours()) + ":" + format(targetDate.getMinutes()) + " Uhr"}</p> : <div className={"mb-24"}></div>}
                    {
                        totalSecondsUntilStart < 0 ? (
                                !isAuthenticated ?
                                    <Link to={"/login"} className={"btn btn-secondary text-white p-4 w-40 content-center"}>Login</Link> :
                                    <div className={"flex flex-row items-center justify-center gap-x-8"}>
                                        <Link to={"/tasks"} className={"btn btn-secondary text-white p-4 w-40 content-center"}>Tasks</Link>
                                        <Link to={"/scoreboard"} className={"btn btn-secondary text-white p-4 w-40 content-center"}>Scoreboard</Link>
                                    </div>
                            ) :
                            <div className="flex gap-5 text-white">
                                {
                                    daysUntilStart <= 0 ? null :
                                        <div>
                                        <span className="countdown font-mono text-7xl">
                                            <span style={{"--value": daysUntilStart}}></span>
                                        </span>
                                            days
                                        </div>
                                }
                                {
                                    daysUntilStart <= 0 && hoursUntilStart <= 0 ? null :
                                        <div>
                                        <span className="countdown font-mono text-7xl">
                                            <span style={{"--value": hoursUntilStart}}></span>
                                        </span>
                                            hours
                                        </div>
                                }
                                {
                                    daysUntilStart <= 0 && hoursUntilStart <= 0 && minutesUntilStart <= 0 ? null :
                                        <div>
                                        <span className="countdown font-mono text-7xl">
                                          <span style={{"--value": minutesUntilStart}}></span>
                                        </span>
                                            min
                                        </div>
                                }

                                <div>
                                <span className="countdown font-mono text-7xl">
                                  <span style={{"--value": secondsUntilStart}}></span>
                                </span>
                                    sec
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    );
}