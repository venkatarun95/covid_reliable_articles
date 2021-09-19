/* global algoliasearch instantsearch */

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "",
    nodes: [
      {
        host: "",
        port: "443",
        protocol: "https"
      }
    ]
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
      queryBy: "title,google_title,source,text",
      queryByWeights: "5,5,5,1",
  }
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const customSearchClient = {
    ...searchClient,
    search(requests) {
	for (let i in requests) {
	    console.log(requests[i]);
	    if (requests[i].params.query == "") {
		if (requests[i].params.facetFilters == undefined) {
		    requests[i].params.facetFilters = []
		}
		requests[i].params.facetFilters.push(["source:Scientific American", "source:National Geographic", "source:Dear Pandemic", "source:Unbiased Science Podcast", "source:Your Local Epidemiologist", "source:Nature", "source:Science", "source:Technology Review", "source:Hood Medicine"]);
	    }
	}
	console.log(requests)
	return searchClient.search(requests)
    },
};

const search = instantsearch({
    searchClient: customSearchClient,
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

function renderHitItem(hit) {
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
<div class="card" style="width: 18rem;">
  <a href=${hit.url}>
    <span class="position-absolute top-0 start-0 badge rounded-pill bg-secondary">${hit.source}</span>
    <img src="${hit.top_image}" class="card-img-top" alt="..." onerror="this.style.display='none'" onload="if (this.naturalWidth < 50 || this.naturalHeight < 50) { this.style.display='none'; }">
  </a>
  <div class="card-body">
    <a href=${hit.url}>
      <h5 class="card-title">${instantsearch.snippet({ attribute: 'title', hit })}</h5>
    </a>
    <p class="card-text">${display_text}</p>
    <!--<span class="badge rounded-pill bg-light text-dark">${url_to_source(hit.url)}</span>-->
    <span class="badge rounded-pill bg-light text-dark" style="float: left">${ts_to_date(hit.date)}</span>
  </div>
</div>`;
}

const renderHits = (renderOptions, isFirstRender) => {
  const { hits } = renderOptions;

  document.querySelector('#hits').innerHTML = `
      ${hits
        .map(
          item => renderHitItem(item),
        )
        .join('')}
  `;
};

const customHits = instantsearch.connectors.connectHits(renderHits);

search.addWidgets([
    instantsearch.widgets.searchBox({
	container: '#searchbox',
	autofocus: true
    }),
    // instantsearch.widgets.hits({
    // 	container: '#hits',
    // 	cssClasses: {
    // 	    item: 'something',
    // 	},
    // 	templates: {
    // 	},
    // }),
    customHits(),
    instantsearch.widgets.pagination({
	container: '#pagination',
    }),
]);

const renderToggleRefinement = (renderOptions, isFirstRender) => {
    const { value, refine, widgetParams } = renderOptions;

    if (isFirstRender) {
	const label = document.createElement('label');
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.setAttribute('class', 'form-check-input');
	input.setAttribute('id', 'toggle_technical_check');
	const text = document.createElement('label');
	text.setAttribute('class', 'form-check-label');
	text.setAttribute('for', 'toggle_technical_check');
	text.appendChild(document.createTextNode('Scholarly articles'));

	const span = document.createElement('span');

	input.addEventListener('change', event => {
	    refine({ isRefined: !event.target.checked });
	});

	label.appendChild(input);
	//label.appendChild(document.createTextNode('Include technical articles'));
	label.appendChild(text);
	text.appendChild(span);

	widgetParams.container.appendChild(label);
    }

    widgetParams.container.querySelector('input').checked = value.isRefined;
    // widgetParams.container.querySelector('span').innerHTML =
    // 	value.count !== null ? ` (${value.count})` : '';
};

const customToggleRefinement = instantsearch.connectors.connectToggleRefinement(
  renderToggleRefinement
);

search.addWidgets([
    customToggleRefinement({
	container: document.querySelector('#toggle_technical'),
	attribute: 'technical',
	on: true,
	off: false,
    })
]);


search.start();
