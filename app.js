const axios = require("axios");
const config = require("./config");
const qs = require("qs");
const log4js = require("log4js");

// log配置
let fileAppender = {};
if (config.logs.file.enable) {
  fileAppender = {
    type: "file",
    fileName: "./logs/ddns.log",
    maxLogSize: config.logs.file.logFileSize,
    backups: config.logs.file.logNum,
  };
}
let smtpAppender = {};
if (config.logs.email.enable) {
  smtpAppender = {
    type: "@log4js-node/smtp",
    recipients: config.logs.email.recieveEmail,
    sender: config.logs.email.sendEmail,
    subject: "域名解析发生变化",
    SMTP: {
      host: config.logs.email.smtpHost,
      auth: {
        user: config.logs.email.smtpUser,
        pass: config.logs.email.smtpPass,
      },
    },
  };
}
log4js.configure({
  appenders: { info: fileAppender, email: smtpAppender },
  categories: {
    default: { appenders: ["info", "email"] },
  },
});
const setLog = (log, isEmail = false) => {
  if (config.logs.file) {
    log4js.getLogger("info").info(log);
  }
  if (config.log.email && isEmail) {
    log4js.getLogger("email").email(log);
  }
};
// axios拦截配置
axios.interceptors.request.use((config) => {
  config.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
  config.proxy = false;
  return config;
});
// 获取公网IP地址
const getIp = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://pv.sohu.com/cityjson")
      .then((res) => {
        if (res.status === 200) {
          let ipJson = JSON.parse(res.data.slice(19, -1));
          resolve(ipJson.cip);
        } else {
          setLog(`INFO:获取IP失败:${res}`);
        }
      })
      .catch((err) => {
        setLog(`ERROR:获取IP失败:${err}`);
      });
  });
};

// 获取记录
const getRecord = () => {
  return new Promise((resolve, reject) => {
    const params = {
      login_token: `${config.ID},${config.token}`,
      domain: config.domain,
      sub_domain: config.sub_domain,
      format: "json",
    };
    axios({
      url: "https://dnsapi.cn/Record.List",
      method: "post",
      data: qs.stringify(params),
    })
      .then((res) => {
        if (res.status === 200 && res.data.status.code == 1) {
          let data = {
            domain: res.data.domain,
            records: res.data.records,
          };
          resolve(data);
        } else {
          setLog(`INFO:获取记录失败:${res}`);
        }
      })
      .catch((err) => {
        setLog(`ERROR:获取记录失败:${err}`);
      });
  });
};

// 设置记录
/*
ip: 新的解析值
domainId: 域名ID
recordId: 记录ID
subDomain:记录
recordLine: 
mx: 优先级{1,20}
*/
const changeRecord = (ip, domainId, recordId, subDomain, recordLine, mx) => {
  let params = {
    login_token: `${config.ID},${config.token}`,
    domain_id: domainId,
    record_id: recordId,
    sub_domain: subDomain,
    record_type: "A",
    record_line: recordLine,
    mx: mx,
    value: ip,
  };
  axios({
    url: "https://dnsapi.cn/Record.Modify",
    method: "post",
    data: qs.stringify(params),
  })
    .then((res) => {
      console.log(res.data);
      if (res.status === 200 && res.data.status.code == 1) {
        setLog(
          `INFO:设置成功-${res.data.name}.${config.domain}的记录值已改为${res.data.value}`,
          true
        );
      } else {
        setLog(`ERROR:记录设置失败:${err}`);
      }
    })
    .catch((err) => {
      setLog(`ERROR:记录设置失败:${err}`);
    });
};

const main = async () => {
  try {
    let ip = await getIp();
    let record = await getRecord();
    // 对比IP，如果相等不改变解析
    if (record.records[0].value === ip) {
      return;
    }
    changeRecord(
      ip,
      record.domain.id,
      record.records[0].id,
      record.records[0].name,
      record.records[0].line,
      record.records[0].mx
    );
  } catch (e) {
    console.log(e);
  }
};
main();
