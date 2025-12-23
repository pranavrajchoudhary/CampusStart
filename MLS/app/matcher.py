from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def rank_users(idea_text, users):
    texts = [idea_text] + [u.text for u in users]

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform(texts)

    raw_scores = cosine_similarity(vectors[0:1], vectors[1:])[0]

    # ✅ normalize to 0–1 range
    max_score = max(raw_scores) if max(raw_scores) > 0 else 1
    scores = raw_scores / max_score

    results = []
    for i, user in enumerate(users):
        results.append({
            "userId": user.userId,
            "score": float(scores[i])
        })

    return sorted(results, key=lambda x: x["score"], reverse=True)
