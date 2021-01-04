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
        } else reject("Ip获取失败");
      })
      .catch((err) => {
        reject("Ip获取失败");
      });
  });
};

// 获取记录
const getRecord = () => {
  axios({
    url: "https://dnsapi.cn/Record.List",
    method: "post",
    data: qs.stringify(params),
  }).then((res) => {
    console.log(res.data);
  });
};

