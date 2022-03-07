import store from '@/store';

const cloudConfig = {};

export function getPayTypes(payType) {
  const payTypes = store.getters.cloudConfig.payTypes || [];
  for (let i = 0; i < payTypes.length; i++) {
    if (payTypes[i].payWayCode === payType) {
      return payTypes[i].displayName;
    }
  }
  return '';
};

export function getChannelName(channelCode)  {
  const channelConfigs = store.getters.cloudConfig.channelConfigs || [];
  let lang = store.getters.language;
  for (let i = 0; i < channelConfigs.length; i++) {
    if (channelConfigs[i].channelCode === channelCode) {
      if(lang == 'en' )
        return channelConfigs[i].enName;
      else
      return channelConfigs[i].cnName;
    }
  }
  return '';
}

cloudConfig.getPayTypes = getPayTypes
cloudConfig.getChannelName = getChannelName
export default cloudConfig;
