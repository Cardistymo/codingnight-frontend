import {Link} from "react-router-dom";

export default function AccessRestrictedPage() {
    return (
        <div className={"w-full flex flex-col items-center justify-center"}>
            <p className={"text-3xl font-semibold mb-1"}>Access Restricted</p>
            <p className={"text-xl mb-10"}>Please login to view this page.</p>
            <Link to="/login" className={"btn btn-primary p-2 px-10"}>Login</Link>
        </div>
    )
}