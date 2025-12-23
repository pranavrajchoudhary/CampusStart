from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def rank_users(idea, users):
    texts = [idea] + [u["text"] for u in users]
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(texts)

    scores = cosine_similarity(vectors[0:1], vectors[1:])[0]

    return [
        {
            "userId": users[i]["userId"],
            "score": float(scores[i])
        }
        for i in range(len(users))
    ]
