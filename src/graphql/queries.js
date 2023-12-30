import { gql } from '@apollo/client';

export const GET_ALGORITHMS = gql`
    query {
        getAlgorithms {
            data {
                catId
                catName
                algorithms {
                    algoId
                    algoName
                    pathId
                }
            }
            status
            message
        }
    }
`;

export const GET_ALGO_DATA = gql`
    query getAlgoData($algoId: Int!) {
        getAlgoData(algoId: $algoId) {
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
