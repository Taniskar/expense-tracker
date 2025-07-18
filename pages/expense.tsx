import { db, auth } from '@/firebase/config';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, message, Typography } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const { Title } = Typography;
const defaultCategories = ['Groceries', 'Fuel', 'Rent', 'Shopping', 'Travel'];

export default function Expense() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState(defaultCategories);
  const [user, setUser] = useState<any>(null);
  const [accountGroupId, setAccountGroupId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login');
        return;
      }
      setUser(u);
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      const data = userDoc.data();
      setAccountGroupId(data?.accountGroupId || '');
    });
    return () => unsubscribe();
  }, []);

  const onFinish = async (values: any) => {
    if (!accountGroupId) {
      message.error('Account group is missing.');
      return;
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        userId: user.uid,
        accountGroupId,
        amount: values.amount,
        category: values.category,
        note: values.note || '',
        createdAt: serverTimestamp(),
      });
      message.success('Expense recorded!');
      form.resetFields();
    } catch (error: any) {
      message.error('Failed to add expense');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '100px auto' }}>
      <Title level={2}>Add Expense</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select
            options={categories.map((c) => ({ label: c, value: c }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <div style={{ padding: 8 }}>
                  <Input
                    placeholder="Add custom category"
                    onPressEnter={(e: any) => {
                      const val = e.target.value.trim();
                      if (val && !categories.includes(val)) {
                        setCategories([...categories, val]);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </>
            )}
          />
        </Form.Item>

        <Form.Item label="Note (optional)" name="note">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
