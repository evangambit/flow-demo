import { StateFlow, Flow, Consumer, Context } from "./primitives/flow.js";
import { BaseCollectionView, CollectionBaseItem } from "./base-ui/base-collection.js";
import { HorizontalStackView } from "./nav.js";

export interface TopbarItem extends CollectionBaseItem {
  element: HTMLElement;
}

export interface TopBarItem_SimpleButton extends TopbarItem {
  label: string;
  onClick: () => void;
}

export interface TopBarItem_Title extends TopbarItem {
  title: string;
}

export class TopBar extends HorizontalStackView<TopbarItem> {
  constructor(items: Flow<Array<TopbarItem>>) {
    super(items, (item: TopbarItem) => {
      return item.element;
    });
    this.style.justifyContent = "space-around";
    this.style.alignItems = "center";
    this.style.height = "50px";
    this.style.backgroundColor = "#f0f0f0";
    this.style.borderBottom = "1px solid #ccc";
  }
}
customElements.define("top-bar", TopBar);
