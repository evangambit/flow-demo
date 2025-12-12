import { StateFlow, Flow, Consumer, Context } from "./primitives/flow.js";
import { BaseCollectionView, CollectionBaseItem } from "./base-ui/base_collection.js";
import { HorizontalStackView } from "./nav.js";

export enum TopBarItemType {
  SimpleButton = "simple-button",
  Title = "title",
}

export interface TopbarItem extends CollectionBaseItem {
  type: TopBarItemType;
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
      switch (item.type) {
        case TopBarItemType.SimpleButton: {
          const button = document.createElement("button");
          const btnItem = item as TopBarItem_SimpleButton;
          button.innerText = btnItem.collectionItemId;
          button.onclick = btnItem.onClick;
          return button;
        }
        case TopBarItemType.Title: {
          const titleElem = document.createElement("div");
          const titleItem = item as TopBarItem_Title;
          titleElem.innerText = titleItem.title;
          titleElem.style.fontWeight = "bold";
          titleElem.style.fontSize = "18px";
          return titleElem;
        }
        default: {
          const element = document.createElement("div");
          element.innerText = item.collectionItemId;
          return element;
        }
      }
    });
    this.style.justifyContent = "space-around";
    this.style.alignItems = "center";
    this.style.height = "50px";
    this.style.backgroundColor = "#f0f0f0";
    this.style.borderBottom = "1px solid #ccc";
  }
}
customElements.define("top-bar", TopBar);
