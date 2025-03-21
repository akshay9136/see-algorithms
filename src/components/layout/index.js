import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import Header from '../header';
import Meta from '../meta';
import Sider from '../sider';
import { algorithms } from '@/common/appData';
import { useRouter } from 'next/router';

function Layout({ children }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const algoId = router.pathname.split('/')[2];
  const { name, meta } = algorithms.find((a) => a.id == algoId) || {};

  useEffect(() => {
    setMenuVisible(false);
  }, [router.pathname]);

  return (
    <>
      <Header toggleMenu={() => setMenuVisible(!menuVisible)} />
      <Drawer
        anchor="left"
        open={menuVisible}
        onClose={() => setMenuVisible(false)}
        className="drawer"
        PaperProps={{ className: 'paper' }}
        slotProps={{
          backdrop: { className: 'backdrop' },
        }}
      >
        <Sider selected={algoId} />
      </Drawer>
      <Meta title={name} description={meta} />
      <div className="d-flex contentRow">
        <div
          className="d-none d-md-block"
          style={{ width: 'max-content', minWidth: 240 }}
        >
          <Sider selected={algoId} />
        </div>
        <div className="content m-0">
          <div style={{ padding: '1rem 1.5rem' }}>
            {algoId && <h5 className="my-3">{name}</h5>}
            {children}
          </div>
          {/* {savedData.length > 0 && <DataItems />} */}
        </div>
      </div>
    </>
  );
}

export default Layout;
