import "../styles/info.css";

export default function Dashboard({

    waterCount,
    saltCount,
    progress

}){

    const efficiency=Math.round(

        ((waterCount+saltCount)/40)*100

    );

    const temperature=(

        25+progress*0.08

    ).toFixed(1);

    const ph=(

        1+progress*6/100

    ).toFixed(1);

    return(

        <div className="dashboard-grid">

            <div className="dashboard-card">

                <div className="dashboard-title">

                    💧 Water Produced

                </div>

                <div className="dashboard-value">

                    {waterCount}

                </div>

            </div>

            <div className="dashboard-card">

                <div className="dashboard-title">

                    🧂 Salt Produced

                </div>

                <div className="dashboard-value">

                    {saltCount}

                </div>

            </div>

            <div className="dashboard-card">

                <div className="dashboard-title">

                    ⚡ Efficiency

                </div>

                <div className="dashboard-value">

                    {efficiency}%

                </div>

            </div>

            <div className="dashboard-card">

                <div className="dashboard-title">

                    🧪 pH Meter

                </div>

                <div className="dashboard-value">

                    {ph}

                </div>

            </div>

            <div className="dashboard-card full-width">

                <div className="dashboard-title">

                    🌡 Temperature

                </div>

                <div className="dashboard-value">

                    {temperature}°C

                </div>

            </div>

        </div>

    );

}