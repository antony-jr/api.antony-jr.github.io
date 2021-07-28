const TelegramBot = require("node-telegram-bot-api");

const handler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  if (req.method != "POST") {
    res.end(
      JSON.stringify({ error: true, message: "expected a post method request" })
    );
    return;
  }

  const { name, email, message } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message != "string"
  ) {
    res.end(
      JSON.stringify({
        error: true,
        message: "Invalid type of data posted",
      })
    );
    return;
  }

  const env_keys = Object.keys(process.env);
  if (
    env_keys.indexOf("TELEGRAM_BOT_TOKEN") !== -1 &&
    env_keys.indexOf("TELEGRAM_GROUP_ID_TARGET") !== -1
  ) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
    bot
      .sendMessage(
        process.env.TELEGRAM_GROUP_ID_TARGET,
        "*" + name + "* (" + email + ")\n\n" + message,
        { parse_mode: "Markdown" }
      )
      .then((data) => {
        res.end(
          JSON.stringify({
            error: false,
            message: "Message Sent.",
          })
        );
      })
      .catch((err) => {
        res.end(
          JSON.stringify({
            error: true,
            message: err,
          })
        );
      });
  } else {
    res.end(
      JSON.stringify({
        error: true,
        message: "Internal Error.",
      })
    );
    return;
  }
};

export default handler;
