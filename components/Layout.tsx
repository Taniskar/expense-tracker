import { Layout as AntLayout, Menu } from 'antd';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const { Header, Content } = AntLayout;

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;
        setUserRole(role || null);
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { key: '/dashboard', label: 'Dashboard' },
    { key: '/income', label: 'Add Income' },
    { key: '/expense', label: 'Add Expense' },
    { key: '/income-list', label: 'Income List' },
    { key: '/expense-list', label: 'Expense List' },
    { key: '/account', label: 'Account' },
    ...(userRole === 'admin' ? [{ key: '/add-user', label: 'Add User' }] : []),
    { key: 'logout', label: 'Logout' },
  ];

  const handleClick = async (e: any) => {
    if (e.key === 'logout') {
      await signOut(auth);
      router.push('/login');
    } else {
      router.push(e.key);
    }
  };

  return (
    <AntLayout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[router.pathname]}
          onClick={handleClick}
          items={menuItems}
        />
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
