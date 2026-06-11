import { useState } from "react";

export default function UrlInput({ onScan }) {

    const [url, setUrl] = useState("");

    const handleSubmit = () => {

        if (!url) return;

        onScan(url);
    };

    return (
        <div className="card">

            <h2>Website URL</h2>

            <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button onClick={handleSubmit}>
                Start Scan
            </button>

        </div>
    );
}