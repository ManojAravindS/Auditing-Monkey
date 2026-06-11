import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";

export default function Dashboard() {

    const [url, setUrl] = useState("");
    const [logs, setLogs] = useState([]);
    const [report, setReport] = useState(null);

    useEffect(() => {

        socket.on("scanUpdate", (data) => {

            setLogs(prev => [
                ...prev,
                data.message
            ]);

        });

        socket.on("scanComplete", (data) => {

            setReport(data);

        });

        return () => {

            socket.off("scanUpdate");
            socket.off("scanComplete");

        };

    }, []);

    const startScan = async () => {

        setLogs([]);
        setReport(null);

        await API.post("/scan", {
            url
        });

    };

    return (
        <div className="container">

            <h1>Auditing-Monkey</h1>

            <input
                value={url}
                onChange={(e) =>
                    setUrl(e.target.value)
                }
                placeholder="https://example.com"
            />

            <button onClick={startScan}>
                Start Scan
            </button>

            <div className="report">

                <h2>Live Activity</h2>

                {logs.map((log, index) => (
                    <p key={index}>
                        {log}
                    </p>
                ))}

            </div>

            {report && (

                <div className="report">

                    <h2>Scan Complete</h2>

                    <p>
                        Pages:
                        {report.pagesVisited.length}
                    </p>

                    <p>
                        Links:
                        {report.linksFound.length}
                    </p>

                    <p>
                        Buttons:
                        {report.buttonsFound.length}
                    </p>

                    <p>
                        Broken:
                        {report.brokenLinks.length}
                    </p>

                </div>

            )}

        </div>
    );
}