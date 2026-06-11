export default function BugList({ report }) {

    if (!report) return null;

    return (
        <div className="card">

            <h2>Scan Report</h2>

            <p>
                Pages Visited:
                {report.pagesVisited?.length}
            </p>

            <p>
                Links Found:
                {report.linksFound?.length}
            </p>

            <p>
                Buttons Found:
                {report.buttonsFound?.length}
            </p>

            <p>
                Forms Found:
                {report.formsFound}
            </p>

            <p>
                Broken Links:
                {report.brokenLinks?.length}
            </p>

        </div>
    );
}