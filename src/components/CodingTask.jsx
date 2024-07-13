import {Link} from "react-router-dom";

export default function CodingTask({ task, skeleton = false }) {
    if (skeleton) {
        return (
            <div className={"flex flex-col items-center p-2 w-56 h-24 rounded-md shadow-md skeleton"} />
        );
    }

    if (!task) {
        return <div className={"flex flex-col items-center p-2 bg-secondary w-56 h-24 rounded-md shadow-md skeleton"} />;
    }

    let timeString;

    if (task.timeNeeded) {
        let totalSeconds = Math.floor(task.timeNeeded / 1000);
        const hours = Math.floor(totalSeconds / (60 * 60));
        totalSeconds %= (60 * 60);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timeString = (hours > 0 ? hours + "h " : "")  + (minutes > 0 ? minutes + "min " : "") + seconds + "s"
    }

    return (
        <Link to={"/task/" + task.id}
              className={"flex flex-col items-center p-2 bg-secondary w-56 h-24 rounded-md shadow-md " + (task.locked ? "pointer-events-none select-none opacity-45" : "cursor-pointer hover:scale-105")}
              style={{transition: "all 50ms"}}>
            <p className={"text-xl font-semibold text-center"}>{"Task " + (task.index + 1)}</p>
            {
                task.solved ?
                    <div className={"flex flex-row items-center justify-center gap-x-0.5 mb-2"}>
                        <p className={"text-center"}>{timeString ? timeString : "unknown"}</p>
                    </div> :
                    <div className={"mb-7"}></div>
            }
            {
                task.locked ?
                    <div className={"flex flex-row items-center justify-center gap-x-1"}>
                        <svg className="h-4 w-4 text-error" width="24" height="24" viewBox="0 0 24 24"
                             strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"/>
                            <circle cx="12" cy="12" r="9"/>
                            <path d="M10 10l4 4m0 -4l-4 4"/>
                        </svg>
                        <p className={"locked text-center text-error"}>locked</p>
                    </div> :
                    task.solved ?
                        <div className={"flex flex-row items-center justify-center gap-x-1"}>
                            <svg className="h-4 w-4 text-success" width="24" height="24" viewBox="0 0 24 24"
                                 strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z"/>
                                <circle cx="12" cy="12" r="9"/>
                                <path d="M9 12l2 2l4 -4"/>
                            </svg>
                            <p className={"locked text-center text-success"}>solved</p>
                        </div> :
                        <div className={"flex flex-row items-center justify-center gap-x-1"}>
                            <svg className="h-4 w-4" width="24" height="24" viewBox="0 0 24 24"
                                 strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z"/>
                                <circle cx="12" cy="12" r="9"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p className={"locked text-center"}>pending</p>
                        </div>
            }
        </Link>
    );
}