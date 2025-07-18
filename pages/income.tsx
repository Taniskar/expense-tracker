import { db, auth } from '@/firebase/config';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, Select, message, Typography } from 'antd';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';

const { Title } = Typography;
const defaultSources = ['Cash', 'ICICI', 'SBI', 'Friend', 'Relative'];

export default function Income() {
  const [form] = Form.useForm();
  const [sources, setSources] = useState(defaultSources);
  const [user, setUser] = useState<any>(null);
  const [groupId, setGroupId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return router.push('/login');
      setUser(u);
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      const data = userDoc.data();
      if (!data?.accountGroupId) {
        message.error('User missing group info');
        return;
      }
      setGroupId(data.accountGroupId);
    });
    return () => unsub();
  }, [router]);

  const onFinish = async (values: any) => {
    try {
      await addDoc(collection(db, 'incomes'), {
        userId: user.uid,
        accountGroupId: groupId,
        amount: values.amount,
        source: values.source,
        note: values.note || '',
        createdAt: serverTimestamp(),
      });
      message.success('Income added!');
      form.resetFields();
    } catch (error: any) {
      message.error('Failed to add income');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '100px auto' }}>
      <Title level={2}>Add Income</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}> 
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Source" name="source" rules={[{ required: true }]}> 
          <Select
            options={sources.map((s) => ({ label: s, value: s }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <div style={{ padding: 8 }}>
                  <Input
                    placeholder="Add custom source"
                    onPressEnter={(e: any) => {
                      const val = e.target.value.trim();
                      if (val && !sources.includes(val)) {
                        setSources([...sources, val]);
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
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
