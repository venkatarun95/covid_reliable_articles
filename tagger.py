import numpy as np
import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from imblearn.ensemble import BalancedBaggingClassifier
from joblib import dump, load

def load_model():
    global vectorizer
    global clf
    tfidf = pickle.load(open("models/tech_tag/tfidf.pkl", 'rb'))
    vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1,2), stop_words = "english", lowercase = True, max_features = 500000, vocabulary = tfidf.vocabulary_)
    clf = load('models/tech_tag/bbc.joblib') 
    
    
def predict_tag(text):
    if type([]) != type(text):
        text = [text]
    features_test_transformed  = vectorizer.fit_transform(text)
    preds = clf.predict(features_test_transformed)
    return preds