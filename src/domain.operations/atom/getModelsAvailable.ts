import OpenAI from 'openai';

/**
 * .what = queries chutes api for available models
 * .why = enables discovery and verification of model catalog
 */
export const getModelsAvailable = async (input: {
  filter: { ids: string[] } | null;
}): Promise<{ models: { id: string; owned_by: string }[] }> => {
  // create openai client with chutes base url
  const openai = new OpenAI({
    apiKey: process.env.CHUTES_API_KEY,
    baseURL: 'https://llm.chutes.ai/v1/',
  });

  // query the models endpoint
  const response = await openai.models.list();

  // collect all models
  const modelsAll: { id: string; owned_by: string }[] = [];
  for await (const model of response) {
    modelsAll.push({ id: model.id, owned_by: model.owned_by });
  }

  // filter by ids if requested
  if (!input.filter) return { models: modelsAll };
  const idsTarget = new Set(input.filter.ids);
  const modelsMatched = modelsAll.filter((m) => idsTarget.has(m.id));
  return { models: modelsMatched };
};
