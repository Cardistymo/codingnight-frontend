export default function InternalServerErrorModal() {
    return (
        <dialog id="internal_server_error_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Internal Server Error</h3>
                <p className="py-4">Internal Server Error. Please try again later!</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}