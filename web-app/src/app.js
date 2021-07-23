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

function url_to_source(url) {
    const parsed = new URL(url);
    const sources = [
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
    	["echnologyreview", "Technology Review"],
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
    for (let i in sources) {
    	if (parsed.host.indexOf(sources[i][0]) != -1) {
    	    return sources[i][1];
    	}
    }
    return parsed.host;
}

function ts_to_date(ts) {
    const date = new Date(ts * 1000);
    return date.toDateString();
}

search.addWidgets([
    instantsearch.widgets.searchBox({
	container: '#searchbox',
    }),
    instantsearch.widgets.hits({
	container: '#hits',
	templates: {
	    item(hit) {
		// See how long the snippet is
		const snippet = instantsearch.snippet({ attribute: 'text', hit });
		let display_text;
		if (snippet.length > 200) {
		    // Sometimes description has "2 days ago...", remove it
		    const remove = hit.description.indexOf("ago ...");
		    if (remove != -1) {
			display_text = hit.description.substring(remove + 7);
		    }
		    else {
			display_text = hit.description
		    }
		}
		else {
		    display_text = snippet
		}

		return `
<a href=${hit.url}><b>
  <div><b>
      ${instantsearch.snippet({ attribute: 'title', hit })}
    </b></div>
<img src="${hit.top_image}" alt=" " class="img-fluid img-thumbnail"/>
</a>
<div>${display_text}</div>
<div>
  <span class="badge rounded-pill bg-light text-dark">${url_to_source(hit.url)}</span>
  <span class="badge rounded-pill bg-light text-dark" style="float: right">${ts_to_date(hit.date)}</span>
</div>

                `;
	    }
        //     item: `
        //     <span><script>document.write("Hello")</script></span>
        //   <div>
        //     <img src="" align="left" alt="" />
        //     <div class="hit-name"><b>
        //       <a href={{ url }}>
        //         {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
        //       </a>
        //     </b></div>
        //     <img height=75 width=225 src="{{#helpers.highlight}}{ "attribute": "top_image" }{{/helpers.highlight}}" />
        //     <div class="hit-description">
        //       {{#helpers.snippet}}{ "attribute": "text" }{{/helpers.snippet}}
        //     </div>

        //   <!--<div id="publisher{{id}}"></div>
        //   <script>$('#publisher{{id}}').text("Hello")</script> -->

        //   </div>
        // `,
	},
    }),
    instantsearch.widgets.pagination({
	container: '#pagination',
    }),
]);

search.start();
