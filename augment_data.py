from dateutil import parser
from htmldate import find_date
import json
from newspaper import Article
from typing import Dict
from typesense import Client


def augment_data(url: str, google_date) -> Dict[str, str]:
    res = {}

    try:
        article = Article(url)
        article.download()
        article.parse()
    except Exception as e:
        print(e)
        return {'text': '', 'date': 0}
    res['html'] = article.html
    res['text'] = article.text
    res['title'] = article.title
    res['top_image'] = article.top_image
    if google_date == '':
        date = find_date(article.html)
        if date is None:
            date_unix = 0
        else:
            date_unix = int(parser.parse(date).timestamp())
        res['date'] = date_unix
    else:
        try:
            res['date'] = int(parser.parse(google_date).timestamp())
        except:
            res['date'] = 0

    # article.nlp()
    # res['summary'] = article.summary

    return res


if __name__ == "__main__":
    print(augment_data('https://www.thelancet.com/pdfs/journals/landia/PIIS2213-8587(21)00059-0.pdf', '')['date'])
    print(
        augment_data(
            'https://www.cdc.gov/coronavirus/2019-ncov/communication/videos.html', ''
        ))
    print(augment_data('https://www.nature.com/articles/d41586-021-01284-5', ''))
