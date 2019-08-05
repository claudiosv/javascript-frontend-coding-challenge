export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign(
      { numOfResults: 10, data: (query, numOfResults) => [] },
      options
    );
    Object.assign(this, { rootEl, options });

    this.init();
  }

  onQueryChange(query) {
    // Resolve promise, get data for the dropdown
    this.options.data(query, this.options.numOfResults).then(data => {
      let results = this.getResults(query, data);
      results = results.slice(0, this.options.numOfResults);

      this.updateDropdown(results);
    });
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter(item => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  updateDropdown(results) {
    this.listEl.innerHTML = "";
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach(result => {
      const el = document.createElement("li");
      Object.assign(el, {
        className: "result",
        textContent: result.text
      });

      // Pass the value to the onSelect callback
      el.addEventListener("click", event => {
        this.inputEl.value = result.text;
        this.listEl.innerHTML = "";
        const { onSelect } = this.options;
        if (typeof onSelect === "function") onSelect(result.value);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement("input");
    Object.assign(inputEl, {
      type: "search",
      name: "query",
      autocomplete: "off"
    });

    inputEl.addEventListener("input", event =>
      this.onQueryChange(event.target.value)
    );

    inputEl.addEventListener("keydown", event => {
      switch (event.key) {
        case "Enter":
          this.inputEl.value = this.listEl.children[
            this.selectedIndex
          ].innerText;
          this.listEl.innerHTML = "";
          break;
        case "ArrowUp":
          this.selectedIndex--;
          if (
            this.selectedIndex < 0 ||
            this.selectedIndex > this.listEl.children.length
          ) {
            this.selectedIndex = this.listEl.children.length - 1;
          }
          this.listEl.children[this.selectedIndex].style.backgroundColor =
            "#eee";

          if (this.selectedIndex != this.listEl.children.length - 1)
            this.listEl.children[this.selectedIndex + 1].style.backgroundColor =
              "#fff";
          else this.listEl.children[0].style.backgroundColor = "#fff";

          break;
        case "ArrowDown":
          this.selectedIndex++;
          if (
            this.selectedIndex < 0 ||
            this.selectedIndex > this.listEl.children.length - 1
          ) {
            this.selectedIndex = 0;
          }

          this.listEl.children[this.selectedIndex].style.backgroundColor =
            "#eee";

          if (this.selectedIndex != 0)
            this.listEl.children[this.selectedIndex - 1].style.backgroundColor =
              "#fff";
          else
            this.listEl.children[
              this.listEl.children.length - 1
            ].style.backgroundColor = "#fff";

          break;
      }
      return false;
    });

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl);

    // Build results dropdown
    this.listEl = document.createElement("ul");
    Object.assign(this.listEl, { className: "results" });
    this.rootEl.appendChild(this.listEl);
    this.selectedIndex = -1;
  }
}
