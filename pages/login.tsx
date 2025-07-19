import { useState } from 'react';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Button, Form, Input, message, Typography, Card } from 'antd';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success('Login successful');
      router.push('/dashboard');
    } catch (error: any) {
      message.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right, #1f1c2c, #928dab)',
    }}>
      <Card style={{ width: 400, padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#fff' }}>Welcome Back</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<Text style={{ color: '#fff' }}>Email</Text>}
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email format' }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label={<Text style={{ color: '#fff' }}>Password</Text>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#fff' }}>Don't have an account? </Text>
            <Link href="/signup" style={{ color: '#40a9ff' }}>Sign up</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
