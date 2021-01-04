const axios = require("axios");
const config = require("./config");
const qs = require("qs");

const params = {
  login_token: `${config.ID},${config.token}`,
  domain: config.domain,
  sub_domain: config.sub_domain,
  format: "json",
};
axios.interceptors.request.use((config) => {
  config.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
  config.proxy = false;
  return config;
});
const getIp = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://pv.sohu.com/cityjson")
      .then((res) => {
        if (res.status === 200) {
          let ipJson = JSON.parse(res.data.slice(19, -1));
          resolve(ipJson.cip);
        } else console.log("获取失败");
      })
      .catch((err) => {
        console.log("获取失败");
      });
  });
};

// 获取记录
const getRecord = () => {
  return new Promise((resolve, reject) => {
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
          console.log("获取失败");
        }
      })
      .catch((err) => {
        console.log("获取失败");
      });
  });
};
/*
ip: 新的解析值
domainId: 域名ID
recordId: 记录ID
mx: 优先级{1,20}
*/
const changeRecord = (ip, domainId, recordId, recordLine, mx) => {
  let params = {
    domain_id: domainId,
    record_id: recordId,
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
      if (res.status === 200 && res.data.status.code == 1) {
        let data = {
          domain: res.data.domain,
          records: res.data.records,
        };
        resolve(data);
      } else {
        console.log("获取失败");
      }
    })
    .catch((err) => {
      console.log("获取失败");
    });
};
// 修改记录
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
      record.records[0].line,
      record.records[0].mx
    );
  } catch (e) {
    console.log(e);
  }
};
changeRecord();
