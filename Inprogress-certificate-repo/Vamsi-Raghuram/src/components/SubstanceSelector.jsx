import substances from "../data/substances";
import "../styles/substanceSelector.css";

function SubstanceSelector({ selectedSubstance, onSelect }) {
  return (
    <div className="substance-selector">
      <div className="substance-buttons">
        {Object.values(substances).map((item) => {
          const isSelected = selectedSubstance?.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`substance-btn ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(item)}
              style={{
                "--accent-color": item.color || "#3b82f6",
              }}
            >
              <span className="substance-name">{item.name}</span>
              <span className="substance-info">
                <span>MP: {item.meltingPoint}°C</span>
                <span className="dot">•</span>
                <span>BP: {item.boilingPoint}°C</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SubstanceSelector;