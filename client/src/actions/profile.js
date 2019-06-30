import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILES } from './types';

//GET current user profile

export const getCurrentProfile = () => async dispatch => {

// dispatch({ type: CLEAR_PROFILE });

  try {

    const res = await axios.get('/api/profiles/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.message,
        status: err.response.status
      }
    });
  }
}

//Get all Profiles
export const getProfiles = () => async dispatch => {

// dispatch({ type: CLEAR_PROFILE });

  try {

    const res = await axios.get('/api/profiles');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.message,
        status: err.response.status
      }
    });
  }
}

//Get Profile by Id

export const getProfileById = userId => async dispatch => {
  try {

    const res = await axios.get(`/api/profiles/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
}

//Create or Update a PROFILE

export const createProfile = (formData, history, edit = false ) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/profiles', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if(!edit) {
      history.push('/dashboard');
    }
  } catch (err) {

    const errors = err.response.data.errors;

    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.statusText
      }
    });
  }
}

//Add Experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.put('/api/profiles/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added', 'success'));

    history.push('/dashboard');

  } catch (err) {

    const errors = err.response.data.errors;

    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.statusText
      }
    });
  }
}

//Add Education

export const addEducation = (formData, history) => async dispatch => {

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put('/api/profiles/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Added', 'success'));

    history.push('/dashboard');

  } catch (err) {

    const errors = err.response.data.errors;

    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.statusText
      }
    });
  }
}

//Delete Experience

export const deleteExperience = id => async dispatch => {
  try {
    const res= await axios.delete(`/api/profiles/experience/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Removed', 'success'));

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.statusText
      }
    });
  }
}

//Delete Education
export const deleteEducation = id => async dispatch => {
  try {
    const res= await axios.delete(`/api/profiles/education/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed', 'success'));

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.statusText
      }
    });
  }
}


//Delete account & profile
export const deleteAccount = () =>
   async dispatch => {
if(window.confirm('Are you sure? This can NOT be undone!')) {
  try {

    await axios.delete('/api/profiles')

    dispatch({type: CLEAR_PROFILE});
    dispatch({type: ACCOUNT_DELETED});

    dispatch(setAlert('Your Account has been permanatly deleted', 'success'));

  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.statusText
        }
      });
    }
  }
}
