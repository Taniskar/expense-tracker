import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { Typography, Form, Input, Select, Button, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { withRole } from '@/utils/withRole';

const { Title } = Typography;

function AddUserPage() {
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState<string>('');

  useEffect(() => {
    const fetchGroupId = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.data();
      if (data?.role !== 'admin') {
        message.error('Only admins can add users');
        return;
      }
      setGroupId(data.accountGroupId);
    };
    fetchGroupId();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const newUser = userCred.user;
      await setDoc(doc(db, 'users', newUser.uid), {
        email: values.email,
        role: values.role,
        accountGroupId: groupId,
      });

      message.success('User added successfully');
    } catch (err: any) {
      message.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '60px auto' }}>
      <Title level={3}>Add User</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}> 
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true }]}> 
          <Input.Password />
        </Form.Item>

        <Form.Item label="Role" name="role" rules={[{ required: true }]}> 
          <Select>
            <Select.Option value="editor">Editor</Select.Option>
            <Select.Option value="viewer">Viewer</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default withRole(AddUserPage, ['admin']);