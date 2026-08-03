import "../styles/info.css";

export default function TemperatureCard({ progress }) {

    const temperature = (25 + progress * 0.08).toFixed(1);

    return (

        <div className="temp-card">

            <h2>🌡 Temperature</h2>

            <h1>{temperature}°C</h1>

            <p>Heat Released During Neutralization</p>

        </div>

    );

}