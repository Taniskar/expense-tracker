import { db, auth } from '@/firebase/config';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { Table, Typography, Button, Space, Upload, Modal, InputNumber, Select, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const { Title } = Typography;

export default function IncomeList() {
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const router = useRouter();

  const fetchData = async (uid: string) => {
    const q = query(collection(db, 'incomes'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setData(items);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/login');
      setUser(user);
      fetchData(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'incomes', id));
    message.success('Income deleted');
    fetchData(user.uid);
  };

  const handleEdit = (record: any) => {
    setEditingIncome(record);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    const { id, amount, source, note } = editingIncome;
    await updateDoc(doc(db, 'incomes', id), { amount, source, note });
    setEditModalVisible(false);
    message.success('Income updated');
    fetchData(user.uid);
  };

  const columns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Source', dataIndex: 'source', key: 'source' },
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '50px auto' }}>
      <Title level={2}>My Income Records</Title>
      <Button type="primary" onClick={() => router.push('/income')} style={{ marginBottom: 16 }}>
        + Add Income
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Edit Income"
        visible={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
      >
        <InputNumber
          style={{ width: '100%', marginBottom: 12 }}
          min={0}
          value={editingIncome?.amount}
          onChange={(val) => setEditingIncome({ ...editingIncome, amount: val })}
        />
        <Select
          style={{ width: '100%', marginBottom: 12 }}
          value={editingIncome?.source}
          onChange={(val) => setEditingIncome({ ...editingIncome, source: val })}
          options={[{ value: 'Cash' }, { value: 'Bank' }, { value: 'Other' }]}
        />
        <Input
          value={editingIncome?.note}
          onChange={(e) => setEditingIncome({ ...editingIncome, note: e.target.value })}
          placeholder="Note"
        />
        <Upload
          beforeUpload={() => false}
          style={{ marginTop: 12 }}
        >
          <Button icon={<UploadOutlined />}>Attach Image (Optional)</Button>
        </Upload>
      </Modal>
    </div>
  );
}
