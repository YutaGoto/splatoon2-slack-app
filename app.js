const fetch = require('node-fetch');
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/splat', async ({ command, ack, say }) => {
  ack();

  say({
    "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Splatoon2スケジュール検索！"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "static_select",
          "action_id": "type_select",
          "placeholder": {
            "type": "plain_text",
            "text": "タイプ",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "ガチマッチ",
                "emoji": true
              },
              "value": "gachi"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "リーグマッチ",
                "emoji": true
              },
              "value": "league"
            }
          ]
        }
      ]
    }
    ]
  });

});

app.action("type_select", ({ body, ack, say }) => {
  // Acknowledge the action
  ack();
  if(body.actions[0].selected_option.value === 'gachi') {
    fetch('https://spla2.yuu26.com/gachi/now')
      .then(function(response) {
        return response.json();
      })
      .then(function(splatJson) {
        const titleText = `${splatJson.result[0].rule}！！ 日時: ${splatJson.result[0].start}〜${splatJson.result[0].end}`;
        const mapText0 = `*${splatJson.result[0].maps_ex[0].name}*`;
        const mapImage0 = splatJson.result[0].maps_ex[0].image;
        const mapText1 = `*${splatJson.result[0].maps_ex[1].name}*`;
        const mapImage1 = splatJson.result[0].maps_ex[1].image;
        say({
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": titleText
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": mapText0
              },
              "accessory": {
                "type": "image",
                "image_url": mapImage0,
                "alt_text": "alt text for image"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": mapText1
              },
              "accessory": {
                "type": "image",
                "image_url": mapImage1,
                "alt_text": "alt text for image"
              }
            }
          ]
        });

      });

  } else if (body.actions[0].selected_option.value === 'league') {
    say('りーぐまっち！');
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
