// @Project
import { IThunkDispatcher } from 'interfaces';
import { getProfileNotifications } from 'services/profile';

export const GET_LAST_NOTIFICATIONS = '[HOME] LAST NOTIFICATIONS';

export const getLastNotifications = () => {
  return (dispatch: IThunkDispatcher) => {
    return getProfileNotifications()
      .then(response => {
        const data = response.data.data;

        dispatch({
          type: GET_LAST_NOTIFICATIONS,
          payload: data
        });
      })
      .catch((e) => console.log({ e }))
  }
}