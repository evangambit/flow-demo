import { Flow } from "./primitives/flow.js";
import { BaseCollectionView, CollectionBaseItem } from "./base-ui/base-collection.js";

export class HorizontalStackView<T extends CollectionBaseItem> extends BaseCollectionView<T> {
  constructor(items: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super(items, item2view);
    this.style.display = "flex";
    this.style.flexDirection = "row";
  }
  protected _update(stack: Array<T>, item2view: (item: T) => HTMLElement) {
    // Trivial implementation for demo purposes.
    this.innerHTML = "";
    for (const item of stack) {
      const view = item2view(item);
      this.appendChild(view);
    }
  }
}
customElements.define("horizontal-stack", HorizontalStackView);