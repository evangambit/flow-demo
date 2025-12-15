import { Flow } from "./primitives/flow.js";
import { CollectionBaseItem } from "./base-ui/base-collection.js";
import { DiffableCollectionView } from "./base-ui/diffable-collection.js";

export class HorizontalStackView<T extends CollectionBaseItem> extends DiffableCollectionView<T> {
  constructor(items: Flow<Array<T>>, item2view: (item: T) => HTMLElement) {
    super(items, item2view);
    this.content.style.display = "flex";
    this.content.style.flexDirection = "row";
  }
}
customElements.define("horizontal-stack", HorizontalStackView);