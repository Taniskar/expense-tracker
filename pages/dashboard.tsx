import { db, auth } from '@/firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Typography, Card, Row, Col, message, Select } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CustomChart from '@/components/CustomChart';

const { Title } = Typography;

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [accountGroupId, setAccountGroupId] = useState<string>('');
  const [incomes, setIncomes] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const router = useRouter();

  const isAdmin = user?.email === 'hiren.patel2728@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        const groupId = userData?.accountGroupId || '';
        setAccountGroupId(groupId);
        setSelectedUserId(isAdmin ? 'all' : user.uid);

        const usersSnap = await getDocs(collection(db, 'users'));
        const allUsers = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(allUsers);
      }
    });
    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let incomeSnap, expenseSnap;

        if (isAdmin && selectedUserId === 'all') {
          incomeSnap = await getDocs(collection(db, 'incomes'));
          expenseSnap = await getDocs(collection(db, 'expenses'));
        } else {
          const selectedId = isAdmin ? selectedUserId : user?.uid;
          const selectedUserDoc = await getDoc(doc(db, 'users', selectedId));
          const groupId = selectedUserDoc.data()?.accountGroupId || '';
          incomeSnap = await getDocs(
            query(collection(db, 'incomes'), where('accountGroupId', '==', groupId))
          );
          expenseSnap = await getDocs(
            query(collection(db, 'expenses'), where('accountGroupId', '==', groupId))
          );
        }

        setIncomes(incomeSnap.docs.map((doc) => doc.data()));
        setExpenses(expenseSnap.docs.map((doc) => doc.data()));
      } catch (err) {
        message.error('Error fetching data');
      }
    };

    if (user) fetchData();
  }, [user, selectedUserId]);

  const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    if (e.category) {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    }
  });

  const chartData = incomes.map((item, index) => ({
    date: item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
      : `Item ${index + 1}`,
    income: item.amount || 0,
  }));

  const expenseChartData = expenses.map((item, index) => ({
    date: item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
      : `Item ${index + 1}`,
    expense: item.amount || 0,
  }));

  const pieData = Object.entries(categoryMap).map(([key, value]) => ({
    name: key,
    value,
  }));

  const spender = users.map((u) => {
    const total = expenses.filter((e) => e.userId === u.id).reduce((sum, e) => sum + e.amount, 0);
    return { name: `${u.name || ''} ${u.surname || ''}`.trim(), total };
  }).sort((a, b) => b.total - a.total)[0];

  const earner = users.map((u) => {
    const total = incomes.filter((i) => i.userId === u.id).reduce((sum, i) => sum + i.amount, 0);
    return { name: `${u.name || ''} ${u.surname || ''}`.trim(), total };
  }).sort((a, b) => b.total - a.total)[0];

  return (
    <div className='container'>
      <Title level={2}>Dashboard</Title>
      {isAdmin && (
        <div style={{ marginBottom: 20 }}>
          <Select
            value={selectedUserId}
            onChange={setSelectedUserId}
            style={{ width: 300 }}
            options={[{ label: 'Main Dashboard (All)', value: 'all' }, ...users.map((u) => ({ label: `${u.name || ''} ${u.surname || ''}`.trim(), value: u.id }))]}
          />
        </div>
      )}

      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col span={8}>
          <Card title="Total Income" bordered={false}>
            ₹ {totalIncome.toLocaleString()}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Expense" bordered={false}>
            ₹ {totalExpense.toLocaleString()}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Balance" bordered={false}>
            ₹ {balance.toLocaleString()}
          </Card>
        </Col>
      </Row>

      {isAdmin && selectedUserId === 'all' && (
        <Row gutter={16} style={{ marginBottom: 32 }}>
          <Col span={12}>
            <Card title="Top Spender" bordered={false}>
              {spender?.name || 'N/A'} — ₹ {spender?.total.toLocaleString() || 0}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Top Earner" bordered={false}>
              {earner?.name || 'N/A'} — ₹ {earner?.total.toLocaleString() || 0}
            </Card>
          </Col>
        </Row>
      )}

      <CustomChart
        title="Income Trend"
        type="line"
        data={chartData}
        labelKey="date"
        dataKey="income"
      />

      <CustomChart
        title="Expense Trend"
        type="bar"
        data={expenseChartData}
        labelKey="date"
        dataKey="expense"
      />

      <CustomChart
        title="Category Breakdown"
        type="pie"
        data={pieData}
        labelKey="name"
        dataKey="value"
      />
    </div>
  );
}