import { DatePicker, Select, Button, Card, Typography, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { UserOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function SidebarFilters({ user, selectedUserId, onFilterChange }: any) {
  const [category, setCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>(null);

  // Simulated categories; ideally fetch from DB
  const categories = [
    'Food',
    'Travel',
    'Bills',
    'Shopping',
    'Salary',
    'Freelance',
  ];

  useEffect(() => {
    onFilterChange({ category, dateRange });
  }, [category, dateRange]);

  return (
    <Card style={{ height: '100%' }}>
      <Title level={4}>Filters</Title>

      <Divider style={{ margin: '8px 0' }} />

      <Text strong>Date Range</Text>
      <RangePicker
        style={{ width: '100%', marginBottom: 12 }}
        onChange={(val) => setDateRange(val)}
      />

      <Text strong>Category</Text>
      <Select
        allowClear
        placeholder="Select category"
        style={{ width: '100%', marginBottom: 16 }}
        options={categories.map((c) => ({ label: c, value: c }))}
        onChange={(val) => setCategory(val)}
      />

      <Divider style={{ margin: '8px 0' }} />

      <Text strong>User Info</Text>
      <div style={{ marginBottom: 16 }}>
        <p><UserOutlined /> {user?.name || 'Unknown User'}</p>
        <p><Text type="secondary">{user?.email}</Text></p>
        <p>Role: {user?.role}</p>
        <p>Group ID: {user?.accountGroupId || 'N/A'}</p>
      </div>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        block
        style={{ marginBottom: 8 }}
        onClick={() => window.location.href = '/income'}
      >
        Add Income
      </Button>

      <Button
        type="primary"
        icon={<MinusCircleOutlined />}
        danger
        block
        onClick={() => window.location.href = '/expense'}
      >
        Add Expense
      </Button>
    </Card>
  );
}
