const Purchase = require('../models/Purchase');
const User = require('../models/User');
const env = require('../config/env');
const {
  buildPurchaseSummary,
  getRuleBasedSuggestions,
  getUpcomingExpiryAlerts,
} = require('../services/suggestionService');

/**
 * Returns the rule-based grocery recommendations used by the Smart Picks page.
 */
const getSuggestions = async (request, response) => {
  const suggestions = await getRuleBasedSuggestions(request.userId);
  return response.json(suggestions);
};

/**
 * Returns purchase-based expiry reminders for items nearing expiration.
 */
const getExpiryAlerts = async (request, response) => {
  const alerts = await getUpcomingExpiryAlerts(request.userId);
  return response.json({ alerts });
};

/**
 * Calls Anthropic to generate optional AI shopping recommendations.
 */
const getAiSuggestions = async (request, response) => {
  const apiKey = env.anthropicApiKey;

  if (!apiKey || apiKey.startsWith('sk-ant-your')) {
    return response
      .status(400)
      .json({ message: 'Add ANTHROPIC_API_KEY to server/.env to use AI suggestions' });
  }

  const [purchases, user] = await Promise.all([
    Purchase.find({ user: request.userId }).sort({ createdAt: -1 }).limit(30),
    User.findById(request.userId),
  ]);

  const purchaseSummary = buildPurchaseSummary(purchases);
  const prompt = `You are a smart grocery assistant for an Indian family.

User: ${user.name}, family of ${user.familySize}, monthly budget Rs.${user.monthlyBudget}
Preferences: ${JSON.stringify(user.preferences)}

Purchase history (item: times bought, last date):
${Object.entries(purchaseSummary)
  .slice(0, 20)
  .map(
    ([itemName, summary]) =>
      `- ${itemName} (${summary.category}): ${summary.count}x, last: ${
        summary.lastDate ? new Date(summary.lastDate).toDateString() : 'unknown'
      }`,
  )
  .join('\n')}

Today: ${new Date().toDateString()}

Respond ONLY with valid JSON (no markdown):
{
  "weeklyPicks": [{"name":"string","reason":"string","estimatedPrice":0}],
  "budgetTip": "string",
  "healthySuggestion": {"name":"string","reason":"string"},
  "familyTip": "string"
}`;

  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-sonnet-4-20250514',
    }),
  });

  const responseData = await anthropicResponse.json();
  const responseText = responseData.content?.[0]?.text || '{}';
  const aiSuggestions = JSON.parse(responseText.replace(/```json|```/g, '').trim());

  return response.json({ aiSuggestions });
};

module.exports = {
  getAiSuggestions,
  getExpiryAlerts,
  getSuggestions,
};
