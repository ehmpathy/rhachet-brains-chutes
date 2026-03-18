import type OpenAI from 'openai';
import type { BrainPlugToolExecution } from 'rhachet/brains';

/**
 * .what = converts rhachet tool executions to openai message format
 * .why = feeds tool results back to chutes api for continuation
 */
export const castIntoChutesToolMessages = (input: {
  executions: BrainPlugToolExecution[];
}): OpenAI.ChatCompletionMessageParam[] => {
  const messages: OpenAI.ChatCompletionMessageParam[] = [];

  // assistant message with tool_calls array
  messages.push({
    role: 'assistant' as const,
    content: null,
    tool_calls: input.executions.map((exec) => ({
      id: exec.exid,
      type: 'function' as const,
      function: {
        name: exec.slug,
        arguments: JSON.stringify(exec.input),
      },
    })),
  });

  // tool result messages
  for (const execution of input.executions) {
    messages.push({
      role: 'tool' as const,
      tool_call_id: execution.exid,
      content: JSON.stringify(execution.output),
    });
  }

  return messages;
};
