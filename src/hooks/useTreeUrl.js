import { logError } from '@/common/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useTreeUrl() {
    const router = useRouter();
    const [nodes, setNodes] = useState(null);
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        if (router.isReady && !nodes) {
            const { nodes } = router.query;
            try {
                if (nodes) {
                    const arr = JSON.parse(atob(nodes));
                    setNodes(arr);
                }
                setReady(true);
            } catch {
                logError('Error parsing nodes');
            }
        }
    }, [router, nodes]);

    return [nodes, isReady];
}
