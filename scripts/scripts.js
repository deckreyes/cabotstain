/* eslint-disable */
import {
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme,
  getMetadata,
  getAllMetadata,
  loadBlock,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  sampleRUM,
  waitForLCP,
} from './aem.js';

// import {
//   analyticsTrack404,
//   analyticsTrackConversion,
//   analyticsTrackCWV,
//   analyticsTrackError,
//   initAnalyticsTrackingQueue,
//   setupAnalyticsTrackingWithAlloy,
// } from './analytics/lib-analytics.js';

const LCP_BLOCKS = [
  'product-list-page',
  'product-details',
  'commerce-cart',
  'commerce-checkout',
  'commerce-account',
  'commerce-login',
]; // add your LCP blocks to the list


window.hlx.RUM_GENERATION = 'experiment-001'; // add your RUM generation information here

// Define the custom audiences mapping for experience decisioning
const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  'new-visitor': () => !localStorage.getItem('franklin-visitor-returning'),
  'returning-visitor': () => !!localStorage.getItem('franklin-visitor-returning'),
};

window.hlx.plugins.add('rum-conversion', {
  url: '/plugins/rum-conversion/src/index.js',
  load: 'lazy',
});

window.hlx.plugins.add('experimentation', {
  condition: () => getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length,
  options: { audiences: AUDIENCES },
  load: 'eager',
  url: '/plugins/experimentation/src/index.js',
});

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

const tabElementMap = {};

function calculateTabSectionCoordinate(main, lastTabBeginningIndex, targetTabSourceSection) {
  if (!tabElementMap[lastTabBeginningIndex]) {
    tabElementMap[lastTabBeginningIndex] = [];
  }
  tabElementMap[lastTabBeginningIndex].push(targetTabSourceSection);
}

function calculateTabSectionCoordinates(main) {
  let lastTabIndex = -1;
  let foldedTabsCounter = 0;
  const mainSections = [...main.childNodes];
  main
    .querySelectorAll('div.section[data-tab-title]')
    .forEach((section) => {
      const currentSectionIndex = mainSections.indexOf(section);

      if (lastTabIndex < 0 || (currentSectionIndex - foldedTabsCounter) !== lastTabIndex) {
        // we construct a new tabs component, at the currentSectionIndex
        lastTabIndex = currentSectionIndex;
        foldedTabsCounter = 0;
      }

      foldedTabsCounter += 2;
      calculateTabSectionCoordinate(main, lastTabIndex, section);
    });
}

async function autoBlockTabComponent(main, targetIndex, tabSections) {
  // the display none will prevent a major CLS penalty.
  // franklin will remove this once the blocks are loaded.
  const section = document.createElement('div');
  section.setAttribute('class', 'section');
  section.setAttribute('style', 'display:none');
  section.dataset.sectionStatus = 'loading';
  const tabsBlock = document.createElement('div');
  tabsBlock.setAttribute('class', 'tabs');

  const tabContentsWrapper = document.createElement('div');
  tabContentsWrapper.setAttribute('class', 'contents-wrapper');

  tabsBlock.appendChild(tabContentsWrapper);

  tabSections.forEach((tabSection) => {
    tabSection.classList.remove('section');
    tabSection.classList.add('contents');
    // remove display: none
    tabContentsWrapper.appendChild(tabSection);
    tabSection.style.display = null;
  });
  main.insertBefore(section, main.childNodes[targetIndex]);
  section.append(tabsBlock);
  decorateBlock(tabsBlock);
  await loadBlock(tabsBlock);
  // unset display none manually.
  // somehow in some race conditions it won't be picked up by lib-franklin.
  // CLS is not affected
  section.style.display = null;
}

function aggregateTabSectionsIntoComponents(main) {
  calculateTabSectionCoordinates(main);

  // when we aggregate tab sections into a tab autoblock, the index get's lower.
  // say we have 3 tabs starting at index 10, 12 and 14. and then 3 tabs at 18, 20 and 22.
  // when we fold the first 3 into 1, those will start at index 10. But the other 3 should now
  // start at 6 instead of 18 because 'removed' 2 sections.
  let sectionIndexDelta = 0;
  Object.keys(tabElementMap).map(async (tabComponentIndex) => {
    const tabSections = tabElementMap[tabComponentIndex];
    await autoBlockTabComponent(main, tabComponentIndex - sectionIndexDelta, tabSections);
    sectionIndexDelta = tabSections.length - 1;
  });
}


/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * to add/remove a template, just add/remove it in the list below
 */
const TEMPLATE_LIST = [
  'adventures',
];

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateTemplates(main) {
  try {
    const template = getMetadata('template');
    const templates = TEMPLATE_LIST;
    if (templates.includes(template)) {
      const mod = await import(`../templates/${template}/${template}.js`);
      loadCSS(`${window.hlx.codeBasePath}/templates/${template}/${template}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}


/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  await window.hlx.plugins.run('loadEager');

  window.adobeDataLayer = window.adobeDataLayer || [];

  let pageType = 'CMS';
  if (document.body.querySelector('main .product-details')) {
    pageType = 'Product';
  } else if (document.body.querySelector('main .product-list-page')) {
    pageType = 'Category';
  } else if (document.body.querySelector('main .commerce-cart')) {
    pageType = 'Cart';
  } else if (document.body.querySelector('main .commerce-checkout')) {
    pageType = 'Checkout';
  }
  window.adobeDataLayer.push({
    pageContext: {
      pageType,
      pageName: document.title,
      eventType: 'visibilityHidden',
      maxXOffset: 0,
      maxYOffset: 0,
      minXOffset: 0,
      minYOffset: 0,
    },
  });

  const main = doc.querySelector('main');
  if (main) {
    decorateTemplates(main);
    decorateMain(main);
    aggregateTabSectionsIntoComponents(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  // Mark customer as having viewed the page once
  localStorage.setItem('franklin-visitor-returning', true);
  window.hlx.plugins.run('loadLazy');
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
    return import('./delayed.js');
  }, 3000);
  // load anything that can be postponed to the latest here
}

export async function fetchIndex(indexFile, pageSize = 500) {
  const handleIndex = async (offset) => {
    const resp = await fetch(`/${indexFile}.json?limit=${pageSize}&offset=${offset}`);
    const json = await resp.json();

    const newIndex = {
      complete: (json.limit + json.offset) === json.total,
      offset: json.offset + pageSize,
      promise: null,
      data: [...window.index[indexFile].data, ...json.data],
    };

    return newIndex;
  };

  window.index = window.index || {};
  window.index[indexFile] = window.index[indexFile] || {
    data: [],
    offset: 0,
    complete: false,
    promise: null,
  };

  // Return index if already loaded
  if (window.index[indexFile].complete) {
    return window.index[indexFile];
  }

  // Return promise if index is currently loading
  if (window.index[indexFile].promise) {
    return window.index[indexFile].promise;
  }

  window.index[indexFile].promise = handleIndex(window.index[indexFile].offset);
  const newIndex = await (window.index[indexFile].promise);
  window.index[indexFile] = newIndex;

  return newIndex;
}

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export function addElement(type, attributes, values = {}) {
  const element = document.createElement(type);

  Object.keys(attributes).forEach((attribute) => {
    element.setAttribute(attribute, attributes[attribute]);
  });

  Object.keys(values).forEach((val) => {
    element[val] = values[val];
  });

  return element;
}

export async function getAEMHeadlessClient(url) {
  const aemHeadlessClient = new AdobeAemHeadlessClientJs({
    serviceURL: url,
  });
  return aemHeadlessClient;
}

export function jsx(html, ...args) {
  return html.slice(1).reduce((str, elem, i) => str + args[i] + elem, html[0]);
}

export function createAccordion(header, content, expanded = false) {
  // Create a container for the accordion
  const container = document.createElement('div');
  container.classList.add('accordion');
  const accordionContainer = document.createElement('details');
  accordionContainer.classList.add('accordion-item');

  // Create the accordion header
  const accordionHeader = document.createElement('summary');
  accordionHeader.classList.add('accordion-item-label');
  accordionHeader.innerHTML = `<div>${header}</div>`;

  // Create the accordion content
  const accordionContent = document.createElement('div');
  accordionContent.classList.add('accordion-item-body');
  accordionContent.innerHTML = content;

  accordionContainer.append(accordionHeader, accordionContent);
  container.append(accordionContainer);


  if (expanded) {
    accordionContent.classList.toggle('active');
    accordionHeader.classList.add('open-default');
    accordionContainer.setAttribute('open', true);
  }

  function updateContent(newContent) {
    accordionContent.innerHTML = newContent;
    // accordionContent.innerHTML = '<p>Hello world</p>';
  }

  return [container, updateContent];
}

export function generateListHTML(data) {
  let html = '<ul>';
  data.forEach(item => {
      html += `<li>${item.label}: <span>${item.value}</span></li>`;
  });
  html += '</ul>';
  return html;
}

async function loadPage() {
  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  // const setupAnalytics = setupAnalyticsTrackingWithAlloy(document);
  loadDelayed();
  // await setupAnalytics;
}

// Declare conversionEvent, bufferTimeoutId and tempConversionEvent,
// outside the convert function to persist them for buffering between
// subsequent convert calls
const CONVERSION_EVENT_TIMEOUT_MS = 100;
let bufferTimeoutId;
let conversionEvent;
let tempConversionEvent;
sampleRUM.always.on('convert', (data) => {
  const { element } = data;
  // eslint-disable-next-line no-undef
  if (!element || !alloy) {
    return;
  }

  if (element.tagName === 'FORM') {
    conversionEvent = {
      ...data,
      event: 'Form Complete',
    };

    if (conversionEvent.event === 'Form Complete'
      // Check for undefined, since target can contain value 0 as well, which is falsy
      && (data.target === undefined || data.source === undefined)
    ) {
      // If a buffer has already been set and tempConversionEvent exists,
      // merge the two conversionEvent objects to send to alloy
      if (bufferTimeoutId && tempConversionEvent) {
        conversionEvent = { ...tempConversionEvent, ...conversionEvent };
      } else {
        // Temporarily hold the conversionEvent object until the timeout is complete
        tempConversionEvent = { ...conversionEvent };

        // If there is partial form conversion data,
        // set the timeout buffer to wait for additional data
        bufferTimeoutId = setTimeout(async () => {
          analyticsTrackConversion({ ...conversionEvent });
          tempConversionEvent = undefined;
          conversionEvent = undefined;
        }, CONVERSION_EVENT_TIMEOUT_MS);
      }
    }
    return;
  }

  analyticsTrackConversion({ ...data });
  tempConversionEvent = undefined;
  conversionEvent = undefined;
});

loadPage();