export default function ConnectionErrorModal() {
    return (
        <dialog id="connection_error_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Connection Error</h3>
                <p className="py-4">Cannot connect to the server. Please try again later!</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}