import Mock from 'mockjs';

const List = [];
const count = 20;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    'bankReply': '100',
    'channelOrderNo': 'yesbank20180717205110',
    'dealType': '1',
    'debateBegDt': '20180620',
    'debateNumber': 'DEBATENUMBER20180717',
    'debateOrderNo': 'DEBATEORDERNO20180717',
    'debateSts': '1',
    'disputeRemark': 'SEBATEARGUMENT',
    'disputeType': 'U010',
    'npciNo': 'NPCINO20180717',
    'shareitOrderNo': 'PAY2nNg20180723063627087228',
    'userId': 'USERID20180717741'
  }));
}

export default {
  qieziUpiDebateList: () => {
    return {
      total: List.length,
      items: List
    };
  }
};
