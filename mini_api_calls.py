from client_info import admin_client, search_client

import sys
import typesense

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "num_entries":
        resp = search_client.collections['reliable_articles'].documents.search(
            {
                'q': '*',
                'per_page': 0,
            })
        print(resp['found'])
    elif cmd == "delete":
        resp = admin_client.collections['reliable_articles'].delete()
        print(resp)
    else:
        print(f"Unrecognized command '{cmd}'")
