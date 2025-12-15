import { Context, Flow } from "./primitives/flow.js";

export interface Conversation {
  conversationId: string;
  sender: string;
  snippet: string;
  subject: string;
}

export class ConversationModel {
  static getConversation(context: Context, conversationId: string): Flow<Conversation> {
    return context.create_state_flow({
      conversationId: conversationId,
      sender: `Sender of conversation ${conversationId}`,
      snippet: `This is the snippet of conversation ${conversationId}`,
      subject: `Subject of conversation ${conversationId}`,
    }, `ConversationRepo-${conversationId}`);
  }
}
