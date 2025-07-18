import { useEffect, useState } from 'react';
import { auth, db, storage } from '@/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { Button, Input, Typography, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Title } = Typography;

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      setUser(currentUser);
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
      const data = docSnap.data();
      setName(data?.name || '');
      setSurname(data?.surname || '');
      setProfileUrl(data?.profileUrl || '');
      setRole(data?.role || '');
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        profileUrl,
      });
      message.success('Profile updated');
    } catch (err) {
      message.error('Failed to update');
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword.length < 6) return message.error('Password must be at least 6 characters');
      if (!currentPassword) return message.error('Please enter current password');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setNewPassword('');
      setCurrentPassword('');
      message.success('Password updated');
    } catch (err: any) {
      message.error('Error changing password: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleUpload = async ({ file }: any) => {
    if (!user) return;
    const storageRef = ref(storage, `profiles/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setProfileUrl(url);
    await updateDoc(doc(db, 'users', user.uid), { profileUrl: url });
    message.success('Profile picture updated');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>My Account</Title>
      <div style={{ marginBottom: 20 }}>
        <label>Name:</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>Surname:</label>
        <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>Current Password:</label>
        <Input.Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>New Password:</label>
        <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Button onClick={handlePasswordChange} type="primary" style={{ marginTop: 10 }}>Change Password</Button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>Profile Picture:</label><br />
        {profileUrl && <img src={profileUrl} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />}<br />
        <Upload showUploadList={false} customRequest={handleUpload}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>
      <Button type="primary" onClick={handleSave}>Save</Button>

      {role === 'admin' && (
        <Button type="default" style={{ marginLeft: 16 }} onClick={() => router.push('/add-user')}>
          Add User
        </Button>
      )}
    </div>
  );
}
