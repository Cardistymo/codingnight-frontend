import {Link, useLocation} from "react-router-dom";

export default function ConfirmedPage() {
    const {username} = useLocation().state || '';

    return (
        <>
            <p className={"text-3xl font-semibold text-white"}>Account setup finished</p>
            <h2 className="text-xl mb-8">Thanks for signing up for the CodingNight{username ? " " + username : ""}!</h2>

            <Link to="/login" className={"btn btn-primary px-20 mt-10"}>Log in</Link>
        </>
    );
}