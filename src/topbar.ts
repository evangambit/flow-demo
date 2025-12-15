import { Flow } from "./primitives/flow.js";
import { CollectionBaseItem } from "./base-ui/base-collection.js";
import { HorizontalStackView } from "./nav.js";

export interface TopbarItem extends CollectionBaseItem {
  element: HTMLElement;
}

export class TopBar extends HorizontalStackView<TopbarItem> {
  constructor(items: Flow<Array<TopbarItem>>) {
    super(items, (item: TopbarItem) => {
      return item.element;
    });
    this.content.style.justifyContent = "space-around";
    this.content.style.alignItems = "center";
    this.content.style.backgroundColor = "#f0f0f0";
    this.content.style.borderBottom = "1px solid #ccc";
  }
}
customElements.define("top-bar", TopBar);
