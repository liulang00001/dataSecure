/**
  NOTE
  mock & dev environments are setup with webpack-dev-server, so they have some different configures like 'target' address.
  target address is the real service url.
*/

module.exports = {
  TARGET: {
    COMMON: {
      mock: "http://alb-pay-front-mock-dev-721363715.ap-south-1.elb.amazonaws.com/mock/5c08e1e5bd9f9c3a01c5abea/omc/",
      dev: "https://omc-gate-dev.shareitpay.in/aggregate-back-omc-service/",
    },
    NEW_COMMON: {
      mock: "http://alb-pay-front-mock-dev-721363715.ap-south-1.elb.amazonaws.com/mock/5c08e1e5bd9f9c3a01c5abea/omc/",
      dev: "https://omc-gate-dev.shareitpay.in/pay-omc-gateway/",
    },
    GATEWAY_COMMON: {
      mock: "http://alb-pay-front-mock-dev-721363715.ap-south-1.elb.amazonaws.com/mock/5c08e1e5bd9f9c3a01c5abea/omc/",
      dev: "https://omc-gate-dev.shareitpay.in/omc-gateway/",
    },
    NEW_UPMS: {
      mock: "http://alb-pay-front-mock-dev-721363715.ap-south-1.elb.amazonaws.com/mock/60f56143e170626ecca4b57d/upms",
      dev: 'https://pay-dev.shareitpay.in/upms/'
    },
    LOCAL_SEVICE: {
      dev: 'http://localhost:8000/dc-secure/',
    },
  },

  HOST: {
    COMMON: {
      mock: "/mock/",
      dev: "/api/",
      test: "https://omc-gate-dev.shareitpay.in/aggregate-back-omc-service/",
      uat: "https://pay-uat-sg.shareitpay.in/aggregate-back-omc-service/",
      sit: "https://omc-gate-alpha.shareitpay.in/aggregate-back-omc-service/",
      prod: "https://omc-gate-prod.payermax.com/aggregate-back-omc-service/",
      stress: "https://pay-server.shareitpay.in/aggregate-pay-gate/",
      staging: "https://pay-omc-staging.payermax.com/aggregate-pay-gate/",
      gray: "https://omc-gate-prod.payermax.com/aggregate-back-omc-service/",
    },
    NEW_COMMON: {
      mock: "/mock/",
      dev: "/new_api/",
      test: "https://omc-gate-dev.shareitpay.in/pay-omc-gateway/",
      uat: "https://pay-uat-sg.shareitpay.in/pay-omc-gateway/",
      sit: "https://omc-gate-alpha.shareitpay.in/pay-omc-gateway/",
      prod: "https://omc-gate-prod.payermax.com/pay-omc-gateway/",
      stress: "https://pay-server.shareitpay.in/pay-omc-gateway/",
      staging: "https://omc-staging.payermax.com/pay-omc-gateway/",
      gray: "https://omc-gate-prod.payermax.com/pay-omc-gateway/",
    },

    GATEWAY_COMMON: {
      mock: "/mock/",
      dev: "/gate_way/",
      test: "https://omc-gate-dev.shareitpay.in/omc-gateway/",
      uat: "https://pay-uat-sg.shareitpay.in/omc-gateway/",
      sit: "https://omc-gate-alpha.shareitpay.in/omc-gateway/",
      prod: "https://omc-gate-prod.payermax.com/omc-gateway/",
      stress: "https://pay-server.shareitpay.in/omc-gateway/",
      staging: "https://pay-omc-staging.payermax.com/omc-gateway/",
      gray: "https://omc-gate-prod.payermax.com/omc-gateway/",
    },
    NEW_UPMS: {
      mock: "/new_mock/",
      dev: "/upms/",
      test: "https://pay-dev.shareitpay.in/upms/",
      uat: "https://pay-uat-sg.shareitpay.in/upms/",
      sit: "https://pay-alpha.shareitpay.in/upms/",
      prod: "https://upms-service.payermax.com/upms/",
      stress: "https://pay-server.shareitpay.in/upms/",
      staging: "https://pay-omc-staging.payermax.com/upms/",
      gray: "https://upms-service.payermax.com/upms/",
    },
    LOCAL_SEVICE: {
      dev: '/dc-secure/',
    },
  },

  getBaseUrl: function (hostType, envType) {
    const type = (hostType || "COMMON").toUpperCase();
    return this.HOST[type][envType];
  },

  getTarget: function (hostType, envType) {
    const type = (hostType || "COMMON").toUpperCase();
    return this.TARGET[type][envType];
  }
}
