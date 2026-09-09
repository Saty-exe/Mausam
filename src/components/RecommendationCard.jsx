/**
 * A single personalised recommendation card.
 *
 * @param {object} props
 * @param {object} props.recommendation - from getPersonalizedRecommendations()
 *   { id, interest, interestLabel, icon, title, body, severity }
 */
function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div className={`rec-card rec-${recommendation.severity}`}>
      <div className="rec-card-top">
        <span className="rec-interest">{recommendation.interestLabel}</span>
        <span className="rec-severity">{recommendation.severity}</span>
      </div>
      <h3 className="rec-title">{recommendation.title}</h3>
      <p className="rec-body">{recommendation.body}</p>
    </div>
  );
}

export default RecommendationCard;
