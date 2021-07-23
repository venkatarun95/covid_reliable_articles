from augment_data import augment_data
from download_sheet import download_sheet

import os
import pickle as pkl
from typing import List
from typesense import Client


def upload_articles(values: List[List[str]], client: Client):
    for (i, row) in enumerate(values):
        title = row[0]
        url = row[1]
        description = row[5]

        resp = client.collections['reliable_articles'].documents.search({
            'q':
            '*',
            'filter_by':
            'url: %s' % url,
            'per_page':
            1,
        })
        if resp['found'] > 0:
            continue

        row_doc = {
            'id': str(i),
            'url': url,
            'google_title': title,
            'description': description
        }

        dat = augment_data(url)
        for x in dat:
            row_doc[x] = dat[x]
        print(url)

        client.collections['reliable_articles'].documents.create(row_doc)


if __name__ == "__main__":
    if os.path.isfile('test_downloaded.pkl'):
        with open('test_downloaded.pkl', 'rb') as f:
            values = pkl.load(f)
    else:
        values = download_sheet()
        with open('test_downloaded.pkl', 'wb') as f:
            pkl.dump(values, f)

    client = Client({
        'nodes': [{
            'host':
            'localhost',  # For Typesense Cloud use xxx.a1.typesense.net
            'port': '8108',  # For Typesense Cloud use 443
            'protocol': 'http'  # For Typesense Cloud use https
        }],
        'api_key':
        'xyz',
        'connection_timeout_seconds':
        2
    })

    upload_articles(values, client)
