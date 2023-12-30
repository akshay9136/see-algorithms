import React, { useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import { DeleteOutline } from '@mui/icons-material';
import { AppContext } from '../../common/context';
import './data-items.scss';
import { createGraph } from '../../helpers/drawGraph';
import { useMutation, useReactiveVar } from '@apollo/client';
import { dataArrayVar } from '../../common/cache';
import { REMOVE_ALGO_DATA } from '../../graphql/mutations';
import { showToast } from '../toast/toast';
import { useLocation } from 'react-router-dom';

function DataItems() {
    const { setContext } = useContext(AppContext);
    const dataArray = useReactiveVar(dataArrayVar);
    const location = useLocation();

    const [removeAlgoData, { loading }] = useMutation(REMOVE_ALGO_DATA, {
        onCompleted(data) {
            const { data: dataId, status, message } = data.removeAlgoData;
            if (status) {
                dataArrayVar(dataArrayVar().filter((x) => x.dataId !== dataId));
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });

    const handleSelect = (algoData) => {
        const { catName } = location.state;
        const data = JSON.parse(algoData);
        switch (catName) {
            case 'Graph':
                createGraph(data);
                setContext({
                    isDirGraph: data.directed,
                    playStatus: 0,
                });
                break;
            default:
        }
    };

    const handleRemove = (e, dataId) => {
        e.stopPropagation();
        removeAlgoData({ variables: { dataId } });
    };

    return (
        <List
            className={'dataItems ' + (loading ? 'blur' : '')}
            subheader={
                <ListSubheader component="div" className="listHeader">
                    Saved Data Items
                </ListSubheader>
            }
        >
            {dataArray.map(({ dataId, algoData, createdOn }) => (
                <ListItem
                    button
                    key={dataId}
                    className="listItem"
                    onClick={() => handleSelect(algoData)}
                >
                    <ListItemText
                        primary={new Date(createdOn + ' UTC').toLocaleString()}
                        className="listItemText"
                    />
                    <ListItemIcon onClick={(e) => handleRemove(e, dataId)}>
                        <DeleteOutline className="deleteIcon" />
                    </ListItemIcon>
                </ListItem>
            ))}
        </List>
    );
}

export default DataItems;
