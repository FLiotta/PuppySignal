// @Own
import api from './api';

const notificationsAPI = api.injectEndpoints({
  endpoints: (build) => ({
    subscribeToPersonalTopics: build.query<void, string>({
      query: (FCMToken) => ({
        url: 'notification/suscribe_personal_topic',
        method: "POST",
        body: { token: FCMToken }
      })
    }),
    unsuscribeFromTopics: build.query<void, string>({
      query: (FCMToken) => ({
        url: 'notification/unsuscribe',
        method: "POST",
        body: { token: FCMToken }
      })
    })
  })
})

export const {
  useLazySubscribeToPersonalTopicsQuery,
  useLazyUnsuscribeFromTopicsQuery
} = notificationsAPI;
