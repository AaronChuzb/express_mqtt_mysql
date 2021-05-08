# express_mqtt_mysql

1. 基于nodejs的express框架，接收mqtt数据，存入mysql数据库，暴露数据相关接口。达到存储单个主题数据的目的。
2. 数据库采用阿里云mysql数据库

# 傻瓜式运行

1. 拉取代码后进入项目根路径打开cmd或者终端，输入命令`npm install`安装项目依赖。
2. 安装完依赖后，执行`npm run dev`
3. 浏览器打开 http://localhost:4000 随后可以看到测试数据，代表运行成功。