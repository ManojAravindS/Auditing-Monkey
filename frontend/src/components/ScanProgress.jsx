export default function ScanProgress({ loading }) {

    return (
        <div className="card">

            <h2>Status</h2>

            {loading ? (
                <p>Scanning Website...</p>
            ) : (
                <p>Ready</p>
            )}

        </div>
    );
}