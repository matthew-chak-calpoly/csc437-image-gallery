import { useState } from "react";

export function ImageNameEditor({ imageId, initialValue, onRename }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(initialValue || "");
    function handleEditPressed() {
        setIsEditingName(true);
        setNameInput(initialValue || "");
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name
                    <input
                        required
                        style={{ marginLeft: "0.5em" }}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />
                </label>
                <button disabled={nameInput.length === 0} onClick={() => onRename(imageId, nameInput)}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }
}