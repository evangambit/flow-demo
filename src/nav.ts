import { Flow } from "./primitives/flow.js";
import { BaseCollectionView } from "./base-ui/base_collection.js";

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
export class StackNavigationView<T extends CollectionBaseItem>  extends BaseCollectionView<T> {
  _topbar: HTMLElement;
  _contentElement: HTMLElement;
  _viewCache: Map<string, HTMLElement>;

  constructor(stack: Flow<Array<T>>, topbar: HTMLElement, item2view: (item: T) => HTMLElement) {
    super(stack, item2view);
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
    this._viewCache = new Map<string, HTMLElement>();
  }
  protected _update(stack: Array<T>, item2view: (item: T) => HTMLElement) {
    const newIds = stack.map((item) => item.collectionItemId);

    // Create new views
    for (const item of stack) {
      if (!this._viewCache.has(item.collectionItemId)) {
        const view = item2view(item);
        view.setAttribute("data-navigation-item-id", item.collectionItemId);
        this._viewCache.set(item.collectionItemId, view);
      }
    }
    // Remove old views
    for (const [id, view] of this._viewCache.entries()) {
      if (!newIds.includes(id)) {
        this._viewCache.delete(id);
      }
    }

    const currentlyShowingView = this._contentElement.firstChild as HTMLElement | null;
    const newTopItem = stack.length > 0 ? stack[stack.length - 1] : null;
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