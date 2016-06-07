import checkAccessToken from '../API/checkAccessToken.js'
import fetchUser from '../API/fetchUser.js'
import createUser from '../API/createUser.js'
import {
    takeEvery
} from 'redux-saga'

import {
    put,
    call
} from 'redux-saga/effects'

import {
    REQUEST_LOGIN,
    FAIL_TO_LOGIN,
    SUCCESS_LOGIN
} from '../actions/login.js'

export function* watchRequestLogin() {
    yield call(takeEvery, REQUEST_LOGIN, loginFlow)
}

export function* loginFlow(action) {
    try {
        const valid = yield call(checkAccessToken, {
            access_token: action.access_token
        })

        if (valid) {
            const user = yield call(fetchUser, {
                access_token: action.access_token
            })
            yield call(userHandler, user, {
                access_token: action.access_token
            })
        } else {
            yield put({
                type: FAIL_TO_LOGIN,
                error: 'access token not valid'
            })
        }
    } catch (error) {
        yield put({
            type: FAIL_TO_LOGIN,
            error
        })
    }
}

export function* userHandler(user, {
    access_token
}) {
    try {
        if (!!user) {
            yield put({
                type: SUCCESS_LOGIN,
                user
            })
        } else {
            const response = yield call(createUser, {
                access_token
            })
            yield put({
                type: SUCCESS_LOGIN,
                user: response
            })
        }
    } catch (error) {
        yield put({
            type: FAIL_TO_LOGIN,
            error
        })
    }
}