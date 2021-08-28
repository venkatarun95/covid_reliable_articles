from augment_data import augment_data
from download_sheet import download_sheet

import os
import pickle as pkl
import requests
from typing import List
from typesense import Client
import utils
import tagger

tagger.load_model()

def upload_articles(values: List[List[str]], client: Client):
    for (i, row) in enumerate(values):
        title = row[0]
        url = row[1]
        google_date = row[4]
        description = row[5]

        resp = client.collections['reliable_articles'].documents.search({
            'q':
            '*',
            'filter_by':
            'url: %s' % url,
            'per_page':
            0,
        })
        if resp['found'] > 0:
            continue

        row_doc = {
            'id': str(i),
            'url': url,
            'google_title': title,
            'description': description
        }
        
        if utils.url_classifier(url) == "pdf":
            row_doc['title'] = row_doc['google_title']
            row_doc['text'] = utils.get_pdf_text(url)
            if row_doc['text'] is None:
                continue
            if google_date != '':
                res['date'] = int(parser.parse(google_date).timestamp())
            else:
                row_doc['date'] = 0
        else:
            dat = augment_data(url, google_date)
            for x in dat:
                row_doc[x] = dat[x]
        print(url)
        
        row_doc['tech_tag'] = str(tagger.predict_tag(row_doc['text'])[0])

        try:
            client.collections['reliable_articles'].documents.create(row_doc)
        except requests.exceptions.ConnectionError as e:
            print(e)


if __name__ == "__main__":
    import client_info
    client = client_info.admin_client

    # Export all data instead of uploading
    if False:
        s = client.collections['reliable_articles'].documents.search({
            'q':
            '*',
            'per_page':
            10,
        })
        # s = client.collections['reliable_articles'].documents.export()
        print(s)
        exit(0)

    if os.path.isfile('test_downloaded.pkl'):
        with open('test_downloaded.pkl', 'rb') as f:
            values = pkl.load(f)
    else:
        values = download_sheet()
        with open('test_downloaded.pkl', 'wb') as f:
            pkl.dump(values, f)

    upload_articles(values, client)
