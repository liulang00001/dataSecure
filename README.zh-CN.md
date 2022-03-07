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


推送dist文件至Amazon的静态存储桶 - shareit.static.ap-southeast-1
目录为OMC

运维分配给OMC的域名：
、、prod
omc.wshareit.com
、、alpha
omc-alpha.wshareit.com
、、dev 
omc-dev.wshareit.com
