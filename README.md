# 🤖 n8n-nodes-telegram-send-message-custom

✨ **Differences from the standard Telegram node in n8n:**

- 📝 You can provide **any data** supported by the Telegram API without limitations
    - either manually as a JSON string or as an object
    - or using variables obtained from previous steps
- 🔀 Supports multiple Telegram methods via **Operation select**
    - `sendMessage`
    - `sendPhoto`
- 🔍 The **Output** panel displays raw API request/response data, making debugging more transparent and straightforward

🚀 Custom n8n node to send Telegram messages using `telegramApi` credentials with **custom JSON**.

For example, adding custom `reply_markup` in JSON (inline keyboard, reply keyboard etc):

```json
{
  "reply_markup": {
    "inline_keyboard": [
      [
        {
          "text": "🌐 Open Website",
          "url": "https://example.com"
        }
      ],
      [
        {
          "text": "✅ Confirm",
          "callback_data": "confirm_action"
        }
      ]
    ]
  }
}
```

📚 See the official [Telegram Bot API docs](https://core.telegram.org/bots/api#sendmessage).

---

## ⚙️ Install

In n8n:  
**Settings → Community Nodes → Install → `@topvisor/n8n-nodes-telegram-send-message-custom`**

---

## 🛠️ Usage

1. ➕ Add this node in workflow
2. 🔑 Select your Telegram API credentials
3. 🔀 Choose Operation (Send Message or Send Photo)
4. 💬 Fill base fields (Chat ID, Text / Photo)
5. 🧩 Paste raw JSON into **Custom JSON** (supports expressions)
