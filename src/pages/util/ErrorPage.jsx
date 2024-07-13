import {Link} from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className={"h-screen w-full gap-y-5 flex flex-col items-center justify-center"}>
            <p className={"text-3xl"}>404 NOT FOUND</p>
            <Link to="/" className={"btn btn-primary p-2 px-10"}>Home</Link>
        </div>
    )
}