/* API Base URL */
const API_BASE =
  "http://localhost:3001/api/v1/ai";


/* Get Authentication Headers */
function getAuthHeaders(token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  return headers;
}


/* Send Message */
export async function sendAIMessage({
  message,
  conversationId,
  guestMessages,
  token,
}) {
  const response = await fetch(
    `${API_BASE}/chat`,
    {
      method: "POST",

      headers:
        getAuthHeaders(token),

      body: JSON.stringify({
        message,
        conversationId,
        guestMessages,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to generate AI response."
    );
  }

  return data;
}


/* Get Saved Conversations */
export async function getAIConversations(
  token
) {
  const response = await fetch(
    `${API_BASE}/conversations`,
    {
      headers:
        getAuthHeaders(token),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to load conversations."
    );
  }

  return data;
}


/* Delete Conversation */
export async function deleteAIConversation(
  conversationId,
  token
) {
  const response = await fetch(
    `${API_BASE}/conversations/${conversationId}`,
    {
      method: "DELETE",

      headers:
        getAuthHeaders(token),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to delete conversation."
    );
  }

  return data;
}