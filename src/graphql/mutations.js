import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            data {
                displayName
                authToken
            }
            status
            message
        }
    }
`;

export const REGISTER = gql`
    mutation Register($email: String!, $password: String!, $displayName: String!) {
        register(email: $email, password: $password, displayName: $displayName) {
            status
            message
        }
    }
`;

export const VERIFY_EMAIL = gql`
    mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token) {
            status
            message
        }
    }
`;

export const SAVE_ALGO_DATA = gql`
    mutation SaveAlgoData($algoId: Int!, $data: String!) {
        saveAlgoData(algoId: $algoId, data: $data) {
            data {
                dataId
                algoId
                algoData
                createdOn
            }
            status
            message
        }
    }
`;

export const REMOVE_ALGO_DATA = gql`
    mutation RemoveAlgoData($dataId: Int!) {
        removeAlgoData(dataId: $dataId) {
            data
            status
            message
        }
    }
`;
