import * as actionTypes from './types';
import { request } from '@/request';

export const crud = {
  resetState:
    (props = {}) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      // console.log('Fetching data with options(list):', options);

      let data = await request.list({ entity, options });

      // console.log('API response(list):', data);

      if (data.success === true) {
        const result = {
          items: data.result,
          // items: data.result.map(item => ({ ...item })),
          pagination: {
            current: parseInt(data.pagination.page, 10),
            pageSize: options?.items,
            total: parseInt(data.pagination.count, 10),
          },
        };
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'list',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'list',
          payload: null,
        });
      }
    },
  create:
    ({ entity, jsonData, withUpload = false }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });
      let data = null;
      if (withUpload) {
        data = await request.createAndUpload({ entity, jsonData });
      } else {
        data = await request.create({ entity, jsonData });
      }

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'create',
          payload: data.result,
          // payload: { ...data.result },
        });

        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
          // payload: { ...data.result },
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'create',
          payload: null,
        });
      }
    },
  read:
    ({ entity, id }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      let data = await request.read({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
          // payload: { ...data.result },
        });
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'read',
          payload: data.result,
          // payload: { ...data.result },
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'read',
          payload: null,
        });
      }
    },
  update:
    ({ entity, id, jsonData, withUpload = false }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      let data = null;

      if (withUpload) {
        data = await request.updateAndUpload({ entity, id, jsonData });
      } else {
        data = await request.update({ entity, id, jsonData });
      }

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'update',
          payload: data.result,
          // payload: { ...data.result },
        });
        dispatch({
          type: actionTypes.CURRENT_ITEM,
          payload: data.result,
          // payload: { ...data.result },
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'update',
          payload: null,
        });
      }
    },

  updateAll:
  ({ entity, jsonData }) =>
  async (dispatch) => {
    
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      keyState: 'updateAll',
      payload: null,
    });

    try {
      console.log(request);
      const data = await request.updateAll({ entity, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'updateAll',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'updateAll',
          payload: null,
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        keyState: 'updateAll',
        payload: null,
      });
    }
  },

  delete:
    ({ entity, id }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      let data = await request.delete({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'delete',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.RESET_ACTION,
          keyState: 'delete',
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'delete',
          payload: null,
        });
      }
    },

  search:
    ({ entity, options = {} }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      //console.log('Dispatching search request(search):', { entity, options });

      let data = await request.search({ entity, options });

      // console.log('API response(search):', data);

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          keyState: 'search',
          payload: data.result,
          // payload: data.result.map(item => ({ ...item })),
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          keyState: 'search',
          payload: null,
        });
      }
    },
};
