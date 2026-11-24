export function getMailerLiteConfig() {
  const token = process.env.MAILERLITE_API_TOKEN?.trim();
  const groupId = process.env.MAILERLITE_GROUP_ID?.trim();
  const feedbackField = process.env.MAILERLITE_FEEDBACK_FIELD?.trim();

  return token && groupId && feedbackField ? { token, groupId, feedbackField } : null;
}
