import { db, auth } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Table, Typography, Button } from 'antd';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const { Title } = Typography;

export default function ExpenseList() {
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/login');
      setUser(user);
      const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: any) =>
        val?.seconds
          ? new Date(val.seconds * 1000).toLocaleString()
          : 'Pending...',
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '50px auto' }}>
      <Title level={2}>My Expense Records</Title>
      <Button type="primary" onClick={() => router.push('/expense')} style={{ marginBottom: 16 }}>
        + Add Expense
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
