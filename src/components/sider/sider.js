import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Category, MeetingRoom } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import './sider.scss';
import { showMenu } from '../menu/menu';
import { useReactiveVar } from '@apollo/client';
import { categoriesVar, userAuthVar } from '../../common/cache';

function Sider(props) {
    const categories = useReactiveVar(categoriesVar);
    const userAuth = useReactiveVar(userAuthVar);
    const history = useHistory();

    const handleSelect = ({ value, data }) => {
        const params = new URLSearchParams(data).toString();
        history.push(`${value}?${params}`);
        props.onClose();
    };

    const getMenuOptions = (e) => ({
        anchorEl: e.currentTarget,
        anchorOrigin: { vertical: 'center', horizontal: 'center' },
        onSelect: handleSelect,
    });

    return (
        <List className="sider">
            {categories.map(({ catName, algorithms }) => (
                <ListItemButton
                    key={catName}
                    className="listItem"
                    onClick={(e) => {
                        showMenu({
                            ...getMenuOptions(e),
                            menuItems: algorithms.map(
                                ({ algoName, pathId }) => ({
                                    label: algoName,
                                    value: pathId,
                                    data: { algoName, catName },
                                })
                            ),
                        });
                    }}
                >
                    <ListItemIcon>
                        <Category className="listItemIcon" />
                    </ListItemIcon>
                    <ListItemText primary={catName} className="listItemText" />
                </ListItemButton>
            ))}
            {userAuth && (
                <ListItemButton
                    className="listItem logout"
                    onClick={() => {
                        userAuthVar(null);
                        localStorage.removeItem('userAuth');
                        props.onClose();
                        history.push('/');
                    }}
                >
                    <ListItemIcon>
                        <MeetingRoom className="listItemIcon" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" className="listItemText" />
                </ListItemButton>
            )}
        </List>
    );
}

export default Sider;
