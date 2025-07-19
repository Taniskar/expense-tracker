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
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

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
        name: values.name,
        surname: values.surname,
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
      <Title level={2} style={{ textAlign: 'center' }}>Create an Account</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="First Name" name="name" rules={[{ required: true, message: 'Please enter your first name' }]}> 
          <Input placeholder="Enter your first name" />
        </Form.Item>
        <Form.Item label="Last Name" name="surname" rules={[{ required: true, message: 'Please enter your last name' }]}> 
          <Input placeholder="Enter your last name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}> 
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}> 
          <Input.Password placeholder="Create a password" />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirmPassword" dependencies={['password']} rules={[{ required: true, message: 'Please confirm your password' }]}> 
          <Input.Password placeholder="Re-type your password" />
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
