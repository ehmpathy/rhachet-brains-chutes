import type OpenAI from 'openai';
import type { BrainPlugToolDefinition } from 'rhachet/brains';
import { z } from 'zod';

/**
 * .what = converts rhachet tool definition to openai tool format
 * .why = chutes uses openai-compatible api for function call
 */
export const castIntoChutesToolDef = (input: {
  tool: BrainPlugToolDefinition;
}): OpenAI.ChatCompletionTool => ({
  type: 'function' as const,
  function: {
    name: input.tool.slug,
    description: input.tool.description,
    parameters: z.toJSONSchema(input.tool.schema.input),
  },
});
