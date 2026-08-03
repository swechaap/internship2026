import { useState, useEffect } from "react";
import "../styles/info.css";

export default function InfoPanel({
    progress,
    status,
    waterCount,
    saltCount,
    events = []
}) {
    const totalProducts = 40;
    const efficiency = ((waterCount + saltCount) / totalProducts) * 100;

    const [page, setPage] = useState(1);
    const pageSize = 4;
    const totalPages = Math.max(1, Math.ceil(events.length / pageSize));

    // Auto-advance to latest page when new events arrive
    useEffect(() => {
        setPage(Math.max(1, Math.ceil(events.length / pageSize)));
    }, [events.length]);

    const formatTime = (ms) => {
        try {
            const d = new Date(ms);
            return d.toLocaleTimeString();
        } catch (_e) {
            return "";
        }
    };

    const currentEvents = events.slice((page - 1) * pageSize, page * pageSize);

    return (
        <section className="info-panel card-grid">
            <div className="info-left">
                <h2>Experiment Info</h2>

                <div className="definitions card">
                    <h4>What is an Acid?</h4>
                    <p>Donates H⁺ ions. Example: hydrochloric acid (HCl).</p>

                    <h4>What is a Base?</h4>
                    <p>Donates OH⁻ ions. Example: sodium hydroxide (NaOH).</p>

                    <h4>Neutralization</h4>
                    <p>When H⁺ and OH⁻ combine to form water (H₂O); other ions form salt (NaCl).</p>
                </div>

                <div className="event-log card">
                    <div className="log-header">
                        <h4>Live Event Timeline</h4>
                        {events.length > 0 && (
                            <span className="log-count">{events.length} Events Total</span>
                        )}
                    </div>
                    {events.length === 0 && <div className="muted">No events yet — click Start.</div>}
                    <ul className="event-list">
                        {currentEvents.map((e, idx) => (
                            <li key={idx} className="event-item">
                                <span className="time">{formatTime(e.time)}</span>
                                <span className="msg">{e.text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination Buttons - No scrollbars */}
                    {events.length > 0 && (
                        <div className="log-pagination">
                            <button 
                                className="pag-btn"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                ◀ Prev
                            </button>
                            <span className="pag-info">
                                Page {page} of {totalPages}
                            </span>
                            <button 
                                className="pag-btn"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                Next ▶
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="info-right">
                <div className="card progress-card">
                    <div className="progress-header">
                        <h3>Reaction Progress</h3>
                        <span className={`status-badge ${status === 'Reacting' ? 'reacting' : status === 'Reaction Complete' ? 'done' : 'waiting'}`}>{status}</span>
                    </div>

                    <div className="progress-wrap">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
                        </div>
                        <div className="progress-number">{Math.min(100, progress)}%</div>
                    </div>

                    <div className="stats">
                        <div className="stat">
                            <div className="label">💧 Water</div>
                            <div className="value">{waterCount}</div>
                        </div>
                        <div className="stat">
                            <div className="label">🧂 Salt</div>
                            <div className="value">{saltCount}</div>
                        </div>
                        <div className="stat">
                            <div className="label">⚡ Efficiency</div>
                            <div className="value">{Math.round(efficiency)}%</div>
                        </div>
                        <div className="stat">
                            <div className="label">🌡 Temp est.</div>
                            <div className="value">{(25 + progress * 0.08).toFixed(1)}°C</div>
                        </div>
                    </div>

                    <div className="equation">HCl + NaOH → NaCl + H₂O</div>
                </div>
            </div>
        </section>
    );
}