const config = {
  ID: "204683",
  token: "68be068850f4fb13070809a1c5524f64",
  terminal: 300,
  domain: "1eo.xyz",
  sub_domain: "nas",
  logs: {
    file: {
      enable: true,
      logFileSize: 200,
      logNum: 3,
    },
    email: {
      enable: true,
      sendEmail: "leo95123@qq.com",
      recieveEmail: "leo95123@qq.com",
      smtpHost: "smtp.qq.com",
      smtpPort: "465",
      smtpUser: "leo95123@qq.com",
      smtpPass: "iggedvnbkautfead",
    },
  },
};
module.exports = config;
