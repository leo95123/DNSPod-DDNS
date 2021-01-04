# NodeDDNS

## 配置项

| 配置         | 类型   | 说明                                                                 | 备注 |
| ------------ | ------ | -------------------------------------------------------------------- | ---- |
| ID           | string | 密钥 ID,<br> 见 https://docs.dnspod.cn/api/5f561f9ee75cf42d25bf6720/ |
| token        | string | token                                                                |      |
| terminal     | Number | 请求间隔，单位秒(s),默认 300s(5min)                                  |      |
| domain       | string | 需要更改解析的域名,如:abc.com                                        |      |
| sub_domain   | string | 需要修改的记录,如果域名为 xxx.abc.com, 则填写 xxx                    |      |
| logType      | Array  | 日志方式,["file","email"], file:文件, email:邮件                     |      |
| logFileSize  | Number | 日志文件大小, 单位 b, 默认 200b                                      |      |
| logNum       | string | 日志文件保留数量                                                     |      |
| sendEmail    | string | 发件人地址                                                           |      |
| recieveEmail | string | 收件人地址                                                           |      |
| smtpHost     | string | 发件人 SMTP 服务器地址                                               |      |
| smtpPort     | Number | 发件人 SMTP 服务器端口                                               |      |
| smtpUser     | string | 发件人 SMTP 用户名                                                   |      |
| smtpPass     | string | 发件人 SMTP 密码                                                     |      |
