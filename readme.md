# NodeDDNS

## 说明

NodeDDNS 是 DNSPod DDNS 客户端，主要是自用。目前只能解析A记录，IP只能使用公网IP。

## 使用方式

```
git clone 本项目
yarn install
或 npm install
yarn start
或 npm start
```

## 配置项

### 配置说明

| 配置                | 类型    | 说明                                                                 | 备注 |
| ------------------- | ------- | -------------------------------------------------------------------- | ---- |
| ID                  | string  | 密钥 ID,<br> 见 https://docs.dnspod.cn/api/5f561f9ee75cf42d25bf6720/ |
| token               | string  | token                                                                |      |
| terminal            | string  | 请求间隔, 默认'\*/30 \* \* \* \* \*', 即每 30s 执行一次。            |      |
| domain              | string  | 需要更改解析的域名,如:abc.com                                        |      |
| sub_domain          | string  | 需要修改的记录,如果域名为 xxx.abc.com, 则填写 xxx                    |      |
| logFile             | Object  | 日志文件配置                                                         |      |
| logFile.logFileSize | number  | 日志文件分片大小, 单位 b, 默认 2000                                  |      |
| logFile.logNum      | number  | 日志文件保存数量, 默认 3                                             |      |
| email               | Object  | 通知邮件配置                                                         |      |
| email.enable        | boolean | 更改成功后是否邮件通知, 默认 true                                    |      |
| email.recieveEmail  | string  | 收件人地址                                                           |      |
| email.smtpHost      | string  | 发件人 SMTP 服务器地址                                               |      |
| email.smtpPort      | Number  | 发件人 SMTP 服务器端口                                               |      |
| email.smtpUser      | string  | 发件人 SMTP 用户名                                                   |      |
| email.smtpPass      | string  | 发件人 SMTP 密码                                                     |      |

### terminal 格式(crontab) 说明

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

## TODO

1. 可以获取本地 IP 地址；
2. 解析方式不限于 A 记录；
