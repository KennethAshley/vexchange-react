import Web3 from "web3";
import { thorify } from 'thorify';
import axios from 'axios';

import ContractJson from "../build/contracts/exchange.json";

const web3 = thorify(new Web3(), "http://127.0.0.1:8669/");

export const setTokenAndAddress = token => {
  return (dispatch) => {
    dispatch(setToken(token));
    dispatch(getAddress());
  }
}

export const getAddress = () => {
  return (dispatch, getState) => {
    const { exchangeAddress } = getState().token;
    dispatch(setContract(exchangeAddress));
  }
}

export const setToken = token => ({
  type: 'SET_TOKEN',
  payload: token,
});

export const setContract = address => ({
  type: 'SET_CONTRACT',
  payload: new web3.eth.Contract(ContractJson.abi, address),
});

export const fetchBalancesThunk = token => {
  return (dispatch, getState) => {
    const state = getState();
    console.log(state);

    dispatch(fetchBalances(token));
  }
}
export const fetchBalances = token => ({
  type: 'FETCH_BALANCES_FULFILLED',
  payload: Promise.all([
    web3.eth.getBalance('0x012345403c589A51b02Ee27BD41339f6114aac6A'),
    web3.eth.getEnergy('0x012345403c589A51b02Ee27BD41339f6114aac6A')
  ]),
  meta: {
    token,
  }
});

export const fetchTickers = token => ({
  type: 'FETCH_TICKERS',
  payload: axios({
    url: 'http://localhost:3001/data',
    method: 'GET',
  }),
  meta: {
    token
  },
});

export const fetchFees = () => ({
  type: 'FETCH_FEES',
});

export const calculateVTHO = val => {
  return (_, getState) => {
    const { contract } = getState();
    const { getEthToTokenPrice } = contract.methods;
    const num = web3.utils.toWei(val);

    return {
      type: 'CALCULATE_VTHO',
      payload: getEthToTokenPrice(num).call(),
      meta: { web3 },
    }
  }
};

export const calculateVET = (val) => {
  return (_, getState) => {
    const { contract } = getState();
    const { getTokenToEthPrice } = contract.methods;
    const num = web3.utils.toWei(val);

    return {
      type: 'CALCULATE_VET',
      payload: getTokenToEthPrice(num).call(),
      meta: { web3 },
    };
  }
};

export const changeLanguage = (val) => {
  return {
    type: 'CHANGE_LOCALE',
    payload: val,
  }
};



