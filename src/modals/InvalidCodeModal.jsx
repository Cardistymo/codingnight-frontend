export default function InvalidCodeModal() {
    return (
        <dialog id="invalid_code_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Invalid Confirmation Code</h3>
                <p className="py-4">The code you entered isnt correct. Please try again.</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}