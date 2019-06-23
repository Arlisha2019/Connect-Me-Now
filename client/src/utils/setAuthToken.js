import axios from 'axios';

const setAuthToken = token => {
  if(token) {
    axios.defaults.headers.common['tokenz'] = token;
  } else {
    delete axios.defaults.headers.common['tokenz'];
  }
}

export default setAuthToken;
