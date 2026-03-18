import type OpenAI from 'openai';
import type { BrainPlugToolInvocation } from 'rhachet/brains';

/**
 * .what = converts openai tool call to rhachet tool invocation
 * .why = extracts tool call from chutes api response into rhachet format
 */
export const castFromChutesToolCall = (input: {
  call: OpenAI.ChatCompletionMessageToolCall;
}): BrainPlugToolInvocation => ({
  exid: input.call.id,
  slug: input.call.function.name,
  input: JSON.parse(input.call.function.arguments),
});
