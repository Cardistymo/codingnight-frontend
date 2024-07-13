import {useEffect, useState} from "react";

export default function ScoreboardPage() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3030/v1/stats/scoreboard');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');

        };

        ws.onerror = (e) => {
            console.error(e);
        }

        ws.onmessage = (message) => {
            console.log("updating scoreboard...");

            const data = JSON.parse(message.data);
            setUsers(data);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => {
            ws.close();
        };

    }, []);

    if (!users) {
        return (
            <>
                <div className={"skeleton h-8 w-36 rounded mb-4"} />
                <table className={"table w-[600px] rounded-md text-lg skeleton"}>
                    <thead>
                        <tr className={"h-10"} />
                    </thead>
                    <tbody className={"font-semibold text-center h-[530px]"} />
                </table>
            </>
        );
    }

    return (
        <>
            <p className={"text-center mb-4 font-semibold text-xl"}>Scoreboard</p>
            <table className={"table bg-secondary w-[600px] rounded-md text-lg"}>
                <thead>
                    <tr className={"text-center"}>
                        <th>Place</th>
                        <th>User</th>
                        <th>Tasks Solved</th>
                    </tr>
                </thead>
                <tbody className={"font-semibold text-center"}>
                {
                    users.map((user, index) => {
                        return (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.taskIndex}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    );
}