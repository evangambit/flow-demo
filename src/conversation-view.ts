
import { View } from "./base-ui/view.js";
import { StateFlow, Flow } from "./primitives/flow.js";
import { Conversation } from "./conversation.js";
import { TopLevelNavigationItemBase } from "./nav-item.js";


const starIcon = '/star.svg';

export class ConversationView extends View<Conversation> {
  constructor(conversationFlow: Flow<Conversation>, navStack: StateFlow<Array<TopLevelNavigationItemBase>>) {
    super(conversationFlow.consume((conversation) => {
      this.innerText = `Conversation View - ${conversation.conversationId}\nFrom: ${conversation.sender}\n\n${conversation.messages.join("\n")}`;
      const button = document.createElement("button");
      const starImg = document.createElement("img");
      starImg.src = starIcon;
      starImg.style.width = "16px";
      starImg.style.height = "16px";
      starImg.style.verticalAlign = "middle";
      button.appendChild(starImg);
      button.style.marginTop = "10px";
      button.onclick = () => {
        navStack.value = navStack.value.filter(navItem => navItem.collectionItemId !== conversation.conversationId);
      };
      this.appendChild(button);      
    }, "ConversationViewConsumer"));
  }
}
customElements.define("conversation-view", ConversationView);