import { StateFlow, Context } from "./flow.js";
import { CollectionBaseItem } from "./base_collection.js";
import { NormalNavigationView } from "./nav.js";
import { TopBar, TopbarItem, TopBarItemType, TopBarItem_SimpleButton, TopBarItem_Title } from "./topbar.js";

enum TopLevelNavigationItemType {
  Inbox = "inbox",
  Conversation = "conversation",
}

interface TopLevelNavigationItemBase extends CollectionBaseItem {
  type: TopLevelNavigationItemType;
}

interface InboxNavigationItem extends TopLevelNavigationItemBase {
  inboxType: string;
}

interface ConversationNavigationItem extends TopLevelNavigationItemBase {
  inboxType: string;
}

function navStackToTopbarItems(
  navStackFlow: StateFlow<Array<TopLevelNavigationItemBase>>,
  navStack: Array<TopLevelNavigationItemBase>
): Array<TopbarItem> {
  if (navStack.length === 0) {
    return [];
  }
  const items: Array<TopbarItem> = [];
  if (navStack.length > 1) {
    items.push({
      collectionItemId: "back-button",
      type: TopBarItemType.SimpleButton,
      label: "Back",
      onClick: () => {
        navStackFlow.value = navStackFlow.value.slice(0, navStackFlow.value.length - 1);
      },
    } as TopBarItem_SimpleButton);
  }
  const currentItem = navStack[navStack.length - 1];

  let title = "";
  switch (currentItem.type) {
    case TopLevelNavigationItemType.Inbox:
      title = `Inbox (${(currentItem as InboxNavigationItem).inboxType})`;
      break;
    case TopLevelNavigationItemType.Conversation:
      title = `Conversation (${(currentItem as ConversationNavigationItem).inboxType})`;
      break;
  }
  items.push({
    collectionItemId: "title",
    type: TopBarItemType.Title,
    title: title,
  } as TopBarItem_Title);

  if (currentItem.type === TopLevelNavigationItemType.Conversation) {
    items.push({
      collectionItemId: "star-button",
      type: TopBarItemType.SimpleButton,
      label: "Star",
      onClick: () => {
        alert("Star clicked");
      },
    } as TopBarItem_SimpleButton);
  }
  
  return items;
}

class InboxView extends HTMLElement {
  constructor(item: InboxNavigationItem, navStack: StateFlow<Array<TopLevelNavigationItemBase>>) {
    super();
    this.innerText = `Inbox View - ${item.collectionItemId}`;
    const button = document.createElement("button");
    button.innerText = "Open Conversation";
    button.onclick = () => {
      const conversationItem: ConversationNavigationItem = {
        collectionItemId: `conversation-${Date.now()}`,
        type: TopLevelNavigationItemType.Conversation,
        inboxType: item.inboxType,
      };
      navStack.value = navStack.value.concat([conversationItem]);
    };
    this.appendChild(button);
  }
}
customElements.define("inbox-view", InboxView);

class ConversationView extends HTMLElement {
  constructor(item: ConversationNavigationItem, navStack: StateFlow<Array<TopLevelNavigationItemBase>>) {
    super();
    this.innerText = `Conversation View - ${item.collectionItemId}`;
    const button = document.createElement("button");
    button.innerText = "Back to Inbox";
    button.onclick = () => {
      navStack.value = navStack.value.filter(navItem => navItem.collectionItemId !== item.collectionItemId);
    };
    this.appendChild(button);
  }
}
customElements.define("conversation-view", ConversationView);

function main() {
  const context = new Context();
  const navStackFlow = context.create_state_flow<Array<TopLevelNavigationItemBase>>([], "TopLevelNavStack");
  const topbar = new TopBar(navStackFlow.map((navStack) => navStackToTopbarItems(navStackFlow, navStack)));
  const rootNav = new NormalNavigationView<TopLevelNavigationItemBase>(
    navStackFlow,
    topbar,
    (item: TopLevelNavigationItemBase) => {
      switch (item.type) {
        case TopLevelNavigationItemType.Inbox:
          return new InboxView(item as InboxNavigationItem, navStackFlow);
        case TopLevelNavigationItemType.Conversation:
          return new ConversationView(item as ConversationNavigationItem, navStackFlow);
      }
    }
  );

  document.body.appendChild(rootNav);
  rootNav.style.position = "fixed";
  rootNav.style.top = "0";
  rootNav.style.left = "0";
  rootNav.style.right = "0";
  rootNav.style.bottom = "0";
  rootNav.style.border = "1px solid black";

  const navItem = {
    collectionItemId: "inbox-1",
    type: TopLevelNavigationItemType.Inbox,
    inboxType: "primary",
  } as InboxNavigationItem;
  navStackFlow.value = navStackFlow.value.concat([navItem]);
}

// Initialize the app when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
    main();
});