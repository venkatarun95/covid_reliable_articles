/* global algoliasearch instantsearch */

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'of6UKGWwOb5xzOLACj8u6WrKAOTgmE4Z',
    nodes: [
      {
        host: 'typesense.pandemic19.info',
        port: '443',
        protocol: 'https',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: 'title,google_title,source,text',
    queryByWeights: '5,5,5,1',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const customSearchClient = {
<<<<<<< HEAD
    ...searchClient,
    search(requests) {
	for (let i in requests) {
	    if (requests[i].params.query == "") {
		if (requests[i].params.facetFilters == undefined) {
		    requests[i].params.facetFilters = []
		}
		let news_feed_sources = [
		    "source:Scientific American",
		    "source:National Geographic",
		    "source:Dear Pandemic",
		    "source:Unbiased Science Podcast",
		    "source:Your Local Epidemiologist",
		    "source:Science",
		    "source:Technology Review",
		    "source:Hood Medicine",
		    "source:Nature"];
		if (document.getElementById('toggle-scholarly').querySelector("input") != null &&
		    document.getElementById('toggle-scholarly').querySelector("input").checked) {
		    news_feed_sources.push("source:JAMA");
		    news_feed_sources.push("source:New England Journal of medicine");
		    news_feed_sources.push("source:BMJ");
		    news_feed_sources.push("source:Hopkins Medicine");
		    news_feed_sources.push("source:UC San Francisco");
		}
		requests[i].params.facetFilters.push(news_feed_sources);
	    }
	}
	return searchClient.search(requests)
    },
};

const search = instantsearch({
    searchClient: customSearchClient,
    indexName: "reliable_articles",
    routing: true
=======
  ...searchClient,
  search(requests) {
    for (const i in requests) {
      if (requests[i].params.query == '') {
        if (requests[i].params.facetFilters == undefined) {
          requests[i].params.facetFilters = [];
        }
        requests[i].params.facetFilters.push([
          'source:Scientific American',
          'source:National Geographic',
          'source:Dear Pandemic',
          'source:Unbiased Science Podcast',
          'source:Your Local Epidemiologist',
          'source:Nature',
          'source:Science',
          'source:Technology Review',
          'source:Hood Medicine',
        ]);
      }
      if (!document.getElementById('scholarly').checked) {
        if (requests[i].params.facetFilters == undefined) {
          requests[i].params.facetFilters = [];
        }
        requests[i].params.facetFilters.push('technical:false');
      }
    }
    console.log(requests);
    return searchClient.search(requests);
  },
};

const search = instantsearch({
  searchClient: customSearchClient,
  indexName: 'reliable_articles',
>>>>>>> 7bb5fefcf825f8914ebbbcbb7e66f77e5449c077
});

function url_to_source(url) {
  const parsed = new URL(url);
  const sources = [
    ['thelancet', 'The Lancet'],
    ['nejm', 'New England Journal of medicine'],
    ['jamanetwork', 'JAMA'],
    ['scientificamerican', 'Scientific American'],
    ['cdc.gov', 'CDC USA'],
    ['nature', 'Nature'],
    ['sciencemag', 'Science'],
    ['pfizer', 'Pfizer'],
    ['modernatx', 'Moderna'],
    ['yourlocalepidemiologist', 'Your Local Epidemiologist'],
    ['jnj', 'JnJ'],
    ['astrazeneca', 'Astra Zeneca'],
    ['bmj', 'BMJ'],
    ['echnologyreview', 'Technology Review'],
    ['globalhealth.stanford', 'Stanford Univ.'],
    ['iisc', 'Indian Institute of Science'],
    ['caltech', 'CalTech'],
    ['hopkinsmedicine', 'Hopkins Medicine'],
    ['ucsf', 'UC San Francisco'],
    ['unbiasedscipod', 'Unbiased Science Podcast'],
    ['hoodmedicine', 'Hood Medicine'],
    ['princeton', 'Princeton Univ.'],
    ['theconversation', 'The Conversation'],
    ['dearpandemic', 'Dear Pandemic'],
    ['firstdraft', 'First Draft News'],
    ['who.int', 'WHO'],
    ['nih.gov', 'NIH USA'],
    ['nationalgeographic', 'National Geographic'],
  ];
  for (const i in sources) {
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
    const remove = hit.description.indexOf('ago ...');
    if (remove != -1) {
      display_text = hit.description.substring(remove + 7);
    } else {
      display_text = hit.description;
    }
  } else {
    display_text = snippet;
  }

  return `
<<<<<<< HEAD
  <div class="card col-md-3">
    <a href=${hit.url}>
      <span class="position-absolute top-0 start-0 badge rounded-pill bg-secondary">${hit.source}</span>
      <img src="${hit.top_image}" class="card-img-top" alt="..." onerror="this.style.display='none'" onload="if (this.naturalWidth < 50 || this.naturalHeight < 50) { this.style.display='none'; }">
    </a>
    <div class="card-body">
      <a href=${hit.url}>
        <h5 class="card-title">${instantsearch.snippet({ attribute: 'title', hit })}        
          <div class="content_img">
            <img class = "pic" src="https://cdn.codechef.com/misc/tick-icon.gif" width='100%' height='100%'>
              <div>
                  <img src="https://cdn.codechef.com/misc/tick-icon.gif">
              </div>
          </div>
        </h5>
      </a>
      <p class="card-text">${display_text}</p>
      <!--<span class="badge rounded-pill bg-light text-dark">${url_to_source(hit.url)}</span>-->
      <!--<span class="badge rounded-pill bg-light text-dark" style="float: left">${ts_to_date(hit.date)}</span>-->
    </div>
  </div>`;
=======
<div class="card" style="width: 18rem;">
  <a href=${hit.url}>
    <span class="position-absolute top-0 start-0 badge rounded-pill bg-secondary">${
      hit.source
    }</span>
    <img src="${
      hit.top_image
    }" class="card-img-top" alt="..." onerror="this.style.display='none'" onload="if (this.naturalWidth < 50 || this.naturalHeight < 50) { this.style.display='none'; }">
  </a>
  <div class="card-body">
  <div class="card-title">
    <a href=${hit.url}>
      <h5 >${instantsearch.snippet({
        attribute: 'title',
        hit,
      })}
      </a>
      <div class="content_img">
      <img class = "pic" src="https://cdn.codechef.com/misc/tick-icon.gif" width='100%' height='100%'>
      <div>
          <img src="https://cdn.codechef.com/misc/tick-icon.gif">
      </div>
      </div>
      </h5>
</div>



    <p class="card-text">${display_text}</p>
    <!--<span class="badge rounded-pill bg-light text-dark">${url_to_source(
      hit.url
    )}</span>-->
    <span class="badge rounded-pill bg-light text-dark" style="float: left">${ts_to_date(
      hit.date
    )}</span>
  </div>
</div>`;
>>>>>>> 7bb5fefcf825f8914ebbbcbb7e66f77e5449c077
}
let lastRenderArgs;
const renderHits = (renderArgs, isFirstRender) => {
  const { hits, showMore, widgetParams } = renderArgs;

  lastRenderArgs = renderArgs;

  if (isFirstRender) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !lastRenderArgs.isLastPage) {
          showMore();
        }
      });
    });

    const sentinel = document.getElementById('hits_sentinel');
    observer.observe(sentinel);

    sentinel.addEventListener('click', showMore);
  }

<<<<<<< HEAD
    let renderedHTML = "";
    let num_rendered = 0;
    for (let i in hits) {
	const rendered = renderHitItem(hits[i]);
	renderedHTML += rendered;
	if (rendered != "") {
	    num_rendered += 1;
	}
    }
    document.querySelector('#hits').innerHTML = renderedHTML;

    // When query string is "", we need multiple reloads to ensure at-least one
    // non-boring article is loaded (i.e. is not rejected by
    // renderHitItem). Since, if no new articles are shown, the sentinel never
    // moves out of view, it is useful to handle this case separately
    if (document.getElementsByClassName("ais-SearchBox-input")[0].value == "" && num_rendered < 10) {
	showMore();
   }
=======
  document.querySelector('#hits').innerHTML = `
      ${hits.map(item => renderHitItem(item)).join('')}
    `;
>>>>>>> 7bb5fefcf825f8914ebbbcbb7e66f77e5449c077
};


const customHits = instantsearch.connectors.connectInfiniteHits(renderHits);

const searchBoxWidget = instantsearch.widgets.searchBox({
  container: '#searchbox',
  autofocus: true,
});

<<<<<<< HEAD
const scholarlyRenderRefinement = (renderOptions, isFirstRender) => {
    const { value, refine, widgetParams } = renderOptions;

    if (isFirstRender) {
	const label = document.createElement('label');
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.setAttribute('class', 'form-check-input');

	input.addEventListener('change', event => {
	    refine({ isRefined: event.target.checked });
	});

	label.appendChild(input);
	label.appendChild(document.createTextNode('Include scholarly articles'));

	widgetParams.container.appendChild(label);
	refine({isRefined: false});
    }
    else {
	widgetParams.container.querySelector('input').checked = !value.isRefined;
    }
};

const scholarlyRefinement = instantsearch.connectors.connectToggleRefinement(
    scholarlyRenderRefinement
);

search.addWidgets([
    searchBoxWidget,
    customHits(),
    scholarlyRefinement({
	container: document.getElementById('toggle-scholarly'),
	attribute: 'technical',
	on: false,
    })
]);

=======
search.addWidgets([searchBoxWidget, customHits()]);

document
  .getElementById('scholarly')
  .addEventListener('click', search.scheduleSearch);

>>>>>>> 7bb5fefcf825f8914ebbbcbb7e66f77e5449c077
search.start();
console.log(search);
