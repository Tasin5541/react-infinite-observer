module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /\b(?:Bumps.*?from.*?to)\b/m.test(message)],
};
