import * as ACTION_TYPES from "./action_types";

export const SUCCESS = {
  type: ACTION_TYPES.SUCCESS
};

export const FAILURE = {
  type: ACTION_TYPES.FAILURE
};

export const success = () => {
  return {
    type: ACTION_TYPES.SUCCESS
  };
};

export const failure = () => {
  return {
    type: ACTION_TYPES.FAILURE
  };
};

export const user_input = text => {
  return {
    type: ACTION_TYPES.USER_INPUT,
    payload: text
  };
};

export const login_success = () => {
  return {
    type: ACTION_TYPES.LOGIN_SUCCESS
  };
};

export const login_failure = () => {
  return {
    type: ACTION_TYPES.LOGIN_FAILURE
  };
};

export const add_profile = profile => {
  return {
    type: ACTION_TYPES.ADD_PROFILE,
    payload: profile
  };
};

export const remove_profile = () => {
  return {
    type: ACTION_TYPES.REMOVE_PROFILE
  };
};

//
export const set_db_profile = profile => {
  return {
    type: ACTION_TYPES.SET_DB_PROFILE,
    payload: profile
  };
};

export const remove_db_profile = () => {
  return {
    type: ACTION_TYPES.REMOVE_DB_PROFILE
  };
};

//
export const fetch_db_posts = posts => {
  return {
    type: ACTION_TYPES.FETCH_DB_POSTS,
    payload: posts
  };
};

export const remove_db_posts = () => {
  return {
    type: ACTION_TYPES.REMOVE_DB_POSTS
  };
};
//
export const fetch_post_comments = comments => {
  return {
    type: ACTION_TYPES.FETCH_POST_COMMENTS,
    payload: comments
  };
};

export const remove_post_comments = () => {
  return {
    type: ACTION_TYPES.REMOVE_POST_COMMENTS
  };
};

//
export const fetch_user_posts = posts => {
  return {
    type: ACTION_TYPES.FETCH_USER_POSTS,
    payload: posts
  };
};

export const remove_user_posts = () => {
  return {
    type: ACTION_TYPES.REMOVE_USER_POSTS
  };
};
//
export const fetch_search_posts = posts => {
  return {
    type: ACTION_TYPES.SEARCH_POSTS_SUCCESS,
    payload: posts
  };
};

export const remove_search_posts = () => {
  return {
    type: ACTION_TYPES.SEARCH_POSTS_FAILURE
  };
};

// OTHER USERS ACTIONS

export const set_other_user_db_profile = profile => {
  return {
    type: ACTION_TYPES.SET_OTHER_USER_DB_PROFILE,
    payload: profile
  };
};

export const remove_other_user_db_profile = () => {
  return {
    type: ACTION_TYPES.REMOVE_OTHER_USER_DB_PROFILE
  };
};

export const get_other_user_db_posts = posts => {
  return {
    type: ACTION_TYPES.GET_OTHER_USER_DB_POSTS,
    payload: posts
  };
};

export const remove_other_user_db_posts = () => {
  return {
    type: ACTION_TYPES.REMOVE_OTHER_USER_DB_POSTS
  };
};
//
export const set_user_messages = messages => {
  return {
    type: ACTION_TYPES.SET_USER_MESSAGES,
    payload: messages
  };
};

export const remove_user_messages = () => {
  return {
    type: ACTION_TYPES.REMOVE_USER_MESSAGES
  };
};

export const get_appointments_success = (appointments) => {
  return {
    type: ACTION_TYPES.APPOINTMENTS_SUCCESS,
    payload: appointments
  };
};


export const get_all_users = (users) => {
  return {
    type: ACTION_TYPES.GET_ALL_USERS,
    payload: users
  };
};


export const remove_all_users = () => {
  return {
    type: ACTION_TYPES.REMOVE_ALL_USERS
  };
};