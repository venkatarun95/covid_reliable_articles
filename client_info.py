from typesense import Client

if False:
    admin_client = Client({
        'nodes': [{
            'host':
            'localhost',  # For Typesense Cloud use xxx.a1.typesense.net
            'port': '8108',  # For Typesense Cloud use 443
            'protocol': 'http'  # For Typesense Cloud use https
        }],
        'api_key':
        '8T5TAAbOxup2P3FOvbDPAd77o2yOf8AI',
        'connection_timeout_seconds':
        2
    })
    search_client = admin_client
else:
    admin_client = Client({
        'nodes': [{
            'host': 'v5mj1c7etlufikayp-1.a1.typesense.net',
            'port': '443',
            'protocol': 'https'
        }],
        'api_key':
        'SECRET',
        'connection_timeout_seconds':
        10
    })

    search_client = Client({
        'nodes': [{
            'host': 'v5mj1c7etlufikayp-1.a1.typesense.net',
            'port': '443',
            'protocol': 'https'
        }],
        'api_key':
        '8T5TAAbOxup2P3FOvbDPAd77o2yOf8AI',
        'connection_timeout_seconds':
        10
    })
