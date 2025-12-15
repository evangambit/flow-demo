import { StateFlow, Context } from "./primitives/flow.js";
import { StackNavigationView } from "./base-ui/stack-navigation-view.js";
import { TopBar, TopbarItem } from "./topbar.js";
import { ConversationModel } from "./conversation.js";
import { ConversationView } from "./conversation-view.js";
import { InboxView } from "./inbox-view.js";
import { ConversationNavigationItem, InboxNavigationItem, TopLevelNavigationItemBase, TopLevelNavigationItemType } from "./nav-item.js";

const starIcon = '/star.svg';

const context = new Context();

function make_element(tag: string, fn: (el: HTMLElement) => void): HTMLElement {
  const el = document.createElement(tag);
  fn(el);
  return el;
}

function navStackToTopbarItems(
  navStack: Array<TopLevelNavigationItemBase>,
  navStackFlow: StateFlow<Array<TopLevelNavigationItemBase>>
): Array<TopbarItem> {
  if (navStack.length === 0) {
    return [];
  }
  const items: Array<TopbarItem> = [];
  if (navStack.length > 1) {
    items.push({
      collectionItemId: "back-button",
      element: make_element("button", (btn) => {
        btn.innerText = "Back";
        btn.onclick = () => {
          navStackFlow.value = navStackFlow.value.slice(0, navStackFlow.value.length - 1);
        };
      }),
    });
  }
  const currentItem = navStack[navStack.length - 1];

  let title = "";
  switch (currentItem.type) {
    case TopLevelNavigationItemType.Inbox:
      title = `Inbox (${(currentItem as InboxNavigationItem).inboxType})`;
      break;
    case TopLevelNavigationItemType.Conversation:
      title = `Conversation (${(currentItem as ConversationNavigationItem).conversationId})`;
      break;
  }
  items.push({
    collectionItemId: "title",
    element: make_element("div", (div) => {
      div.innerText = title;
      div.style.fontWeight = "bold";
      div.style.fontSize = "18px";
    }),
  });

  if (currentItem.type === TopLevelNavigationItemType.Conversation) {
    items.push({
      collectionItemId: "star-button",
      element: make_element("button", (btn) => {
        const starImg = document.createElement("img");
        starImg.src = starIcon;
        starImg.style.width = "16px";
        starImg.style.height = "16px";
        starImg.style.verticalAlign = "middle";
        btn.appendChild(starImg);
      }),
    });
  }
  
  return items;
}

class RootNav extends StackNavigationView<TopLevelNavigationItemBase> {
  constructor(stackFlow: StateFlow<Array<TopLevelNavigationItemBase>>) {
    const topbar = new TopBar(stackFlow.map((navStack) => navStackToTopbarItems(navStack, stackFlow)));
    super(stackFlow, topbar, (item: TopLevelNavigationItemBase) => {
      switch (item.type) {
        case TopLevelNavigationItemType.Inbox:
          return new InboxView(
            ConversationModel.getInboxItems(context, (item as InboxNavigationItem).inboxType),
            stackFlow
        );
        case TopLevelNavigationItemType.Conversation:
          return new ConversationView(ConversationModel.getConversation(context, item.collectionItemId), stackFlow);
      }
    });
  }
}
customElements.define("root-nav", RootNav);

function main() {
  const navStackFlow = context.create_state_flow<Array<TopLevelNavigationItemBase>>([], "TopLevelNavStack");
  const rootNav = new RootNav(navStackFlow);

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
