#bash
npm install

#环境说明

本地测试环境 proxyTable里有后台转发的地址
npm run dev


环境区分 dev | alpha  |  prod
、、prod
npm run build:prod
、、alpha
npm run build:sit
、、dev 
npm run build:test




推送dist文件至Amazon的静态存储桶 - payment-static-aps1
目录为OMC


运维分配给OMC的域名：
、、prod
omc-dev.payermax.com
、、alpha
omc-alpha.shareitpay.in
、、dev 
omc.shareitpay.in


omc-server
omc-api.shareitpay.in

需求地址：
https://pms.ushareit.org/zentao/story-view-668.html


退款需求地址：
https://pms.ushareit.org/zentao/story-view-773.html