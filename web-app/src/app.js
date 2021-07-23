/* global algoliasearch instantsearch */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "8T5TAAbOxup2P3FOvbDPAd77o2yOf8AI",
    nodes: [
      {
        host: "v5mj1c7etlufikayp-1.a1.typesense.net",
        port: "443",
        protocol: "https"
      }
    ]
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: "title,google_title,text"
  }
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
  searchClient,
  indexName: "reliable_articles"
});

search.addWidgets([
    instantsearch.widgets.searchBox({
	container: '#searchbox',
    }),
    instantsearch.widgets.hits({
	container: '#hits',
	templates: {
            item: `
          <div>
            <img src="" align="left" alt="" />
            <div class="hit-name">
              {{#helpers.highlight}}{ "attribute": "google_title" }{{/helpers.highlight}}
            </div>
            <div class="hit-description">
              {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
            </div>
            <img height=75 width=225 src="{{#helpers.highlight}}{ "attribute": "top_image" }{{/helpers.highlight}}" />
          </div>
        `,
	},
    }),
    instantsearch.widgets.pagination({
	container: '#pagination',
    }),
]);

search.start();
