import { useEffect } from 'react';
import { showToast } from '../components/toast/toast';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_ALGO_DATA } from '../graphql/mutations';
import { GET_ALGO_DATA } from '../graphql/queries';
import { dataArrayVar } from '../common/cache';

function useAlgoData({ algoId, skipQuery }) {
    const [saveAlgoData, mr] = useMutation(SAVE_ALGO_DATA);
    const qr = useQuery(GET_ALGO_DATA, { variables: { algoId }, skip: skipQuery });
    const loading = qr.loading || mr.loading;

    useEffect(() => {
        if (mr.data) {
            const { data, status, message } = mr.data.saveAlgoData;
            if (status) {
                dataArrayVar([data, ...dataArrayVar()]);
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [mr.data])

    useEffect(() => {
        if (qr.data) {
            const { data, status, message } = qr.data.getAlgoData;
            if (status) {
                dataArrayVar([...data]);
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [qr.data])

    return { saveAlgoData, loading };
}

export default useAlgoData;
