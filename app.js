const axios = require('axios')
const qs = require('qs')
const log4js = require('log4js')
const schedule = require('node-schedule')
const config = require('./config')

// log配置
log4js.configure({
  appenders: {
    info: {
      type: 'file',
      filename: './logs/ddns.log',
      maxLogSize: config.logFile.logFileSize,
      backups: config.logFile.logNum,
    },
    email: {
      type: require('@log4js-node/smtp'),
      recipients: config.email.recieveEmail,
      sender: config.email.sendEmail,
      subject: '域名解析发生变化',
      SMTP: {
        host: config.email.smtpHost,
        port: config.email.smtpPort,
        auth: {
          user: config.email.smtpUser,
          pass: config.email.smtpPass,
        },
      },
    },
  },
  categories: {
    default: { appenders: ['info'], level: 'fatal' },
    info: { appenders: ['info'], level: 'all' },
    email: { appenders: ['email'], level: 'all' },
  },
})
const logger = log4js.getLogger('info')

// axios拦截配置
axios.interceptors.request.use((config) => {
  config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  config.proxy = false
  return config
})
// 获取公网IP地址
const getIp = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://pv.sohu.com/cityjson')
      .then((res) => {
        if (res.status === 200) {
          let ipJson = JSON.parse(res.data.slice(19, -1))
          resolve(ipJson.cip)
        } else {
          logger.error(`获取IP失败!`)
        }
      })
      .catch((err) => {
        logger.error(`获取IP失败!`)
      })
  })
}

// 获取记录
const getRecord = () => {
  return new Promise((resolve, reject) => {
    const params = {
      login_token: `${config.ID},${config.token}`,
      domain: config.domain,
      sub_domain: config.sub_domain,
      format: 'json',
    }
    axios({
      url: 'https://dnsapi.cn/Record.List',
      method: 'post',
      data: qs.stringify(params),
    })
      .then((res) => {
        if (res.status === 200 && res.data.status.code == 1) {
          let data = {
            domain: res.data.domain,
            records: res.data.records,
          }
          resolve(data)
        } else {
          logger.error(`获取记录失败:${res.data.status.message}`)
        }
      })
      .catch((err) => {
        logger.error(`获取记录失败:${err}`)
      })
  })
}

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
    record_type: 'A',
    record_line: recordLine,
    mx: mx,
    value: ip,
  }
  axios({
    url: 'https://dnsapi.cn/Record.Modify',
    method: 'post',
    data: qs.stringify(params),
  })
    .then((res) => {
      if (res.status === 200 && res.data.status.code == 1) {
        const info = `设置成功:${res.data.record.name}.${config.domain}的记录值已改为${res.data.record.value}`
        logger.info(info)
        // 邮件发送
        if (config.email.enable) {
          const email = log4js.getLogger('email')
          email.info(info)
        }
      } else {
        logger.error(`记录设置失败:${res.data.status.message}`)
      }
    })
    .catch((err) => {
      logger.error(`记录设置失败:${err}`)
    })
}

const main = async () => {
  try {
    let ip = await getIp()
    let record = await getRecord()
    // 对比IP，如果相等不改变解析
    if (record.records[0].value === ip) {
      return
    }
    changeRecord(
      ip,
      record.domain.id,
      record.records[0].id,
      record.records[0].name,
      record.records[0].line,
      record.records[0].mx
    )
  } catch (e) {
    logger.error(`${e}`)
  }
}

// 定时执行
schedule.scheduleJob(config.terminal, () => {
  main()
})
