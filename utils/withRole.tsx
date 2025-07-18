import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Spin, message } from 'antd';

export function withRole(WrappedComponent: any, allowedRoles: string[]) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const checkRole = async () => {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        const userRole = data?.role;

        if (!allowedRoles.includes(userRole)) {
          message.error('Access Denied');
          router.push('/dashboard');
        } else {
          setHasAccess(true);
        }

        setLoading(false);
      };

      checkRole();
    }, []);

    if (loading) return <Spin fullscreen />;
    if (!hasAccess) return null;

    return <WrappedComponent {...props} />;
  };
}
