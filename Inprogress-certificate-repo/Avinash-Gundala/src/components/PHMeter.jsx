export default function PHMeter({ progress }) {

    let ph = 1;

    if (progress > 0) {
        ph = 1 + (progress / 100) * 6;
    }

    return (

        <div className="ph-card">

            <h3>🧪 pH Meter</h3>

            <h1>{ph.toFixed(1)}</h1>

            <p>

                {
                    ph < 3
                        ? "Strong Acid"
                        : ph < 6
                        ? "Weak Acid"
                        : ph < 7
                        ? "Nearly Neutral"
                        : "Neutral"
                }

            </p>

        </div>

    );

}