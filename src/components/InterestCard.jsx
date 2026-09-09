/**
 * Reusable grid of selectable interest chips.
 *
 * @param {object} props
 * @param {Array<{id:string,label:string}>} props.options - available interests
 * @param {string[]} props.selected - currently selected interest ids
 * @param {(id:string) => void} props.onToggle - called when a chip is toggled
 */
function InterestCard({ options = [], selected = [], onToggle }) {
  if (!options.length) return null;

  return (
    <div className="interests-grid">
      {options.map((opt) => {
        const isActive = selected.includes(opt.id);
        return (
          <label
            key={opt.id}
            className={`interest-chip ${isActive ? "active" : ""}`}
          >
            <input
              type="checkbox"
              value={opt.id}
              checked={isActive}
              onChange={() => onToggle?.(opt.id)}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default InterestCard;
