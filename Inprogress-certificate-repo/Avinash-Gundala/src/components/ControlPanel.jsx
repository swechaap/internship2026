function ControlPanel({ onAction }) {
    return (
        <section className="controls">
            <button className="btn-start" onClick={() => onAction("start")}>
                ▶ Start Reaction
            </button>

            <button className="btn-pause" onClick={() => onAction("pause")}>
                ⏸ Pause
            </button>

            <button className="btn-reset" onClick={() => onAction("reset")}>
                🔄 Reset
            </button>
        </section>
    );
}

export default ControlPanel;