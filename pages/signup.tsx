import { useState } from 'react';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Button, Form, Input, message, Typography } from 'antd';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const user = userCredential.user;
      const groupId = uuidv4();

      await setDoc(doc(db, 'users', user.uid), {
        email: values.email,
        role: 'admin',
        accountGroupId: groupId,
      });

      message.success('Signup successful');
      router.push('/dashboard');
    } catch (error: any) {
      message.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title level={2}>Signup</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}> 
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
