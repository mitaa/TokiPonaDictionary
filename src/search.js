/**
 * Handles the visibility of a set of DOM elements
 * according to a search query.
 */
export class ElementSearcher {
  /**
   * Creates an ElementSearcher.
   *
   * @param {iterable} nodes - A bunch of HTMLElement.
   */
  constructor(nodes) {
    this._words = [];
    for (let node of nodes) {
      let word = {
        node: node,
        fragments: this._getTextNodesRecursively(node),
      };
      this._words.push(word);
    }

  }


  /**
   * Performs a search in the text nodes of this._words by
   * showing or hiding the elements and
   * reordering them in this order:
   *    - Exact whole word matches
   *    - Exact substring matches
   *
   * @param {string} query
   * @return {undefined}
   */
  search(query) {
    if (!query) {
      this.showAll();
      return;
    }
    let results_1 = [];
    let results_2 = [];

    for (let word of this._words) {
      this._hideElement(word.node);
    }

    for (let word of this._words) {
      if (word.fragments.has(query)) {
        word.node.classList.add("exact-match");
        results_1.push(word.node);
      } else {
        for (let f of word.fragments) {
          if (f.includes(query)) {
            results_2.push(word.node);
            word.node.classList.remove("exact-match");
            break;
          }
        }
      }
    }

    let addResult = (node) => {
      let container = node.parentNode;
      container.insertBefore(node, container.childNodes[-1]);
      this._showElement(node);
    };

    results_1.map(addResult);
    results_2.map(addResult);
  }

  /**
   * Marks all of the nodes as visible and restores alphabetical order.
   *
   * @return {undefined}
   */
  showAll() {
    for (let word of this._words) {
      let container = word.node.parentNode;
      word.node.classList.remove("exact-match");
      container.insertBefore(word.node, container.childNodes[-1]);
      this._showElement(word.node);
    }
  }

  /**
   * Marks element as visible.
   *
   * @param {HTMLElement} element
   * @return {undefined}
   */
  _showElement(element) {
    element.style.display = 'flex';
  }

  /**
   * Marks element as invisible.
   *
   * @param {HTMLElement} element
   * @return {undefined}
   */
  _hideElement(element) {
    element.style.display = 'none';
  }

  /**
   * Extracts the text node of element if any.
   *
   * @param {HTMLElement} element
   * @return {string} May be an empty string.
   */
  _getTextNode(element) {
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.toLowerCase();
    }

    return '';
  }

  /**
   * Extracts the text node of element and of any of its descendants.
   *
   * @param {HTMLElement} element
   * @param {Set} [textNodes] - Holds the strings of the text nodes already found.
   * @return {Set} Set of strings that the element and its descendants have as text
   * nodes in no particular order.
   */
  _getTextNodesRecursively(element, textNodes = new Set()) {
    let text = this._getTextNode(element);
    text.split(/\W+/).forEach(textNodes.add, textNodes);

    if (element.hasChildNodes()) {
      for (const node of element.childNodes) this._getTextNodesRecursively(node, textNodes)
    }

    return textNodes;
  }
}
