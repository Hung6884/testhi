import settings from './config/settings';
import { getBaseInitialState } from './base/baseApp';
import { createRequest } from './utils/createRequest';
export async function getInitialState() {
  try {
    const baseInitialState = await getBaseInitialState({ settings });

    return baseInitialState;
  } catch (_error) {
    console.log(_error);
  }
}

export const request = createRequest({ settings });
