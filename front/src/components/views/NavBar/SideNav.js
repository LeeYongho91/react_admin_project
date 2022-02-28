import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListIcon from '@mui/icons-material/List';
import RedeemIcon from '@mui/icons-material/Redeem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nestedSecondLevel: {
    paddingLeft: theme.spacing(8),
  },
}));

function MainListItems() {
  const classes = useStyles();
  const [UserOpen, setUserOpen] = useState(false);
  const [ProductOpen, setProductOpen] = useState(false);
  const [ManageOpen, setManageOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = type => {
    setUserOpen(false);
    setProductOpen(false);
    setManageOpen(false);

    if (type === 'user') {
      setUserOpen(!UserOpen);
    } else if (type === 'product') {
      setProductOpen(!ProductOpen);
    } else if (type === 'manage') {
      setManageOpen(!ManageOpen);
    }
  };

  const moveRouter = url => {
    navigate(`${url}`);
  };

  return (
    <>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="대시보드" onClick={() => moveRouter('/')} />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText
          primary="주문관리"
          onClick={() => moveRouter('payment')}
        />
      </ListItemButton>
      <ListItem button onClick={() => handleClick('user')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="유저관리" />
        {UserOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={UserOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="유저리스트"
              onClick={() => moveRouter('/user/list')}
            />
          </ListItem>
        </List>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="유저등록"
              onClick={() => moveRouter('/user/register')}
            />
          </ListItem>
        </List>
      </Collapse>
      <ListItem button onClick={() => handleClick('product')}>
        <ListItemIcon>
          <RedeemIcon />
        </ListItemIcon>
        <ListItemText primary="상품관리" />
        {ProductOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={ProductOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="상품리스트"
              onClick={() => moveRouter('/product/list')}
            />
          </ListItem>
        </List>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="상품등록"
              onClick={() => moveRouter('/product/register')}
            />
          </ListItem>
        </List>
      </Collapse>
      <ListItem button onClick={() => handleClick('manage')}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="운영관리" />
        {ManageOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={ManageOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="운영자리스트"
              onClick={() => moveRouter('/admin/list')}
            />
          </ListItem>
        </List>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <MoreHorizIcon />
            </ListItemIcon>
            <ListItemText
              primary="운영자등록"
              onClick={() => moveRouter('/admin/register')}
            />
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}

export default MainListItems;
