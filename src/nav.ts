import { Flow } from "./primitives/flow.js";
import { BaseCollectionView } from "./base-ui/base_collection.js";
import { DiffableCollection, DiffResults } from "./base-ui/diffable-collection.js";

export interface CollectionBaseItem {
  collectionItemId: string;
}

export interface NavigationCarouselItem<T extends CollectionBaseItem> extends CollectionBaseItem {
  items: Array<T>;
}

export interface NavigationCarouselItem<T extends CollectionBaseItem> extends CollectionBaseItem {
  items: Array<T>;
}

/**
 * A navigation view that displays one view at a time, as well as a top bar.
 */
export class StackNavigationView<T extends CollectionBaseItem>  extends DiffableCollection<T> {
  _topbar: HTMLElement;
  _contentElement: HTMLElement;

  constructor(stack: Flow<Array<T>>, topbar: HTMLElement, item2view: (item: T) => HTMLElement) {
    super(stack, (diff: DiffResults<T>) => {
      this.update(diff, item2view);
    });
    this._topbar = topbar;
    this.style.position = "fixed";
    this.style.top = `${this._topbar.offsetHeight}px`;
    this.style.left = "0";
    this.style.right = "0";
    this.style.bottom = "0";
    this.style.overflow = "auto";
    this.style.display = "flex";
    this.style.flexDirection = "column";
    this.appendChild(this._topbar);

    this._contentElement = document.createElement("div");
    this._contentElement.style.flex = "1";
    this.appendChild(this._contentElement);
  }
  private update(diff: DiffResults<T>, item2view: (item: T) => HTMLElement) {
    this._contentElement.innerHTML = "";
    if (diff.items.length === 0) {
      return;
    }
    this._contentElement.appendChild(item2view(diff.items[diff.items.length - 1]));
  }
}
customElements.define("stack-navigation-view", StackNavigationView);


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