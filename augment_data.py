from dateutil import parser
from htmldate import find_date
import json
from newspaper import Article
from typing import Dict
from typesense import Client
from urllib.parse import urlparse
import requests
import beautifulsoup4
from bs4 import BeautifulSoup

def fact_check_boom_live(url):
    article = requests.get(url)
    content = BeautifulSoup(article.content, features="lxml")
    fact_check_instance = content.find("meta", {"content": "Fact Check"})
    return fact_check_instance

def fact_check_logically(url):

    article = requests.get(url)
    content = BeautifulSoup(article.content, features="lxml")
    divTag = content.find_all("div", {"class": "grid-item-6"})
    fact_check_instance = False
    fact_check_instance_value = ""
    for tag in divTag:
        if len(tag.find_all(class_='fc-verdict fc-verdict-false wider')) > 0:
            fact_check_instance = True
            fact_check_instance_value = "False"
        elif len(tag.find_all(class_='fc-verdict fc-verdict-misleading wider')) > 0:
            fact_check_instance = True
            fact_check_instance_value = "Misleading"
        elif len(tag.find_all(class_='fc-verdict fc-verdict-true wider')) > 0:
            fact_check_instance = True
            fact_check_instance_value = "True"

    return fact_check_instance, fact_check_instance_value


def augment_data(url: str, google_date, publisher) -> Dict[str, str]:
    res = {}

    try:
        article = Article(url)
        article.download()
        article.parse()
    except Exception as e:
        print(e)
        return {'text': '', 'date': 0}

    ## Fact checking for boom live
    if publisher == "Boom Live":
        is_fact_check = fact_check_boom_live(url)
    elif publisher == "Logically":
        is_fact_check, fact_check_value = fact_check_logically(url)

    if is_fact_check:

        res['html'] = article.html
        res['text'] = article.text
        res['title'] = article.title
        res['top_image'] = article.top_image
        res['source'] = url_to_source(url)
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


def url_to_source(url):
    ''' Return a descriptive string of where the URL is sourced from '''
    sources = [
    	["thelancet", "The Lancet"],
    	["nejm", "New England Journal of medicine"],
    	["jamanetwork", "JAMA"],
    	["scientificamerican", "Scientific American"],
    	["cdc.gov", "CDC USA"],
    	["nature", "Nature"],
    	["sciencemag", "Science"],
    	["pfizer", "Pfizer"],
    	["modernatx", "Moderna"],
    	["yourlocalepidemiologist", "Your Local Epidemiologist"],
    	["jnj", "JnJ"],
    	["astrazeneca", "Astra Zeneca"],
    	["bmj", "BMJ"],
    	["technologyreview", "Technology Review"],
    	["globalhealth.stanford", "Stanford Univ."],
    	["iisc", "Indian Institute of Science"],
    	["caltech", "CalTech"],
    	["hopkinsmedicine", "Hopkins Medicine"],
    	["ucsf", "UC San Francisco"],
    	["unbiasedscipod", "Unbiased Science Podcast"],
    	["hoodmedicine", "Hood Medicine"],
    	["princeton", "Princeton Univ."],
    	["theconversation", "The Conversation"],
    	["dearpandemic", "Dear Pandemic"],
    	["firstdraft", "First Draft News"],
    	["who.int", "WHO"],
    	["nih.gov", "NIH USA"],
    	["nationalgeographic", "National Geographic"]
    ];
    host = urlparse(url).hostname
    for s in sources:
        if host.find(s[0]) != -1:
            return s[1]
    return ""
    

if __name__ == "__main__":
    print(augment_data('https://www.thelancet.com/pdfs/journals/landia/PIIS2213-8587(21)00059-0.pdf', '')['date'])
    print(
        augment_data(
            'https://www.cdc.gov/coronavirus/2019-ncov/communication/videos.html', ''
        ))
    print(augment_data('https://www.nature.com/articles/d41586-021-01284-5', ''))
